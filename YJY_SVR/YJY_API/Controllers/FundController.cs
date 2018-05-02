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
using YJY_SVR.Caching;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
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

            var openPositions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt == null).ToList();
            var quotes = WebCache.Instance.Quotes;
            var sumOfPositionValue =
                openPositions.Sum(
                    p => Trades.CalculatePL(p, quotes.FirstOrDefault(q => q.Id == p.SecurityId)) + p.Invest.Value);

            return new BalanceDTO()
            {
                balance = user.Balance.Value,
                total = user.Balance.Value + sumOfPositionValue,
            };
        }

        [HttpGet]
        [Route("transfer")]
        [BasicAuth]
        public List<TransferDTO> GetTransferHistory(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            var transfers =
                db.Transfers.Where(o => o.UserId == UserId)
                    .OrderByDescending(o => o.Time)
                    .Skip((pageNum - 1)*pageSize)
                    .Take(pageSize)
                    .ToList();
            return transfers.Select(o => Mapper.Map<TransferDTO>(o)).ToList();
        }

        [HttpPut]
        [Route("THT/address")]
        [BasicAuth]
        public ResultDTO SetTHTAddress(THTAddressFormDTO form)
        {
            if(string.IsNullOrWhiteSpace(form.address)||form.address==YJYGlobal.THT_COMPANY_ADDRESS)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid address"));

            var fundService = new FundService(db);
            fundService.SetTHTAddress(UserId, form.address);

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
            var fundService = new FundService(db);
            var withdrawalId = fundService.NewTHTWithdrawal(UserId,form.amount);

            var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == withdrawalId);

            var request =
                WebRequest.CreateHttp(YJYGlobal.THT_BC_API_HOST + "refund?index=" + withdrawal.Id + "&to=" + withdrawal.To +
                                      "&value=" + withdrawal.Value);
            request.Method = "GET";
            request.Headers.Add("Authorization",
                "Bearer "+YJYGlobal.CALLBACK_AUTH_TOKEN);


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
    }
}
