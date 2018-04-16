using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON.Model.Context;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/callback")]
    public class CallbackController : YJYController
    {
        public CallbackController(YJYEntities db) : base(db)
        {
        }

        private const string CALLBACK_AUTH_TOKEN = "jR7cB9s6n2I0C4zP1xZ6b92Mki0Q3Ae7G1L3vU5hoT8xD5Fy3Ux9bR1wO5Hb7ec4HJ6Es2oC";

        [HttpPost]
        [Route("THT/deposit")]
        public bool THTDeposit(THTDepositFormDTO form)
        {
            var authorization = Request.Headers.Authorization;
            
            if (authorization?.Parameter == null || authorization.Parameter != CALLBACK_AUTH_TOKEN)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "invalid auth token"));

            return true;
        }
    }
}
