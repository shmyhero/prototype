using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using AutoMapper;
using ServiceStack.Redis;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;

namespace YJY_API.Controllers
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

        public YJYController(IMapper mapper, IRedisClient redisClient)
        {
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

        protected YJYController(IMapper mapper)
        {
            this.Mapper = mapper;
        }

        protected YJYController()
        {
        }

        public int UserId
        {
            get
            {
                return Convert.ToInt32(HttpContext.Current.User.Identity.Name);
            }

            ////for unit testing
            //get; set;
        }

        internal DateTime RequestStartAt { get; set; }

        public User GetUser()
        {
            return db.Users.FirstOrDefault(o => o.Id == UserId);
        }

        /// <summary>
        /// for api without BasicAuth, use this function to get auth user
        /// </summary>
        /// <returns></returns>
        public User TryGetAuthUser()
        {
            int? authUserId=null;
            string authToken = null;

            if (authUserId == null)
            {
                var authorization = Request.Headers.Authorization;

                if (authorization != null)
                {
                    try
                    {
                        var split = authorization.Parameter.Split('_');
                        authUserId = Convert.ToInt32(split[0]);
                        authToken = split[1];
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            if (authUserId != null && authToken!=null)
            {
                var user= db.Users.FirstOrDefault(o => o.Id == authUserId && o.AuthToken==authToken);
                if (user != null)
                    return user;
            }

            return null;
        }

        //public string __(TransKey transKey)
        //{
        //    return Translator.Translate(transKey);
        //}
    }
}
