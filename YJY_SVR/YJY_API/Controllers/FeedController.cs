using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_SVR.DTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/feed")]
    public class FeedController : YJYController
    {
        public FeedController(YJYEntities db) : base(db)
        {
        }

        [HttpGet]
        [Route("default")]
        public List<FeedDTO> GetDefaultFeeds()
        {
            return null;
        }
    }
}
