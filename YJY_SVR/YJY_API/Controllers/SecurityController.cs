using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_SVR.Caching;
using YJY_SVR.DTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/security")]
    public class SecurityController : YJYController
    {
        public SecurityController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpGet]
        [Route("all")]
        public List<ProdDefDTO> GetAllList(int page = 1, int perPage = 20)
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
    }
}
