using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using ServiceStack.Redis;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Util;
using YJY_SVR.Caching;
using YJY_SVR.DTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/quote")]
    public class QuoteController : YJYController
    {
        public QuoteController(IMapper mapper,IRedisClient redisClient)
            : base(mapper, redisClient)
        {
        }

        [HttpGet]
        [Route("{securityId}/tick/1m")]
        public List<TickDTO> GetTodayTicks(int securityId)
        {
            using (var redisTypedClient = RedisClient.As<Tick>())
            {
                var list = redisTypedClient.Lists[Ticks.GetTickListNamePrefix(TickSize.OneMinute)+securityId];
                var ticks = list.GetAll();
                return ticks.Select(o => Mapper.Map<TickDTO>(o)).ToList();
            }
        }
    }
}
