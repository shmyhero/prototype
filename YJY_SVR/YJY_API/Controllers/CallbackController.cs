using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_API.DTO.FormDTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/callback")]
    public class CallbackController : YJYController
    {
        public CallbackController(YJYEntities db) : base(db)
        {
        }

        [HttpPost]
        [Route("THT/deposit")]
        public bool THTDeposit(THTDepositFormDTO form)
        {
            var authorization = Request.Headers.Authorization;

            if (authorization?.Parameter == null || authorization.Parameter != YJYGlobal.CALLBACK_AUTH_TOKEN)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "invalid auth token"));

            if (string.IsNullOrWhiteSpace(form.transactionHash) || string.IsNullOrWhiteSpace(form.from) ||
                string.IsNullOrWhiteSpace(form.tokenAmount))
                throw new ArgumentOutOfRangeException(nameof(form));

            form.tokenAmount = form.tokenAmount.Trim();
            form.transactionHash = form.transactionHash.Trim();
            form.from = form.from.Trim();
            form.to = form.to.Trim();

            BigInteger bi;
            var tryParse = BigInteger.TryParse(form.tokenAmount, NumberStyles.None, null, out bi);
            if (!tryParse || bi < new BigInteger(0))
                throw new ArgumentOutOfRangeException(nameof(form.tokenAmount));

            var deposit = FundService.AddTHTDeposit(form.transactionHash, form.@from, form.to, form.tokenAmount);

            if (deposit == null)
                return false;

            try
            {
                var fundService = new FundService(db);
                fundService.AddUserBalanceByTHTDeposit(deposit.Id);
            }
            catch (Exception e)
            {
                YJYGlobal.LogExceptionAsWarning(e);
            }

            return true;
        }

        [HttpPost]
        [Route("THT/withdrawal")]
        public bool THTWithdrawalConfirm(THTWithdrawalFormDTO form)
        {
            var authorization = Request.Headers.Authorization;

            if (authorization?.Parameter == null || authorization.Parameter != YJYGlobal.CALLBACK_AUTH_TOKEN)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "invalid auth token"));

            int id;
            if (string.IsNullOrWhiteSpace(form.id) || !int.TryParse(form.id, out id))
                throw new ArgumentOutOfRangeException();

            var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == id);
            if(withdrawal==null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "no such index"));

            withdrawal.CallbackAt=DateTime.UtcNow;
            withdrawal.CallbackResult = form.success;
            withdrawal.CallbackTo = form.to;
            withdrawal.CallbackValue = decimal.Parse(form.value);
            withdrawal.CallbackMessage = form.message;

            db.SaveChanges();

            return true;
        }

        [HttpPost]
        [Route("ETH/deposit")]
        public bool ETHDeposit(ETHDepositFormDTO form)
        {
            var authorization = Request.Headers.Authorization;

            if (authorization?.Parameter == null || authorization.Parameter != YJYGlobal.CALLBACK_AUTH_TOKEN)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized,
                    "invalid auth token"));

            if (string.IsNullOrWhiteSpace(form.transactionHash) || string.IsNullOrWhiteSpace(form.from) ||
                string.IsNullOrWhiteSpace(form.ethAmount))
                throw new ArgumentOutOfRangeException(nameof(form));

            form.ethAmount = form.ethAmount.Trim();
            form.transactionHash = form.transactionHash.Trim();
            form.from = form.from.Trim();
            form.to = form.to.Trim();

            BigInteger bi;
            var tryParse = BigInteger.TryParse(form.ethAmount, NumberStyles.None, null, out bi);
            if (!tryParse || bi < new BigInteger(0) || bi > (new BigInteger(1e18) * new BigInteger(1e8)))
                throw new ArgumentOutOfRangeException(nameof(form.ethAmount));

            var deposit = FundService.AddETHDeposit(form.transactionHash, form.@from, form.to, form.ethAmount);

            if (deposit == null)
                return false;

            try
            {
                var fundService = new FundService(db);
                fundService.AddUserBalanceByETHDeposit(deposit.Id);
            }
            catch (Exception e)
            {
                YJYGlobal.LogExceptionAsWarning(e);
            }

            return true;
        }

        //[HttpPost]
        //[Route("ETH/withdrawal")]
        //public bool ETHWithdrawalConfirm(ETHWithdrawalFormDTO form)
        //{
        //    var authorization = Request.Headers.Authorization;

        //    if (authorization?.Parameter == null || authorization.Parameter != YJYGlobal.CALLBACK_AUTH_TOKEN)
        //        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "invalid auth token"));

        //    int id;
        //    if (string.IsNullOrWhiteSpace(form.id) || !int.TryParse(form.id,out id))
        //        throw new ArgumentOutOfRangeException();

        //    var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == id);
        //    if (withdrawal == null)
        //        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "no such index"));

        //    withdrawal.CallbackAt = DateTime.UtcNow;
        //    withdrawal.CallbackTo = form.to;
        //    withdrawal.CallbackValue = decimal.Parse(form.value);

        //    db.SaveChanges();

        //    return true;
        //}
    }
}