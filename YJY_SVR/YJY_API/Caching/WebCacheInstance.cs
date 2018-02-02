using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using AutoMapper;
using ServiceStack.Redis;
using YJY_API;
using YJY_COMMON;
using YJY_COMMON.Model.Cache;

namespace YJY_SVR.Caching
{
    public class WebCacheInstance
    {
        private Timer _timerProdDef;
        private Timer _timerQuote;
        private Timer _timerTick;
        private Timer _timerTickRaw;
        //private  Timer _timerPriceDown;
        private Timer _timerProdSetting;

        private static TimeSpan _updateIntervalProdDef = TimeSpan.FromSeconds(3);
        private static TimeSpan _updateIntervalQuote = TimeSpan.FromMilliseconds(500);
        private static TimeSpan _updateIntervalTick = TimeSpan.FromSeconds(10);
        private static TimeSpan _updateIntervalTickRaw = TimeSpan.FromMilliseconds(1000);
        private IMapper mapper;
        private IRedisClientsManager _redisClientsManager;

        public WebCacheInstance()
        {
            //initialize
            ProdDefs = new List<ProdDef>();
            Quotes = new List<Quote>();

            mapper = MapperConfig.GetAutoMapperConfiguration().CreateMapper();

            _redisClientsManager = YJYGlobal.PooledRedisClientsManager;

            //get value from Redis
            using (var redisClient = _redisClientsManager.GetClient())
            {
                try
                {
                    ProdDefs = redisClient.As<ProdDef>().GetAll();
                    Quotes = redisClient.As<Quote>().GetAll();
                }
                catch (Exception e)
                {
                    YJYGlobal.LogExceptionAsInfo(e);
                }
            }

            //set timer
            _timerProdDef = new Timer(UpdateProdDefs, null, _updateIntervalProdDef, TimeSpan.FromMilliseconds(-1));
            _timerQuote = new Timer(UpdateQuotes, null, _updateIntervalQuote, TimeSpan.FromMilliseconds(-1));
        }

        public IList<ProdDef> ProdDefs { get; private set; }
        public IList<Quote> Quotes { get; private set; }

        private void UpdateProdDefs(object state)
        {
            while (true)
            {
                //CFDGlobal.LogLine("Updating WebCache ProdDefs...");
                using (var redisClient = _redisClientsManager.GetClient())
                {
                    try
                    {
                        ProdDefs = redisClient.As<ProdDef>().GetAll();
                    }
                    catch (Exception e)
                    {
                        YJYGlobal.LogExceptionAsInfo(e);
                    }
                }

                Thread.Sleep(_updateIntervalProdDef);
            }
        }

        private void UpdateQuotes(object state)
        {
            while (true)
            {
                //CFDGlobal.LogLine("Updating WebCache Quotes...");
                using (var redisClient = _redisClientsManager.GetClient())
                {
                    try
                    {
                        Quotes = redisClient.As<Quote>().GetAll();
                    }
                    catch (Exception e)
                    {
                        YJYGlobal.LogExceptionAsInfo(e);
                    }
                }

                Thread.Sleep(_updateIntervalQuote);
            }
        }
    }
}