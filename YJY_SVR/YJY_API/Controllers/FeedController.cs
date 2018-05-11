using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.DTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/feed")]
    public class FeedController : YJYController
    {
        public FeedController(YJYEntities db) : base(db)
        {
        }

        [HttpGet]
        [Route("default")]
        public List<FeedDTO> GetDefaultFeeds(int count = 50, DateTime? newerThan = null, DateTime? olderThan = null)
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

            //ranked user ids
            var feedUserIds = rankedUsers.Select(o => o.id).ToList();

            var tryGetAuthUser = TryGetAuthUser();
            if (tryGetAuthUser != null)
            {
                //remove me from ranked user ids
                if (feedUserIds.Contains(tryGetAuthUser.Id))
                    feedUserIds.Remove(tryGetAuthUser.Id);

                //following user ids
                var followingUserIds =
                    db.UserFollows.Where(o => o.UserId == tryGetAuthUser.Id).Select(o => o.FollowingId).ToList();

                feedUserIds = feedUserIds.Concat(followingUserIds).ToList();
            }

            //get open feeds
            var openFeedsWhereClause = db.Positions.Where(o => o.FollowPosId == null && feedUserIds.Contains(o.UserId.Value));
            if (olderThan != null) openFeedsWhereClause = openFeedsWhereClause.Where(o => o.CreateTime < olderThan);
            var openFeeds = openFeedsWhereClause
                .OrderByDescending(o => o.CreateTime).Take(count)
                .Select(o => new FeedDTO()
                {
                    user = new UserBaseDTO() {id = o.UserId.Value},
                    type = "open",
                    time = o.CreateTime.Value,
                    position =
                        new PositionBaseDTO() {id = o.Id, invest = o.Invest, leverage = o.Leverage, isLong = o.Side},
                    security = new SecurityBaseDTO() {id = o.SecurityId.Value},
                })
                .ToList();

            //get close feeds
            var closeFeedsWhereClause = db.Positions.Where(o => o.FollowPosId == null && feedUserIds.Contains(o.UserId.Value) && o.ClosedAt != null);
            if (olderThan != null) closeFeedsWhereClause = closeFeedsWhereClause.Where(o => o.ClosedAt < olderThan);
            var closeFeeds = closeFeedsWhereClause
                .OrderByDescending(o => o.ClosedAt).Take(count)
                .Select(o => new FeedDTO()
                {
                    user = new UserBaseDTO() {id = o.UserId.Value},
                    type = "close",
                    time = o.ClosedAt.Value,
                    position = new PositionBaseDTO() {id = o.Id, roi = o.PL/o.Invest, isLong = o.Side},
                    security = new SecurityBaseDTO() {id = o.SecurityId.Value},
                })
                .ToList();

            //get status feeds
            var statusFeedsWhereClause = db.Status.Where(o => feedUserIds.Contains(o.UserId.Value));
            if (olderThan != null) statusFeedsWhereClause = statusFeedsWhereClause.Where(o => o.Time < olderThan);
            var statusFeed = statusFeedsWhereClause
                .OrderByDescending(o => o.Time).Take(count)
                .Select(o => new FeedDTO()
                {
                    user = new UserBaseDTO() {id = o.UserId.Value},
                    type = "status",
                    time = o.Time.Value,
                    status = o.Text,
                })
                .ToList();

            //concat results
            var @resultEnumerable = openFeeds.Concat(closeFeeds).Concat(statusFeed);

            //filter by time param
            if (newerThan != null)
                @resultEnumerable = @resultEnumerable.Where(o => o.time > newerThan.Value);

            var result = @resultEnumerable.OrderByDescending(o => o.time).Take(count).ToList();

            //populate user/security info
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