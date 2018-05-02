using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.DTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/security")]
    public class SecurityController : YJYController
    {
        public SecurityController(IMapper mapper) : base(mapper)
        {
        }

        //for report
        [HttpGet]
        [Route("all")]
        public List<ProdDefDTO> GetAllList()
        {
            var cache = WebCache.Instance;

            //var redisProdDefClient = RedisClient.As<ProdDef>();
            //var redisQuoteClient = RedisClient.As<Quote>();
            //var prodDefs = RedisClient.As<ProdDef>().GetAll();
            //var quotes = redisQuoteClient.GetAll();

            //var securities = db.AyondoSecurities.ToList();

            var result = cache.ProdDefs.Select(o => Mapper.Map<ProdDefDTO>(o)).ToList();

            foreach (var prodDTO in result)
            {
                ////get cname
                //var @default = securities.FirstOrDefault(o => o.Id == prodDTO.Id);
                //if (@default != null && @default.CName != null)
                //    prodDTO.cname = @default.CName;
                prodDTO.cname = Translator.GetProductNameByThreadCulture(prodDTO.Name);

                //get new price
                var quote = cache.Quotes.FirstOrDefault(o => o.Id == prodDTO.Id);
                if (quote != null)
                {
                    //prodDTO.last = Quotes.GetLastPrice(quote);

                    //calculate min/max trade value
                    //var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == prodDTO.Id);

                    var perPriceCcy2 = prodDTO.LotSize / prodDTO.PLUnits;

                   
                }
                else
                {
                    //prodDTO.last = null;
                }
            }

            return result.OrderBy(o => o.AssetClass).ThenBy(o => o.Name).ToList();
        }

        [HttpGet]
        [Route("default")]
        public List<SecurityDTO> GetDefaultList()
        {
            var prodDefs = GetActiveProdsByIdsKeepOrder(new[]{ 34821 , 34847 , 34858 , 34864 , 34857 , 34854 , 34811 , 34801 , 34820 , 34805 , 34860 , 38289, 34816, 34859 , 34817 , 34804 , 34781 , 37540 , 34815 , 34802 });

            var securityDtos = prodDefs.Select(o => Mapper.Map<SecurityDTO>(o)).ToList();

            UpdateLastPrice(securityDtos);

            return securityDtos;
        }

        [HttpGet]
        [Route("index")]
        public List<SecurityDTO> GetIndexList()
        {
            var activeProds = GetActiveProds();

            var prodDefs = activeProds.Where(o => o.AssetClass == YJYGlobal.ASSET_CLASS_INDEX).ToList();

            var securityDtos = prodDefs.OrderBy(o => o.Symbol).Select(o => Mapper.Map<SecurityDTO>(o)).ToList();

            UpdateLastPrice(securityDtos);

            return securityDtos;
        }

        [HttpGet]
        [Route("fx")]
        public List<SecurityDTO> GetFxList()
        {
            var activeProds = GetActiveProds();

            var prodDefs =
                activeProds.Where(
                    o =>
                        o.AssetClass == YJYGlobal.ASSET_CLASS_FX && !o.Name.EndsWith(" Outright") ||
                        o.AssetClass == YJYGlobal.ASSET_CLASS_CRYPTO_FX).ToList();

            var securityDtos = prodDefs.OrderBy(o => o.Symbol).Select(o => Mapper.Map<SecurityDTO>(o)).ToList();

            UpdateLastPrice(securityDtos);

            return securityDtos;
        }

        [HttpGet]
        [Route("futures")]
        public List<SecurityDTO> GetFuturesList()
        {
            var activeProds = GetActiveProds();

            var prodDefs = activeProds.Where(o => o.AssetClass == YJYGlobal.ASSET_CLASS_COMMODITY).ToList();

            var securityDtos = prodDefs.OrderBy(o => o.Symbol).Select(o => Mapper.Map<SecurityDTO>(o)).ToList();

            UpdateLastPrice(securityDtos);

            return securityDtos;
        }

        [HttpGet]
        [Route("{securityId}")]
        public SecurityDetailDTO GetSecurity(int securityId)
        {
            var cache = WebCache.Instance;

            var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == securityId);

            if (prodDef == null)
                return null;

            //mapping
            var result = Mapper.Map<SecurityDetailDTO>(prodDef);

            //get new price
            var quote = cache.Quotes.FirstOrDefault(o => o.Id == securityId);

            result.last = Quotes.GetLastPrice(quote);
            //result.ask = quote.Ask;
            //result.bid = quote.Bid;
           
            //lev to int
            result.maxLeverage = Math.Floor(prodDef.MaxLeverage);

            return result;
        }

        private IList<ProdDef> GetActiveProds(bool includeUntranslated = false)
        {
            return WebCache.Instance.ProdDefs
                .Where(o => o.QuoteType != enmQuoteType.Inactive
                            && (DateTime.UtcNow - o.Time) < YJYGlobal.PROD_DEF_ACTIVE_IF_TIME_NOT_OLDER_THAN_TS
                            && o.Bid.HasValue && o.Offer.HasValue
                            && (includeUntranslated || Products.HasChineseTranslation(o.Name))
                )
                .ToList();
        }

        public void UpdateLastPrice(IList<SecurityDTO> list)
        {
            if (list.Count == 0) return;

            //var redisProdDefClient = RedisClient.As<ProdDef>();
            //var redisQuoteClient = RedisClient.As<Quote>();

            var ids = list.Select(o => o.id).ToList();
            //var quotes = redisQuoteClient.GetByIds(ids);
            var quotes = WebCache.Instance.Quotes.Where(o => ids.Contains(o.Id)).ToList();
            //var prodDefs = redisProdDefClient.GetByIds(ids);

            foreach (var security in list)
            {
                //var prodDef = prodDefs.FirstOrDefault(o => o.Id == security.id);
                //if (prodDef != null)
                //{
                //    security.preClose = prodDef.PreClose;
                //    security.open = Quotes.GetOpenPrice(prodDef);
                //    security.isOpen = prodDef.QuoteType == enmQuoteType.Open;
                //}

                var quote = quotes.FirstOrDefault(o => o.Id == security.id);
                if (quote != null)
                {
                    security.last = Quotes.GetLastPrice(quote);
                }
            }
        }

        private IList<ProdDef> GetActiveProdsByIdsKeepOrder(IList<int> ids)
        {
            var activeProds = GetActiveProds();
            return ids.Select(id => activeProds.FirstOrDefault(o => o.Id == id)).Where(o => o != null).ToList();
        }
    }
}
