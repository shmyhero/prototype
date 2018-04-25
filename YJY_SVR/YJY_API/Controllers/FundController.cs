﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json.Linq;
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
        public FundController(YJYEntities db) : base(db)
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

        [HttpPut]
        [Route("THT/address")]
        [BasicAuth]
        public ResultDTO SetTHTAddress(THTAddressFormDTO form)
        {
            var fundService = new FundService(db);
            fundService.SetTHTAddress(UserId, form.address);

            return new ResultDTO(true);
        }

        [HttpPost]
        [Route("THT/withdrawal")]
        [BasicAuth]
        public ResultDTO NewTHTWithdrawal(NewTHTWithdrawalFormDTO form)
        {
            var fundService = new FundService(db);
            var withdrawalId = fundService.NewTHTWithdrawal(UserId, form.value);

            var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == withdrawalId);

            var request =
                WebRequest.CreateHttp("http://139.217.205.9:9527/refund?index=" + withdrawal.Id + "&to=" + withdrawal.To +
                                      "&value=" + withdrawal.Value);
            request.Method = "GET";
            request.Headers.Add("Authorization",
                "Bearer jR7cB9s6n2I0C4zP1xZ6b92Mki0Q3Ae7G1L3vU5hoT8xD5Fy3Ux9bR1wO5Hb7ec4HJ6Es2oC");


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
