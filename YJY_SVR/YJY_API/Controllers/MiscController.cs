using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON.Model.Context;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/misc")]
    public class MiscController : YJYController
    {
        public MiscController(YJYEntities db) : base(db)
        {
        }

        [HttpGet]
        [Route("version")]
        public HttpResponseMessage GetVersion()
        {
            string dbName = db.Database.Connection.Database;

            return Request.CreateResponse(
                HttpStatusCode.OK,
#if DEBUG
                "YJY API STATUS: OK [build=DEBUG]" +
#else
                "YJY API STATUS: OK [build=RELEASE]" +
#endif
                    " -- v" + System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString()
                + " -- DB=[" + dbName + "]"
                );
        }

        [HttpGet]
        [Route("error")]
        public HttpResponseMessage GetError()
        {
            throw new NullReferenceException();
        }
    }
}
