using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServiceStack.Text;
using YJY_API.Controllers;
using YJY_API.DTO;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.SMS;
using YJY_SVR.Controllers.Attributes;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/util")]
    public class UtilController : YJYController
    {
        public UtilController(YJYEntities db) : base(db) { }

        [HttpGet]
        [Route("timestampNonce")]
        public TimeStampDTO GetTimeStamp()
        {
            long timeStamp = DateTime.Now.ToUnixTime();
            int nonce = new Random().Next(0, 100000);

            db.TimeStampNonces.Add(new TimeStampNonce() { TimeStamp = timeStamp, Nonce = nonce, CreatedAt = DateTime.UtcNow,  });
            db.SaveChanges();
            return new TimeStampDTO() { timeStamp = timeStamp, nonce = nonce };
        }

        [Route("sendVerifyCode")]
        [HttpPost]
        //[RequireHttps]
        [TimestampNonceAuth]
        //TODO: prevent brute-force attack
        public ResultDTO SendVerifyCode(SendVerifyCodeFormDTO form)
        {
            return CheckAndSendSMSVerifyCode(form.phone);
        }

        private ResultDTO CheckAndSendSMSVerifyCode(string phone)
        {
            var result = new ResultDTO();

            if (string.IsNullOrWhiteSpace(phone))
            {
                result.success = false;
                //result.message=""
            }

            //if (!Phone.IsValidPhoneNumber(phone))
            //{
            //    result.message = __(TransKey.INVALID_PHONE_NUMBER);
            //    result.success = false;
            //    return result;
            //}

            string code = string.Empty;

            ////send last code instead of regenerating if within ?
            //if (verifyCodes.Any())
            //{
            //    var lastCode = verifyCodes.OrderByDescending(c => c.CreatedAt).First();
            //}

            ////day limit
            //if (verifyCodes.Count() >= 5)
            //{
            //    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, __(TransKeys.SEND_CODE_LIMIT)));
            //}

            var r = new Random();
            code = r.Next(10000).ToString("0000");


            //string failMsg;
            //var sendSuccess = TwilioSMS.SendSMS(phone, Resources.Resource.VerificationCode.FormatWith(code), out failMsg);

            //if (sendSuccess)
            //{
            //    db.VerifyCodes.Add(new VerifyCode
            //    {
            //        Code = code,
            //        SentAt = DateTime.UtcNow,
            //        Phone = phone
            //    });
            //    db.SaveChanges();

            //    result.success = true;
            //    return result;
            //}
            //else
            //{
            //    result.success = false;
            //    result.message = failMsg;
            //    return result;
            //}

            YunPianSMS.TplSendCodeSms(string.Format("#code#={0}", code), phone);

            db.VerifyCodes.Add(new VerifyCode
            {
                Code = code,
                SentAt = DateTime.UtcNow,
                Phone = phone
            });
            db.SaveChanges();

            result.success = true;
            return result;
        }
    }
}
