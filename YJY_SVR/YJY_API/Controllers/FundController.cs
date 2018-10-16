using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using Newtonsoft.Json.Linq;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_COMMON.Util.Extension;
using YJY_API.Caching;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_API.DTO.FormDTO;
using Newtonsoft.Json;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/fund")]
    public class FundController : YJYController
    {
        public FundController(YJYEntities db, IMapper mapper) : base(db,mapper)
        {
        }

        [HttpGet]
        [Route("balance")]
        [BasicAuth]
        public BalanceDTO GetBalance()
        {
            var user = GetUser();

            var balance = db.Balances.FirstOrDefault(o => o.Id == user.ActiveBalanceId);

            var openPositions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt == null && o.BalanceId==balance.Id).ToList();
            var quotes = WebCache.Instance.Quotes;
            var sumOfPositionValue =
                openPositions.Sum(
                    p => Trades.CalculatePL(p, quotes.FirstOrDefault(q => q.Id == p.SecurityId)) + p.Invest.Value);

            return new BalanceDTO()
            {
                balance = balance.Amount.Value,
                total = balance.Amount.Value + sumOfPositionValue,
                balanceType = balance.TypeId == 1 ? "Demo" : "Live"
            };
        }

        [HttpGet]
        [Route("~/api/user/{userId}/balance")]
        [AdminAuth]
        public List<BalanceDTO> GetUserBalance(int userId)
        {
            var balances = db.Balances.Where(o => o.UserId == userId).ToList();

            var balanceTypes = db.BalanceTypes.ToList();

            var result = new List<BalanceDTO>();

            balances.ForEach(o =>
            {
                var b=new BalanceDTO()
                {
                    balance = o.Amount.Value,
                    id = o.Id,
                };
                var t = balanceTypes.FirstOrDefault(p => p.Id == o.TypeId);
                b.type=new BalanceTypeDTO()
                {
                    id = t.Id,
                    code = t.Code,
                    precision = t.Precision,
                };

                result.Add(b);
            });

            return result;
        }

        [HttpGet]
        [Route("balance/type")]
        public List<BalanceTypeDTO> GetBalanceTypes()
        {
            var balanceTypes= db.BalanceTypes.ToList().Select(o => Mapper.Map<BalanceTypeDTO>(o)).ToList();
            var investSettings = db.InvestSettings.ToList();
            foreach (var type in balanceTypes)
            {
                type.investValues = investSettings.Where(o => o.BalanceTypeId == type.id).OrderBy(o => o.DisplayOrder)
                    .Select(o =>o.Amount.Value).ToArray();
            }
            return balanceTypes;
        }

        [HttpGet]
        [Route("transfer")]
        [BasicAuth]
        public List<TransferDTO> GetTransferHistory(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            var user = GetUser();

            var transfers =
                db.Transfers.Where(o => o.UserId == UserId && o.BalanceId==user.ActiveBalanceId)
                    .OrderByDescending(o => o.Time)
                    .Skip((pageNum - 1)*pageSize)
                    .Take(pageSize)
                    .ToList();
            var result = transfers.Select(o => Mapper.Map<TransferDTO>(o)).ToList();
            foreach (var t in result)
            {
                t.type = (string) HttpContext.GetGlobalResourceObject("Resource", "TransferType_" + t.type);
            }
            return result;
        }

        [HttpPut]
        [Route("THT/address")]
        [BasicAuth]
        public ResultDTO SetTHTAddress(THTAddressFormDTO form)
        {
            if(string.IsNullOrWhiteSpace(form.address)||form.address==YJYGlobal.THT_COMPANY_ADDRESS)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid address"));

            try
            {
                var fundService = new FundService(db);
                fundService.SetTHTAddress(UserId, form.address);
            }
            catch (ArgumentException)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, Resources.Resource.THTAddressExisted));
            }

            return new ResultDTO(true);
        }

        [HttpGet]
        [Route("THT/address")]
        [BasicAuth]
        public THTAddressDTO GetTHTAddress()
        {
            var user = GetUser();

            return new THTAddressDTO() {address = user.THTAddress};
        }

        [HttpGet]
        [Route("THT/serverAddress")]
        public THTAddressDTO GetTHTServerAddress()
        {
           return new THTAddressDTO() { address = YJYGlobal.THT_COMPANY_ADDRESS };
        }

        [HttpPost]
        [Route("THT/withdrawal")]
        [BasicAuth]
        public ResultDTO NewTHTWithdrawal(NewTHTWithdrawalFormDTO form)
        {
            if(form.amount>10000000)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "invalid amount"));

            var fundService = new FundService(db);
            var withdrawalId = fundService.NewTHTWithdrawal(UserId, form.amount);

            var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == withdrawalId);

            var balanceType = db.BalanceTypes.FirstOrDefault(o => o.Id == withdrawal.BalanceTypeId);

            var request =
                WebRequest.CreateHttp(YJYGlobal.THT_BC_API_HOST + "refund?type=" + balanceType.Code.ToLower() + "&id=" +
                                      withdrawal.Id + "&to=" + withdrawal.To + "&value=" + withdrawal.Value);
            request.Method = "GET";
            request.Headers.Add("Authorization", "Bearer " + YJYGlobal.CALLBACK_AUTH_TOKEN);

            withdrawal.SendAt = DateTime.UtcNow;
            try
            {
                var response = request.GetResponse() as HttpWebResponse;
                var responseStream = response.GetResponseStream();
                var sr = new StreamReader(responseStream);
                var str = sr.ReadToEnd();

                withdrawal.SendResult = response.StatusCode.ToString();
            }
            catch (Exception e)
            {
                withdrawal.SendResult = e.Message.TruncateMax(500);
            }
            db.SaveChanges();

            return new ResultDTO(true);
        }

        [HttpPost]
        [Route("manual")]
        [AdminAuth]
        public ResultDTO FundManualAdjust(FundManualAdjustFormDTO form)
        {
            var fundService = new FundService(db);
            fundService.ManualAdjust(UserId, form.userId,form.balanceTypeId,form.amount);

            return new ResultDTO(true);
        }

        [HttpPut]
        [Route("withdrawal/{withdrawalId}/cancel")]
        [AdminAuth]
        public ResultDTO WithdrawalCancel( int withdrawalId)
        {
            var fundService = new FundService(db);
            fundService.CancelWithdrawal(UserId, withdrawalId);

            return new ResultDTO(true);
        }

        [HttpGet]
        [Route("withdrawal")]
        [AdminAuth]
        public List<WithdrawalDTO> WithdrawalCancel(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            var data = db.THTWithdrawals.Join(db.Users,w=>w.UserId,u=>u.Id,(w,u)=>new
                {
                    w=w,u=u
                })
                .OrderByDescending(o => o.w.CreateAt).Skip((pageNum - 1) * pageSize).Take(pageSize)
                .ToList();

           var result = new List<WithdrawalDTO>();
            data.ForEach(o =>
            {
                var d = Mapper.Map<WithdrawalDTO>(o.w);
                d.user = Mapper.Map<UserBaseDTO>(o.u);
                result.Add(d);
            });
            return result;
        }

        /// <summary>
        /// 根据用户情况、标的，获取杠杆、可投入金额
        /// 如果用户未登录，则只与标的有关
        /// </summary>
        /// <param name="securityId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("invest/setting")]
        public object GetInvestSetting(int securityId)
        {
            var authorization = this.ActionContext.Request.Headers.Authorization;

            int userId = 0;
            string token = null;

            if(authorization != null) //如果用户已登录
            {
                var split = authorization.Parameter.Split('_');
                userId = Convert.ToInt32(split[0]);
                token = split[1];

                var user = db.Users.FirstOrDefault(o => o.Id == userId && o.AuthToken == token);

                if (user == null) //unauthorize
                    this.ActionContext.Response = this.ActionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
            }

            object result = null;

            result = new
            {
                PriceSetting = GetPriceSetting(userId),
                LeverageSetting = GetLeverageSetting(userId, securityId),
            };

            return result;
        }

        /// <summary>
        /// 计算杠杆。优先级如下：
        /// 1、用户自定义杠杆
        /// 2、产品自定义杠杆
        /// 3、默认杠杆
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="securityId"></param>
        /// <returns></returns>
        private int[] GetLeverageSetting(int userId, int securityId)
        {
            var defaultDemoLeverage = new int[] { 10, 20, 50, 100 };
            var defaultLiveLeverage = new int[] { 10, 20, 50, 100 };

            int balanceTypeId = 0; //用户账号类型。 0 未登录，1 模拟盘，2 实盘
                                   //用户的账号类型，Demo/Live
            if(userId != 0)
            {
                balanceTypeId = (from u in db.Users
                       join b in db.Balances on u.ActiveBalanceId equals b.Id
                       where u.Id == userId
                       select b.TypeId).FirstOrDefault();
            }

            int[] defaultLeverage = null;
            if (userId == 0 || balanceTypeId == 0 || balanceTypeId == 1)
            {
                defaultLeverage = defaultDemoLeverage;
            }
            else
            {
                defaultLeverage = defaultLiveLeverage;
            }


            #region 用户配置
            int[] userLeverage = null;
            if(userId != 0) //用户已登录，根据用户的账号类型(Demo/Live)选择配置
            {                
                if (balanceTypeId == 0 || balanceTypeId == 1)//Demo用户
                {
                    var userDemoLeverage = db.UserLeverages.FirstOrDefault(u => u.UserId == userId && u.BalanceType == 1);
                    if(userDemoLeverage != null)
                    {
                        userLeverage = userDemoLeverage.Leverage.Split(';').Select(u => int.Parse(u)).ToList().ToArray();
                    }
                }
                else
                {
                    var userLiveLeverage = db.UserLeverages.FirstOrDefault(u => u.UserId == userId && u.BalanceType == 2);
                    if (userLiveLeverage != null)
                    {
                        userLeverage = userLiveLeverage.Leverage.Split(';').Select(u => int.Parse(u)).ToList().ToArray();
                    }
                }
            }
            #endregion

            #region 产品配置
            int[] securityLeverage = null;
            if (userId == 0 || balanceTypeId == 0 || balanceTypeId == 1)//Demo用户
            {
                var securityDemoLeverage = db.SecurityLeverages.FirstOrDefault(s => s.SecurityId == securityId && s.BalanceType == 1);
                if (securityDemoLeverage != null)
                {
                    securityLeverage = securityDemoLeverage.Leverage.Split(';').Select(s => int.Parse(s)).ToList().ToArray();
                }
            }
            else //实盘
            {
                var securityLiveLeverage = db.SecurityLeverages.FirstOrDefault(s => s.SecurityId == securityId && s.BalanceType == 2);
                if (securityLiveLeverage != null)
                {
                    securityLeverage = securityLiveLeverage.Leverage.Split(';').Select(s => int.Parse(s)).ToList().ToArray();
                }
            }
            #endregion

            #region 通用配置, 使用userleverage表中userId=0的配置
            int[] generalLeverage = null;
            if (userId == 0 || balanceTypeId == 0 || balanceTypeId == 1)//Demo用户
            {
                var generalDemoLeverage = db.UserLeverages.FirstOrDefault(u => u.UserId == 0 && u.BalanceType == 1);
                if (generalDemoLeverage != null)
                {
                    generalLeverage = generalDemoLeverage.Leverage.Split(';').Select(s => int.Parse(s)).ToList().ToArray();
                }
            }
            else //实盘
            {
                var generalLiveLeverage = db.UserLeverages.FirstOrDefault(u => u.UserId == 0 && u.BalanceType == 2);
                if (generalLiveLeverage != null)
                {
                    generalLeverage = generalLiveLeverage.Leverage.Split(';').Select(s => int.Parse(s)).ToList().ToArray();
                }
            }
            #endregion

            //按照优先级，用户配置>产品配置>通用配置
            if(userLeverage != null)
            {
                return userLeverage;
            }
            else if(securityLeverage != null)
            {
                return securityLeverage;
            }
            else if(generalLeverage != null)
            {
                return generalLeverage;
            }

            return defaultLeverage;
        }

        /// <summary>
        /// 根据用户类型返回价格设置
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        private int[] GetPriceSetting(int userId)
        {
            int balanceTypeId = 0; //用户账号类型。 0 未登录，1 模拟盘，2 实盘
                                   //用户的账号类型，Demo/Live
            if (userId != 0)
            {
                balanceTypeId = (from u in db.Users
                                 join b in db.Balances on u.ActiveBalanceId equals b.Id
                                 where u.Id == userId
                                 select b.TypeId).FirstOrDefault();
            }

            if (balanceTypeId == 0 || balanceTypeId == 1)//Demo用户
            {
                return db.InvestSettings.Where(o => o.BalanceTypeId == 1).OrderBy(o => o.DisplayOrder).Select(b => (int)b.Amount).ToArray();
            }
            else
            {
                return db.InvestSettings.Where(o => o.BalanceTypeId == 2).OrderBy(o => o.DisplayOrder).Select(b => (int)b.Amount).ToArray();
            }
        }
    }
}