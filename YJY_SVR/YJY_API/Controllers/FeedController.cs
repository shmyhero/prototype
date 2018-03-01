using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ServiceStack.Common.Extensions;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_SVR.Caching;
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
            var twoWeeksAgo = DateTimes.GetChinaToday().AddDays(-13);
            var twoWeeksAgoUtc = twoWeeksAgo.AddHours(-8);

            var rankedUsers =
                db.Positions.Where(o => o.ClosedAt != null && o.ClosedAt >= twoWeeksAgoUtc)
                    .GroupBy(o => o.UserId)
                    .Select(g => new
                    {
                        id = g.Key.Value,
                        roi = g.Sum(p => p.PL.Value)/g.Sum(p => p.Invest.Value),
                    })
                    .OrderByDescending(o => o.roi)
                    .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                    .ToList();

            var feedUserIds = rankedUsers.Select(o => o.id).ToList();

            var tryGetAuthUser = TryGetAuthUser();
            if (tryGetAuthUser != null)
            {
                if (feedUserIds.Contains(tryGetAuthUser.Id))
                    feedUserIds.Remove(tryGetAuthUser.Id);

                var followingUserIds = db.UserFollows.Where(o => o.UserId == tryGetAuthUser.Id).Select(o=>o.FollowingId).ToList();

                feedUserIds = feedUserIds.Concat(followingUserIds).ToList();
            }

            var openFeeds = db.Positions.Where(o => feedUserIds.Contains(o.UserId.Value))
                .Select(o => new FeedDTO()
                {
                    user = new UserBaseDTO() { id = o.UserId.Value },
                    type = "open",
                    time=o.CreateTime.Value,
                    position = new PositionBaseDTO(){id=o.Id,invest=o.Invest,leverage=o.Leverage},
                    security = new SecurityBaseDTO() { id = o.SecurityId.Value },
                })
                .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                .ToList();

            var closeFeeds = db.Positions.Where(o => feedUserIds.Contains(o.UserId.Value) && o.ClosedAt!=null)
                .Select(o => new FeedDTO()
                {
                    user = new UserBaseDTO() { id = o.UserId.Value },
                    type = "close",
                    time = o.ClosedAt.Value,
                    position = new PositionBaseDTO() { id = o.Id, roi = o.PL/o.Invest},
                    security = new SecurityBaseDTO() { id = o.SecurityId.Value },
                })
                .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                .ToList();
            
            var result = openFeeds.Concat(closeFeeds).OrderByDescending(o => o.time).ToList();

            var users = db.Users.Where(o => feedUserIds.Contains(o.Id)).ToList();
            var prods = WebCache.Instance.ProdDefs;
            foreach (var feedDto in result)
            {
                var user = users.FirstOrDefault(o => o.Id == feedDto.user.id);
                feedDto.user.nickname = user.Nickname;
                feedDto.user.picUrl = user.PicUrl;

                feedDto.isRankedUser = rankedUsers.Any(o => o.id == feedDto.user.id);

                if (feedDto.security != null)
                    feedDto.security.name =
                        Translator.GetProductNameByThreadCulture(
                            prods.FirstOrDefault(o => o.Id == feedDto.security.id).Name);
            }

            return result;
        }
    }
}
