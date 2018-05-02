using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
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
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "invalid auth token"));

            if (form.index == 0 || string.IsNullOrWhiteSpace(form.from) || form.value<=0)
                throw new ArgumentOutOfRangeException();

            var deposit = new THTDeposit()
            {
                Index = form.index,
                From = form.from,
                To = form.to,
                Value = form.value,
                CreateAt = DateTime.UtcNow,
            };

            db.THTDeposits.Add(deposit);
            db.SaveChanges();

            try
            {
                var fundService = new FundService(db);
                fundService.AddUserBalanceByTHTDeposit(deposit.Index);
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

            if (form.index == 0)
                throw new ArgumentOutOfRangeException();

            var withdrawal = db.THTWithdrawals.FirstOrDefault(o => o.Id == form.index);
            if(withdrawal==null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "no such index"));

            withdrawal.CallbackAt=DateTime.UtcNow;
            withdrawal.CallbackTo = form.to;
            withdrawal.CallbackValue = form.value;
            
            db.SaveChanges();

            return true;
        }
    }
}
