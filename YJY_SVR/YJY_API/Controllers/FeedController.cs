using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Threading;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_COMMON.Azure;

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
            var tryGetAuthUser = TryGetAuthUser();

            if (tryGetAuthUser == null)
            {
                //get system feed
                var language = Thread.CurrentThread.CurrentUICulture.Name;
                var systemFeedsWhereClause =db.Headlines.Where(o =>o.Language==null || language.ToLower().StartsWith(o.Language.ToLower()));
                if (olderThan != null)
                    systemFeedsWhereClause = systemFeedsWhereClause.Where(o => o.CreateAt < olderThan);
                if (newerThan != null)
                    systemFeedsWhereClause = systemFeedsWhereClause.Where(o => o.CreateAt > newerThan);
                var systemFeeds = systemFeedsWhereClause
                    .OrderByDescending(o => o.CreateAt).Take(count)
                    .Select(o => new FeedDTO()
                    {
                        user =
                            new UserBaseDTO()
                            {
                                picUrl = Blob.USER_DEFAULT_PIC_FOLDER_URL + Blob.SYSTEM_FEED_PIC_FILENAME,
                                //nickname = "system",
                            },
                        type = "system",
                        time = o.CreateAt.Value,
                        body = o.Body,
                        title = o.Header,
                    })
                    .ToList();

                return systemFeeds;
            }

            var feedUserIds = new List<int>();

            if (tryGetAuthUser.ShowFollowingFeed ?? true)
            {
                //following user ids
                var followingUserIds =
                    db.UserFollows.Where(o => o.UserId == tryGetAuthUser.Id).Select(o => o.FollowingId).ToList();

                feedUserIds = feedUserIds.Concat(followingUserIds).ToList();
            }

            if (tryGetAuthUser.ShowTradeFollowingFeed ?? true)
            {
                //trade following user ids
                var tradeFollowingUserIds =
                    db.UserTradeFollows.Where(o => o.UserId == tryGetAuthUser.Id).Select(o => o.FollowingId).ToList();

                feedUserIds = feedUserIds.Concat(tradeFollowingUserIds).ToList();
            }

            //-------------------balance type -------------------
            int balanceTypeId = 1;
            if (tryGetAuthUser != null)
                balanceTypeId = db.Balances.FirstOrDefault(o => o.Id == tryGetAuthUser.ActiveBalanceId).TypeId;

            //get open feeds
            var openFeedsWhereClause = db.Positions.Where(o => o.FollowPosId == null && feedUserIds.Contains(o.UserId.Value) && o.BalanceTypeId == balanceTypeId);
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
            var closeFeedsWhereClause = db.Positions.Where(o => o.FollowPosId == null && feedUserIds.Contains(o.UserId.Value) && o.ClosedAt != null && o.BalanceTypeId == balanceTypeId);
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

            //get system feed
            if (tryGetAuthUser.ShowHeadlineFeed ?? true)
            {
                //get system feed
                var language = Thread.CurrentThread.CurrentUICulture.Name;
                var systemFeedsWhereClause = db.Headlines.Where(o => o.Language == null || language.ToLower().StartsWith(o.Language.ToLower()));
                if (olderThan != null)
                    systemFeedsWhereClause = systemFeedsWhereClause.Where(o => o.CreateAt < olderThan);
                if (newerThan != null)
                    systemFeedsWhereClause = systemFeedsWhereClause.Where(o => o.CreateAt > newerThan);
                var systemFeeds = systemFeedsWhereClause
                    .OrderByDescending(o => o.CreateAt).Take(count)
                    .Select(o => new FeedDTO()
                    {
                        user =
                            new UserBaseDTO()
                            {
                                picUrl = Blob.USER_DEFAULT_PIC_FOLDER_URL + Blob.SYSTEM_FEED_PIC_FILENAME,
                                //nickname = "system",
                            },
                        type = "system",
                        time = o.CreateAt.Value,
                        body = o.Body,
                        title = o.Header,
                    })
                    .ToList();

                //add to results
                @resultEnumerable = @resultEnumerable.Concat(systemFeeds);
            }

            //filter by param 'newerThan'
            if (newerThan != null)
                @resultEnumerable = @resultEnumerable.Where(o => o.time > newerThan.Value);

            var result = @resultEnumerable.OrderByDescending(o => o.time).Take(count).ToList();

            //get ranked users
            var beginTimeUtc = DateTimes.GetRankingBeginTimeUTC();
            var rankedUsers =
                db.Positions.Where(o => o.ClosedAt != null && o.ClosedAt >= beginTimeUtc && o.BalanceTypeId == balanceTypeId)
                    .GroupBy(o => o.UserId)
                    .Select(g => new
                    {
                        id = g.Key.Value,
                        roi = g.Sum(p => p.PL.Value) / g.Sum(p => p.Invest.Value),
                    })
                    .OrderByDescending(o => o.roi)
                    .Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                    .ToList();

            //populate user/security info
            var users = db.Users.Where(o => feedUserIds.Contains(o.Id)).ToList();
            var prods = WebCache.Instance.ProdDefs;
            foreach (var feedDto in result)
            {
                if (feedDto.user != null && feedDto.user.id != null)
                {
                    var user = users.FirstOrDefault(o => o.Id == feedDto.user.id);
                    feedDto.user.nickname = user.Nickname;
                    feedDto.user.picUrl = user.PicUrl;

                    feedDto.isRankedUser = rankedUsers.Any(o => o.id == feedDto.user.id);
                }

                if (feedDto.security != null)
                    feedDto.security.name =
                        Translator.GetProductNameByThreadCulture(
                            prods.FirstOrDefault(o => o.Id == feedDto.security.id).Name);
            }

            return result;
        }

        [HttpGet]
        [Route("filter")]
        [BasicAuth]
        public FeedFilterDTO GetFeedFilter()
        {
            var user = GetUser();
            return new FeedFilterDTO()
            {
                showFollowing = user.ShowFollowingFeed ?? true,
                showHeadline = user.ShowHeadlineFeed ?? true,
                showTradeFollowing = user.ShowTradeFollowingFeed ?? true,
            };
        }

        [HttpPut]
        [Route("filter")]
        [BasicAuth]
        public ResultDTO SetFeedFilter(FeedFilterDTO form)
        {
            var user = GetUser();
            user.ShowFollowingFeed = form.showFollowing;
            user.ShowHeadlineFeed = form.showHeadline;
            user.ShowTradeFollowingFeed = form.showTradeFollowing;
            db.SaveChanges();
            return new ResultDTO(true);
        }
    }
}