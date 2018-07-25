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
            return db.BalanceTypes.ToList().Select(o => Mapper.Map<BalanceTypeDTO>(o)).ToList();
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
    }
}