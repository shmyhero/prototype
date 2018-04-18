using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_SVR.Caching;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/fund")]
    public class FundController : YJYController
    {
        public FundController(YJYEntities db) : base(db) { }

        [HttpGet]
        [Route("balance")]
        [BasicAuth]
        public BalanceDTO GetBalance()
        {
            var user = GetUser();

            var openPositions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt == null).ToList();
            var quotes = WebCache.Instance.Quotes;
            var sumOfPositionValue = openPositions.Sum(p => Trades.CalculatePL(p, quotes.FirstOrDefault(q => q.Id == p.SecurityId)) + p.Invest.Value);

            return new BalanceDTO()
            {
                balance = user.Balance.Value,
                total = user.Balance.Value + sumOfPositionValue,
            };
        }

        [HttpPut]
        [Route("THT/address")]
        [BasicAuth]
        public ResultDTO SetTHTAddress(THTAddressFormDTO form)
        {
            var fundService = new FundService(db);
            fundService.SetTHTAddress(UserId, form.address);

            return new ResultDTO(true);
        }
    }
}
