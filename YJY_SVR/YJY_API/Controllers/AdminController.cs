using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_API.Controllers;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Service;
using YJY_API.DTO;
using YJY_API.Controllers.Attributes;
using YJY_COMMON.Model.Entity;
using System;
using YJY_COMMON.Util;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/admin")]
    public class AdminController : YJYController
    {
        public AdminController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpPost]
        [Route("login")]
        public AdminUserDTO Login(AdminLoginFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.email) || string.IsNullOrWhiteSpace(form.password))
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid request"));

            var user = db.AdminUsers.FirstOrDefault(o => o.Email == form.email && o.Password == form.password);

            if (user == null)
                return null;

            user.Token = UserService.NewToken();
            db.SaveChanges();

            return new AdminUserDTO()
            {
                id=user.Id,
                token = user.Token
            };
        }

        [HttpGet]
        [Route("deposit")]
        [AdminAuth]
        public object GetDepositList(string orderNum = null, int page = 1, int pageSize = 10, int? status = null)
        {
            var depositQuery = db.Deposits.AsQueryable();

            if(!string.IsNullOrEmpty(orderNum))
            {
                depositQuery = depositQuery.Where(d => d.OrderNum.Contains(orderNum));
            }

            if(status != null)
            {
                depositQuery = depositQuery.Where(d => d.Status == status.Value);
            }

            int total = depositQuery.Count();
            int pending = depositQuery.Where(d => d.Status == 0).Count();

            var result = (from d in depositQuery
                          join u in db.Users on d.UserId equals u.Id
                          select new
                          {
                              Deposit = d,
                              User = u
                          }).OrderByDescending(u=>u.Deposit.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToList();


            var data = result.Select(r => new {
                Id = r.Deposit.Id,
                Amount = r.Deposit.Amount,
                NickName = r.User.Nickname,
                Phone = r.User.Phone,
                CreatedAt = r.Deposit.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                OrderNum = r.Deposit.OrderNum,
                ReceivedAmount = r.Deposit.ReceivedAmount,
                Status = r.Deposit.Status,
                StatusStr = getStatusStr(r.Deposit.Status),
            }).ToList();

            return new {
                total = total,
                pending = pending,
                data = data
            };
        }

        private string getStatusStr(int status)
        {
            string statusStr = "状态未知";

            switch(status)
            {
                case 0: statusStr = "未支付"; break;
                case 1: statusStr = "已支付未充值"; break;
                case 2: statusStr = "已充值"; break;
            }

            return statusStr;
        }

        [HttpPut]
        [Route("deposit")]
        [AdminAuth]
        public ResultDTO EditDeposit(Deposit deposit)
        {
            var depositEdit = db.Deposits.FirstOrDefault(d => d.Id == deposit.Id);
            if(depositEdit != null)
            {
                depositEdit.Status = deposit.Status;
                depositEdit.ReceivedAmount = deposit.ReceivedAmount;
                if (deposit.Status == 2)
                {
                    depositEdit.PayAt = DateTimes.UtcToChinaTime(DateTime.UtcNow);

                    var user = db.Users.FirstOrDefault(u => u.Id == depositEdit.UserId);
                    if(user != null)
                    {
                        var balance = db.Balances.FirstOrDefault(b => b.Id == (user.ActiveBalanceId ?? 0));
                        if(balance != null) //已经存在Balance
                        {
                            if(balance.TypeId == 1) //模拟盘的Balance
                            {
                                var newBalance = new Balance()
                                {
                                    Amount = deposit.ReceivedAmount,
                                    TypeId = 2,
                                    UserId = depositEdit.UserId
                                };
                                db.Balances.Add(newBalance);
                                db.SaveChanges();

                                user.ActiveBalanceId = newBalance.Id;
                            }
                            else //实盘的Balance
                            {
                                balance.Amount += deposit.ReceivedAmount;
                            }
                        }
                        else
                        {
                            var newBalance = new Balance() {
                                Amount = deposit.ReceivedAmount,
                                 TypeId = 2,
                                  UserId = depositEdit.UserId
                            };
                            db.Balances.Add(newBalance);
                            db.SaveChanges();

                            user.ActiveBalanceId = newBalance.Id;

                        }
                    }

                }
                db.SaveChanges();
            }

            ResultDTO dto = new ResultDTO();
            dto.success = true;

            return dto;
        }

        [HttpPut]
        [Route("refund")]
        [AdminAuth]
        public ResultDTO EditRefund(Refund refund)
        {
            var refundEdit = db.Refunds.FirstOrDefault(r => r.Id == refund.Id);
            if (refundEdit != null)
            {
                refundEdit.Status = refund.Status;
                if(refund.Status == 1)//出金支付时间
                {
                    refundEdit.PayAmount = refund.PayAmount;
                    refundEdit.PayAt = DateTimes.UtcToChinaTime(DateTime.UtcNow);
                }
                
                db.SaveChanges();
            }

            ResultDTO dto = new ResultDTO();
            dto.success = true;

            return dto;
        }

        [HttpGet]
        [Route("refund/{id}")]
        [AdminAuth]
        public object GetRefund(int id)
        {
            var refund = db.Refunds.FirstOrDefault(r => r.Id == id);

            if(refund != null)
            {
                var user = db.Users.FirstOrDefault(u => u.Id == refund.UserId);
                if(user != null)
                {
                    var qrCode = db.UserQRCodes.OrderByDescending(u => u.CreatedAt).FirstOrDefault();

                    string qrCodeStr = string.Empty;

                    if(qrCode != null)
                    {
                        qrCodeStr = qrCode.QRCode;
                    }

                    return new
                    {
                        Id = refund.Id,
                        QRCode = qrCodeStr,
                        NickName = user.Nickname,
                        Phone = user.Phone,
                        Amount = refund.Amount,
                        CreatedAt = refund.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
                    };
                }
                
            }

            return null;
        }

        [HttpGet]
        [Route("refund/all")]
        [AdminAuth]
        public object GetAllRefund(int page = 1, int pageSize = 10)
        {
            int total = db.Refunds.Count();
            int pending = db.Refunds.Where(r => r.Status == 0).Count();

            var result = (from r in db.Refunds
                          join u in db.Users on r.UserId equals u.Id
                          orderby r.CreatedAt descending
                          select new {
                              Id = r.Id,
                              NickName = u.Nickname,
                              Phone = u.Phone,
                              Amount = r.Amount,
                              CreatedAt = r.CreatedAt,
                              Status = r.Status,
                              StatusStr = r.Status == 0? "未支付" : "已支付"
                          }).Skip((page - 1) * pageSize).Take(pageSize).ToList();



            return new {
                total = total,
                pending = pending,
                data = result
        };
        }
    }
}