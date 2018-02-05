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
    }
}
