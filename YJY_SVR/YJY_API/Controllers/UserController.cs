using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using AutoMapper;
using EntityFramework.Extensions;
using ServiceStack.Text;
using YJY_COMMON;
using YJY_COMMON.Azure;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_COMMON.Util.Extension;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_API.DTO.FormDTO;
using YJY_COMMON.SMS;
using System.Collections.Generic;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : YJYController
    {
        public UserController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        private static readonly TimeSpan VERIFY_CODE_PERIOD = TimeSpan.FromHours(1);
        private const int NICKNAME_MAX_LENGTH = 8;

        [HttpPost]
        [Route("signupByPhone")]
        public SignupResultDTO SignupByPhone(SignupByPhoneFormDTO form)
        {
            var result = new SignupResultDTO();

            if (string.IsNullOrWhiteSpace(form.phone) || string.IsNullOrWhiteSpace(form.verifyCode))
            {
                result.success = false;
                result.message = "invalid form data";
                return result;
            }

            form.phone = form.phone.Trim();
            form.verifyCode = form.verifyCode.Trim();

            if (IsLoginBlocked(form.phone))
            {
                result.success = false;
                result.message = Resources.Resource.PhoneSignupForbidden;
                return result;
            }

            //verify this login
            var dtValidSince = DateTime.UtcNow - VERIFY_CODE_PERIOD;
            var verifyCodes = db.VerifyCodes.Where(o => o.Phone == form.phone && o.Code == form.verifyCode && o.SentAt > dtValidSince);

            //auth success
            if ( verifyCodes.Any() )
            {
                var user = db.Users.FirstOrDefault(o => o.Phone == form.phone);

                if (user == null) //phone doesn't exist
                {
                    var userService = new UserService(db);
                    userService.CreateUserByPhone(form.phone);

                    //refetch
                    user = db.Users.FirstOrDefault(o => o.Phone == form.phone);

                    //default nickname
                    var nickname = "u" + user.Id.ToString("000000");
                    user.Nickname = nickname;

                    //check duplicate nickname and generate random suffix
                    int tryCount = 0;
                    while (db.Users.Any(o => o.Id != user.Id && o.Nickname == user.Nickname))
                    {
                        user.Nickname = nickname.TruncateMax(4) + Randoms.GetRandomAlphabeticString(4);

                        tryCount++;

                        if (tryCount > 10)
                        {
                            YJYGlobal.LogError(
                                "Tryout exceeded: signupByPhone - check duplicate nickname and generate random suffix. userid: " +
                                user.Id);
                            break;
                        }
                    }

                    //default avatar
                    user.PicUrl = Blob.GetRandomUserDefaultPicUrl();

                    db.SaveChanges();

                    result.success = true;
                    result.isNewUser = true;
                    result.userId = user.Id;
                    result.token = user.AuthToken;
                }
                else //phone exists
                {
                    //generate a new token
                    if(form.source != "Web")
                    {
                        user.AuthToken = UserService.NewToken();
                    }

                    if(string.IsNullOrEmpty(user.AuthToken))
                    {
                        user.AuthToken = UserService.NewToken();
                    }

                    db.SaveChanges();

                    if (user.ActiveBalanceId == null) //do this for existing users' data in the db (after the multi-balance update)
                    {
                        var balance = db.Balances.FirstOrDefault(o => o.UserId == user.Id);
                        if (balance == null)
                        {
                            var balanceType = db.BalanceTypes.FirstOrDefault(o => o.Id == 1);
                            balance = new Balance()
                            {
                                Amount = balanceType.InitAmount,
                                TypeId = balanceType.Id,
                                UserId = user.Id,
                            };
                            db.Balances.Add(balance);
                            db.SaveChanges();
                        }

                        user.ActiveBalanceId = balance.Id;
                        db.SaveChanges();
                    }

                    result.success = true;
                    result.isNewUser = false;
                    result.userId = user.Id;
                    result.token = user.AuthToken;
                }
            }
            else
            {
                //add login history ONLY WHEN AUTH FAILED
                db.PhoneSignupHistories.Add(new PhoneSignupHistory() { CreateAt = DateTime.UtcNow, Phone = form.phone, InputCode = form.verifyCode});
                db.SaveChanges();

                result.success = false;
                result.message = Resources.Resource.InvalidVerifyCode;
            }

            return result;
        }

        private bool IsLoginBlocked(string phone)
        {
            var oneDayAgo = DateTime.UtcNow.AddDays(-1);
            var phoneList = db.PhoneSignupHistories.Where(item => item.CreateAt >= oneDayAgo && item.Phone == phone).ToList();

            //3 in 1 minute
            //10 in 1 hour
            //20 in 1 day
            if (phoneList.Count(item => (DateTime.UtcNow - item.CreateAt) <= TimeSpan.FromMinutes(1)) >= 3
                || phoneList.Count(item => (DateTime.UtcNow - item.CreateAt) <= TimeSpan.FromHours(1)) >= 10
                || phoneList.Count >= 20)
            {
                return true;
            }

            return false;
        }

        [HttpGet]
        [Route("me")]
        [BasicAuth]
        public MeDTO GetMe()
        {
            var user = GetUser();

            var userDto = Mapper.Map<MeDTO>(user);

            return userDto;
        }

        /// <summary>
        /// 模拟盘用户返回0，实盘用户返回账户余额
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("refund/availBalance")]
        [BasicAuth]
        public object GetRefundableBalance()
        {
            var balance = (from u in db.Users
                             join b in db.Balances on u.ActiveBalanceId equals b.Id
                             where u.Id == this.UserId
                             select b).FirstOrDefault();

            var userQRCode = db.UserQRCodes.OrderByDescending(u => u.CreatedAt).FirstOrDefault(u => u.UserID == this.UserId);

            decimal balanceAmount = 0;

            if(balance == null || balance.TypeId == 1) //模拟盘
            {
                balanceAmount = 0;
            }
            else
            {
                balanceAmount = balance.Amount.Value;
            }

            string QRCodeStr = string.Empty;
            if(userQRCode != null)
            {
                QRCodeStr = userQRCode.QRCode;
            }

            return new {
                Amount = balanceAmount,
                QRCode = QRCodeStr
            };
        }

        [HttpGet]
        [Route("deposit")]
        [BasicAuth]
        public ResultDTO Deposit(decimal amount)
        {
            string orderNum = (new Random()).Next(0, 999).ToString().PadLeft(3, '0');

            db.Deposits.Add(new Deposit()
            {
                OrderNum = orderNum,
                Amount = amount,
                CreatedAt = DateTime.UtcNow.AddHours(8),
                Status = (int)DepositStatus.Unpaid,
                 UserId = this.UserId
            });

            db.SaveChanges();

            ResultDTO result = new ResultDTO();
            result.success = true;
            result.message = orderNum;

            return result;
        }

        [HttpPost]
        [Route("refund")]
        [BasicAuth]
        public ResultDTO Refund(Refund refund)
        {
            ResultDTO result = new ResultDTO();
            result.success = true;

            var user = db.Users.FirstOrDefault(u => u.Id == this.UserId);
            if (user != null)
            {
                var balance = db.Balances.FirstOrDefault(b => b.Id == (user.ActiveBalanceId ?? 0));

                if(balance.TypeId != 2)
                {
                    result.success = false;
                    result.message = "不是实盘账户，无法出金";
                    return result;
                }

                if (balance != null && balance.Amount >= refund.Amount)
                {
                    balance.Amount -= refund.Amount;
                }
                else
                {
                    result.success = false;
                    result.message = "账户余额不足，无法出金";
                    return result;
                }
            }

            db.Refunds.Add(new YJY_COMMON.Model.Entity.Refund() {
                 Amount = refund.Amount,
                  CreatedAt = DateTime.UtcNow.AddHours(8),
                UserId = this.UserId,                   
            });

            string adminPhone = db.Miscs.FirstOrDefault(m => m.Key == "refundAdmin").Value;
            string sendResult = YunPianSMS.SendSms("【盈交易】有一笔新的申请，请在后台查看", adminPhone);
            
            db.SaveChanges();

            result.success = true;

            return result;
        }

        [HttpPost]
        [Route("refund/uploadQRCode")]
        [BasicAuth]
        public ResultDTO UploadQRCode(Refund refund)
        {
            db.UserQRCodes.Add(new UserQRCode() {
                 UserID = this.UserId,
                  QRCode = refund.QRCode,
                   CreatedAt = DateTime.UtcNow.AddHours(8),
            });

            db.SaveChanges();

            ResultDTO result = new ResultDTO();
            result.success = true;

            return result;
        }

        [HttpPut]
        [Route("nickname")]
        [BasicAuth]
        public ResultDTO SetNickname(SetNicknameFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.nickname))
                return new ResultDTO {success = false};

            form.nickname = form.nickname.Trim();

            //if (form.nickname.Length > NICKNAME_MAX_LENGTH)
            //    return new ResultDTO() { success = false, message = "nickname too long" };

            var regex = new Regex("^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$");
            if (!regex.IsMatch(form.nickname))
                return new ResultDTO() { success = false, message = "nickname does not meet criteria" };

            if (db.Users.Any(o => o.Id != UserId && o.Nickname == form.nickname))
                return new ResultDTO
                {
                    success = false,
                    message = Resources.Resource.NicknameExisted,
                };

            var user = GetUser();
            user.Nickname = form.nickname;
            db.SaveChanges();

            return new ResultDTO { success = true };
        }

        [HttpPut]
        [Route("avatar")]
        [BasicAuth]
        public ResultDTO SetUserPic()
        {
            var requestString = Request.Content.ReadAsStringAsync().Result;
            var bytes = Convert.FromBase64String(requestString);

            var user = GetUser();

            //upload new pic
            string fileName = user.Id + "_" + DateTime.UtcNow.ToUnixTimeMs() + "_" + Guid.NewGuid().ToString("N");
            Blob.UploadFromBytes(Blob.USER_PIC_BLOB_CONTAINER_NAME, fileName, bytes);

            user.PicUrl = Blob.USER_PIC_FOLDER_URL + fileName;
            db.SaveChanges();

            return new ResultDTO {success = true};
        }

        [HttpGet]
        [Route("{userId}")]
        public UserDTO GetUser(int userId)
        {
            var user = db.Users.FirstOrDefault(o => o.Id == userId);

            var userDto = Mapper.Map<UserDTO>(user);

            var tryGetAuthUser = TryGetAuthUser();
            if (tryGetAuthUser != null)
            {
                userDto.isFollowing = db.UserFollows.Any(o => o.UserId == tryGetAuthUser.Id && o.FollowingId == userId);

                var tradeFollow = db.UserTradeFollows.FirstOrDefault(o => o.UserId == tryGetAuthUser.Id && o.FollowingId == userId);
                if (tradeFollow != null)
                    userDto.followTrade = Mapper.Map<FollowTradeDTO>(tradeFollow);
            }

            userDto.followerCount = db.UserFollows.Count(o => o.FollowingId == userId);
            userDto.followTraderCount = db.UserTradeFollows.Count(o => o.FollowingId == userId);

            return userDto;
        }

        [HttpPut]
        [Route("follow/{followingId}")]
        [BasicAuth]
        public ResultDTO SetFollowing(int followingId)
        {
            if (followingId <= 0)
                return new ResultDTO(false);

            if (UserId == followingId)
                return new ResultDTO(false);

            var any = db.UserFollows.Any(o => o.UserId == UserId && o.FollowingId == followingId);

            if (!any)
            {
                db.UserFollows.Add(new UserFollow()
                {
                    UserId = UserId,
                    FollowingId = followingId,
                    FollowAt = DateTime.UtcNow
                });
                db.SaveChanges();
            }

            return new ResultDTO(true);
        }

        [HttpDelete]
        [Route("follow/{followingId}")]
        [BasicAuth]
        public ResultDTO DeleteFollowing(int followingId)
        {
            if (UserId == followingId)
                return new ResultDTO(false);

            db.UserFollows.Where(o => o.UserId == UserId && o.FollowingId == followingId).Delete();

            return new ResultDTO(true);
        }

        [HttpPut]
        [Route("followTrade/{followingId}")]
        [BasicAuth]
        public ResultDTO SetFollowTrade(int followingId, SetFollowTradeFormDTO form)
        {
            if (followingId <= 0)
                return new ResultDTO(false);

            if (UserId == followingId)
                return new ResultDTO(false);

            if(form.investFixed<=0 || form.investFixed>10000)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,"invalid invest"));

            if (form.stopAfterCount <= 0)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid stop count"));

            var tradeFollow = db.UserTradeFollows.FirstOrDefault(o => o.UserId == UserId && o.FollowingId == followingId);

            if (tradeFollow==null)
            {
                db.UserTradeFollows.Add(new UserTradeFollow()
                {
                    UserId = UserId,
                     FollowingId= followingId,
                    CreateAt = DateTime.UtcNow,
                    InvestFixed = form.investFixed,
                    StopAfterCount = form.stopAfterCount,
                });
                db.SaveChanges();
            }
            else
            {
                tradeFollow.InvestFixed = form.investFixed;
                tradeFollow.StopAfterCount = form.stopAfterCount;
                tradeFollow.UpdateAt = DateTime.UtcNow;
                db.SaveChanges();
            }

            return new ResultDTO(true);
        }

        [HttpDelete]
        [Route("followTrade/{followingId}")]
        [BasicAuth]
        public ResultDTO DeleteFollowTrade(int followingId)
        {
            if (UserId == followingId)
                return new ResultDTO(false);

            db.UserTradeFollows.Where(o => o.UserId == UserId && o.FollowingId == followingId).Delete();

            return new ResultDTO(true);
        }

        [HttpGet]
        [Route("followTrade/option")]
        public FollowTradeOptionDTO GetFollowTradeOption()
        {
            return new FollowTradeOptionDTO()
            {
                investFixed = new int[] {10,20,30,40,50,60,70,80,90,100},
                stopAfterCount = new int[] {1,2,3,4,5},
            };
        }

        [HttpGet]
        [Route("balanceType")]
        [BasicAuth]
        public string GetBalanceType()
        {
            var user = GetUser();
            var balance = db.Balances.FirstOrDefault(o => o.Id == user.ActiveBalanceId);
            var balanceType = db.BalanceTypes.FirstOrDefault(o => o.Id == balance.TypeId);
            return balanceType.Code;
        }

        [HttpPut]
        [Route("balanceType")]
        [BasicAuth]
        public ResultDTO SetBalanceType(BalanceTypeFormDTO form)
        {
            var balanceType = db.BalanceTypes.FirstOrDefault(o => o.Code == form.balanceType);

            if(balanceType==null)
                return new ResultDTO(false);

            var user = GetUser();
            if(user.ActiveBalanceId==balanceType.Id)
                return new ResultDTO(true);

            var balance = db.Balances.FirstOrDefault(o => o.UserId == user.Id && o.TypeId == balanceType.Id);
            if (balance == null)
            {
                balance = new Balance()
                {
                    Amount = balanceType.InitAmount,
                    TypeId = balanceType.Id,
                    UserId = user.Id,
                };
                db.Balances.Add(balance);
                db.SaveChanges();
            }

            user.ActiveBalanceId = balance.Id;
            db.SaveChanges();

            return new ResultDTO(true);
        }

        /// <summary>
        /// 师徒关系
        /// </summary>
        [HttpGet]
        [Route("students")]
        [BasicAuth]
        public TeacherStudentDTO GetStudents(int page=0, int pageSize = 10)
        {
            TeacherStudentDTO dto = new TeacherStudentDTO();

            var teacher = GetUser();

            //计算分红数，按照所有学生交易量的1/10000
            //交易的时间要在注册师徒关系时间之后
            var allStudents = (from p in (from u in db.Users
                            join p in db.Positions on u.Id equals p.UserId
                            where u.RegisterCode == teacher.InvitationCode && p.CreateTime >= u.RegisteredAt
                            select new { User = u, Position = p })
                            group p by p.User.Id into g
                            select new Student
                            {
                                Id = g.Key,
                                NickName = g.FirstOrDefault(u => u.User.Id == g.Key).User.Nickname,
                                PicUrl = g.FirstOrDefault(u => u.User.Id == g.Key).User.PicUrl,
                                Phone = g.FirstOrDefault(u => u.User.Id == g.Key).User.Phone,
                                BindAt = g.FirstOrDefault(u => u.User.Id == g.Key).User.CreatedAt,
                                TradeVolume = g.Sum(p => p.Position.Leverage * p.Position.Invest) ?? 0
                            }).OrderByDescending(s=>s.BindAt).ToList();

            dto.Students = allStudents.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            dto.Total = allStudents.Count;
            dto.Profit = allStudents.Sum(s => s.TradeVolume) * 1 / 10000;
            dto.InvitationCode = teacher.InvitationCode;

            return dto;
        }

        /// <summary>
        /// 徒弟每个月的交易量
        /// </summary>
        /// <param name="sid"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("students/{sid}")]
        [BasicAuth]
        public List<StudentMonthProfit> GetStudentMonthProfit(int sid)
        {            
            var student = db.Users.FirstOrDefault(u => u.Id == sid);
            var oneYearAgo = DateTime.UtcNow.AddYears(-1);
            //交易的时间要在注册师徒关系时间之后,统计一年以内
            var studentMonthProfit = (from p in db.Positions 
                               where p.UserId == sid && p.CreateTime >= student.RegisteredAt 
                               && p.CreateTime >= oneYearAgo
                                      orderby p.CreateTime descending
                               group p by p.CreateTime.Value.Month into g
                               select new StudentMonthProfit
                               {
                                   Month = g.Key,
                                   TradeVolume = g.Sum(c=>c.Leverage * c.Invest)?? 0
                               }).ToList();

            return studentMonthProfit;
        }

        [HttpPut]
        [Route("code")]
        [BasicAuth]
        public ResultDTO SetRegisterCode(SetCodeFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.code))
                return new ResultDTO { success = false };

            form.code = form.code.Trim();
         
            var user = GetUser();
            //if(!string.IsNullOrEmpty(user.RegisterCode))
            //{
            //    return new ResultDTO { success = false };
            //}

            user.RegisterCode = form.code;
            user.RegisteredAt = DateTime.UtcNow.AddHours(8);
            db.SaveChanges();

            return new ResultDTO { success = true };
        }
    }
}