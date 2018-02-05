using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_SVR.Caching;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/position")]
    public class PositionController : YJYController
    {
        public PositionController(YJYEntities db, IMapper mapper)
            : base(db, mapper)
        {
        }

        [HttpPost]
        [Route("")]
        [BasicAuth]
        public PositionDTO NewPosition(NewPositionFormDTO form)
        {
            var user = GetUser();
            if(user.Balance<form.invest)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,__(TransKey.NOT_ENOUGH_BALANCE)));

            var cache = WebCache.Instance;

            var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == form.securityId);
            if (prodDef.QuoteType== enmQuoteType.Closed || prodDef.QuoteType== enmQuoteType.Inactive)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, __(TransKey.PROD_IS_CLOSED)));

            var quote = cache.Quotes.FirstOrDefault(o => o.Id == form.securityId);

            var positionService = new PositionService();
            var newPosition = positionService.CreateNewPosition(UserId,form.securityId,form.invest,form.isLong,form.leverage,Quotes.GetLastPrice(quote));

            var posDTO = new PositionDTO()
            {
                id = newPosition.Id,
                isLong = newPosition.Side.Value,
                settlePrice = newPosition.SettlePrice.Value,
                invest = newPosition.Invest.Value,
                leverage = newPosition.Leverage.Value,
                createAt = newPosition.CreateTime.Value,
            };

            return posDTO;
        }

        [HttpGet]
        [Route("open")]
        [BasicAuth]
        public List<PositionDTO> GetOpenPositions(bool ignoreCache = false)
        {
            var user = GetUser();

            var positions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt == null)
                .OrderByDescending(o => o.CreateTime)
                .ToList();

           var cache = WebCache.Instance;

            var positionDtos = positions.Select(delegate (Position p)
            {
                var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == Convert.ToInt32(p.SecurityId));

                var quote = cache.Quotes.FirstOrDefault(o => o.Id == Convert.ToInt32(p.SecurityId));

                var security = Mapper.Map<SecurityDetailDTO>(prodDef);

                if (quote != null)
                {
                    security.last = Quotes.GetLastPrice(quote);
                    security.ask = quote.Ask;
                    security.bid = quote.Bid;
                }

                var posDTO = Mapper.Map<PositionDTO>(p);

                //security
                posDTO.security = security;

                //calculate UPL
                posDTO.upl = Trades.CalculatePL(p, quote);

                return posDTO;
            }).Where(o => o != null).ToList();

            return positionDtos;
        }
    }
}
