using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_API.DTO.FormDTO;

namespace YJY_API.Controllers
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
            if (form.invest <= 0)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "invalid invest"));

            if (form.leverage < 1)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "invalid leverage"));

            var user = GetUser();
            if (user.Balance < form.invest)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    Resources.Resource.NotEnoughBalance));

            var cache = WebCache.Instance;

            var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == form.securityId);
            if (prodDef.QuoteType == enmQuoteType.Closed || prodDef.QuoteType == enmQuoteType.Inactive)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    Resources.Resource.ProductClosed));

            if (form.leverage > prodDef.MaxLeverage)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "exceeded max leverage"));

            var quote = cache.Quotes.FirstOrDefault(o => o.Id == form.securityId);

            var positionService = new PositionService();
            var newPosition = positionService.CreateNewPosition(UserId, form.securityId, form.invest, form.isLong,
                form.leverage, Quotes.GetLastPrice(quote));

            var posIdToFollow = newPosition.Id;
            Task.Run(() =>
            {
                YJYGlobal.LogLine("NEW THREAD: check and OPEN follow positions for pos " + posIdToFollow);
                PositionService.CheckAndOpenFollowPositions(posIdToFollow);
            });

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

        [HttpPost]
        [Route("net")]
        [BasicAuth]
        public PositionDTO NetPosition(NetPositionFormDTO form)
        {
            var cache = WebCache.Instance;
            
            var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == form.securityId);
            if (prodDef.QuoteType == enmQuoteType.Closed || prodDef.QuoteType == enmQuoteType.Inactive)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, Resources.Resource.ProductClosed));

            var quote = cache.Quotes.FirstOrDefault(o => o.Id == form.securityId);

            var positionService = new PositionService();
            var closedPosition = positionService.DoClosePosition(UserId, form.posId,form.securityId, Quotes.GetLastPrice(quote));

            var posIdToFollowClose = closedPosition.Id;
            Task.Run(() =>
            {
                YJYGlobal.LogLine("NEW THREAD: check and CLOSE follow positions for pos " + posIdToFollowClose);
                PositionService.CheckAndCloseFollowPositions(posIdToFollowClose);
            });

            var result = Mapper.Map<PositionDTO>(closedPosition);

           return result;
        }

        [HttpGet]
        [Route("open")]
        [BasicAuth]
        public List<PositionDTO> GetOpenPositions(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            //var user = GetUser();

            var positions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt == null)
                .OrderByDescending(o => o.CreateTime)
                .Skip((pageNum-1)*pageSize).Take(pageSize)
                .ToList();

            var followUserIds = positions.Where(o => o.FollowUserId.HasValue).Select(o => o.FollowUserId).ToList();
            var users = db.Users.Where(o => followUserIds.Contains(o.Id)).ToList();

            var cache = WebCache.Instance;

            var positionDtos = positions.Select(delegate (Position p)
            {
                var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == Convert.ToInt32(p.SecurityId));

                var quote = cache.Quotes.FirstOrDefault(o => o.Id == Convert.ToInt32(p.SecurityId));

                var security = Mapper.Map<SecurityDetailDTO>(prodDef);

                if (quote != null)
                {
                    security.last = Quotes.GetLastPrice(quote);
                    //security.ask = quote.Ask;
                    //security.bid = quote.Bid;
                }

                var posDTO = Mapper.Map<PositionDTO>(p);

                //security
                posDTO.security = security;

                //calculate UPL
                posDTO.upl = Trades.CalculatePL(p, quote);

                if (p.FollowUserId.HasValue)
                {
                    var user = users.FirstOrDefault(o => o.Id == p.FollowUserId.Value);
                    posDTO.followUser=new UserBaseDTO()
                    {
                        id=user.Id,
                        nickname = user.Nickname,
                        picUrl = user.PicUrl,
                    };
                }

                return posDTO;
            }).Where(o => o != null).ToList();

            return positionDtos;
        }

        [HttpGet]
        [Route("closed")]
        [BasicAuth]
        public List<PositionDTO> GetClosedPositions(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            var positions = db.Positions.Where(o => o.UserId == UserId && o.ClosedAt != null)
                .OrderByDescending(o => o.ClosedAt)
                .Skip((pageNum - 1) * pageSize).Take(pageSize)
                .ToList();

            var followUserIds = positions.Where(o => o.FollowUserId.HasValue).Select(o => o.FollowUserId).ToList();
            var users = db.Users.Where(o => followUserIds.Contains(o.Id)).ToList();

            var cache = WebCache.Instance;

            var positionDtos = positions.Select(delegate (Position p)
            {
                var prodDef = cache.ProdDefs.FirstOrDefault(o => o.Id == Convert.ToInt32(p.SecurityId));

                var security = Mapper.Map<SecurityDetailDTO>(prodDef);

                var posDTO = Mapper.Map<PositionDTO>(p);

                //security
                posDTO.security = security;

                if (p.FollowUserId.HasValue)
                {
                    var user = users.FirstOrDefault(o => o.Id == p.FollowUserId.Value);
                    posDTO.followUser = new UserBaseDTO()
                    {
                        id = user.Id,
                        nickname = user.Nickname,
                        picUrl = user.PicUrl,
                    };
                }

                return posDTO;
            }).Where(o => o != null).ToList();

            return positionDtos;
        }

        [HttpPut]
        [Route("stopTake")]
        [BasicAuth]
        public PositionDTO SetStopTake(StopTakeFormDTO form)
        {
            var position = db.Positions.FirstOrDefault(o => o.Id == form.posId && o.UserId == UserId);

            if (position == null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "no such position"));

            if (position.ClosedAt != null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "position closed"));

            if (position.FollowPosId != null || position.FollowUserId!=null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "cannot set stop/take for followed position"));

            //var quote = WebCache.Instance.Quotes.FirstOrDefault(o => o.Id == position.SecurityId);
            //var lastPrice = Quotes.GetLastPrice(quote);

            if (form.stopPx != null)
            {
                if (Trades.CalculatePL(position, form.stopPx.Value, false) + position.Invest <= 0)
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                        "stop cannot be <= 0%"));

                //if(position.Side.Value && form.stopPx>=lastPrice || !position.Side.Value && form.stopPx<=lastPrice)
                //    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                //       "invalid stopPx against current price"));
            }

            if (position.StopPx != form.stopPx)
            {
                position.StopPx = form.stopPx;
                position.StopSetAt = DateTime.UtcNow;
            }
            if (position.TakePx != form.takePx)
            {
                position.TakePx = form.takePx;
                position.TakeSetAt = DateTime.UtcNow;
            }

            db.SaveChanges();

            return Mapper.Map<PositionDTO>(position);
        }

        [HttpGet]
        [Route("~/api/user/{userId}/position/open")]
        public List<PositionBaseDTO> GetUserOpenPositions(int userId)
        {
            var positions =
                db.Positions.Where(p => p.UserId == userId && p.ClosedAt == null)
                    .OrderByDescending(p => p.CreateTime)
                    .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                    .ToList();

            var prods = WebCache.Instance.ProdDefs;
            var quotes = WebCache.Instance.Quotes;

            var result = new List<PositionBaseDTO>();
            positions.ForEach(p =>
            {
                var dto = new PositionBaseDTO();
                dto.id = p.Id;

                var prodDef = prods.FirstOrDefault(pd => pd.Id == p.SecurityId);
                var quote = quotes.FirstOrDefault(o => o.Id == p.SecurityId);
                if (prodDef != null)
                {
                    //dto.invest = p.Invest;
                    dto.upl = Trades.CalculatePL(p, quote);
                    dto.roi = dto.upl/p.Invest;
                    dto.security = new SecurityBaseDTO()
                    {
                        id = p.SecurityId.Value,
                        name = Translator.GetProductNameByThreadCulture(prodDef.Name),
                        symbol = prodDef.Symbol,
                    };
                }

                result.Add(dto);
            });

            return result;
        }

        [HttpGet]
        [Route("~/api/user/{userId}/position/closed")]
        public List<PositionBaseDTO> GetUserClosedPositions(int userId)
        {
            var positions =
                db.Positions.Where(p => p.UserId == userId && p.ClosedAt != null)
                    .OrderByDescending(p => p.ClosedAt)
                    .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                    .ToList();

            var prods = WebCache.Instance.ProdDefs;

            var result = new List<PositionBaseDTO>();
            positions.ForEach(p =>
            {
                var dto = new PositionBaseDTO();
                dto.id = p.Id;

                var prodDef = prods.FirstOrDefault(pd => pd.Id == p.SecurityId);
                if (prodDef != null)
                {
                    //dto.invest = p.Invest;
                    dto.pl = p.PL;
                    dto.roi = p.PL / p.Invest;
                    dto.security = new SecurityBaseDTO()
                    {
                        id = p.SecurityId.Value,
                        name = Translator.GetProductNameByThreadCulture(prodDef.Name),
                        symbol = prodDef.Symbol,
                    };
                }

                result.Add(dto);
            });

            return result;
        }
    }
}
