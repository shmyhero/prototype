using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using ServiceStack.Redis;
using YJY_COMMON.Model.Context;

namespace YJY_SVR.Controllers
{
    public class YJYController : ApiController
    {
        public YJYEntities db { get; protected set; }
        public IMapper Mapper { get; protected set; }
        public IRedisClient RedisClient { get; protected set; }

        public YJYController(YJYEntities db, IMapper mapper, IRedisClient redisClient)
        {
            this.db = db;
            this.Mapper = mapper;
            this.RedisClient = redisClient;
        }

        public YJYController(YJYEntities db, IMapper mapper)
        {
            this.db = db;
            this.Mapper = mapper;
        }

        protected YJYController(YJYEntities db)
        {
            this.db = db;
        }

        protected YJYController()
        {
        }
    }
}
