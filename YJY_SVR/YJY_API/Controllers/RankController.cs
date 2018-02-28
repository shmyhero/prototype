using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/rank")]
    public class RankController : YJYController
    {
        public RankController(YJYEntities db) : base(db)
        {
        }

        [HttpGet]
        [Route("user/plClosed/2w")]
        public List<UserDTO> GetUserRankPL2w()
        {
            var twoWeeksAgo = DateTimes.GetChinaToday().AddDays(-13);
            var twoWeeksAgoUtc = twoWeeksAgo.AddHours(-8);

            var userDTOs = db.Positions.Where(o => o.ClosedAt != null && o.ClosedAt >= twoWeeksAgoUtc)
                .GroupBy(o => o.UserId)
                .Join(db.Users, g => g.Key, u => u.Id, (g, u) => new UserDTO()
                {
                    id = g.Key.Value,

                    nickname = u.Nickname,
                    picUrl = u.PicUrl,

                    posCount = g.Count(),
                    winRate = (decimal) g.Count(p => p.PL > 0)/g.Count(),
                    roi = g.Sum(p => p.PL.Value)/g.Sum(p => p.Invest.Value),
                }).OrderByDescending(o => o.roi).Take(YJYGlobal.DEFAULT_PAGE_SIZE).ToList();

            var tryGetAuthUser = TryGetAuthUser();
            if (tryGetAuthUser != null)
            {
                //move myself to the top
                var findIndex = userDTOs.FindIndex(o => o.id == tryGetAuthUser.Id);
                if (findIndex > 0)
                {
                    var me = userDTOs.First(o => o.id == tryGetAuthUser.Id);
                    userDTOs.RemoveAt(findIndex);
                    userDTOs.Insert(0, me);
                }
                else if (findIndex == 0)
                {
                    //do nothing
                }
                else
                {
                    userDTOs.Insert(0, new UserDTO()
                    {
                        id = tryGetAuthUser.Id,
                        nickname = tryGetAuthUser.Nickname,
                        picUrl = tryGetAuthUser.PicUrl,

                        posCount = 0,
                        roi = 0,
                        winRate = 0,
                    });
                }
            }

            return userDTOs;
        }

        [HttpGet]
        [Route("user/following")]
        [BasicAuth]
        public List<UserDTO> GetFollowingUserRank()
        {
            var result =
                db.UserFollows
                    .Where(o => o.UserId == UserId)
                    .OrderByDescending(o => o.FollowAt)
                    .Join(db.Users, f => f.FollowingId, u => u.Id, (f, u) => new UserDTO()
                    {
                        id = u.Id,
                        nickname = u.Nickname,
                        picUrl = u.PicUrl,
                        //showData = o.Following.ShowData ?? CFDUsers.DEFAULT_SHOW_DATA,
                        //rank = o.Following.LiveRank ?? 0,
                    }).ToList();

            if (result.Count > 0)
            {
                var userIds = result.Select(o => o.id).ToList();

                var twoWeeksAgo = DateTimes.GetChinaToday().AddDays(-13);
                var twoWeeksAgoUtc = twoWeeksAgo.AddHours(-8);

                var datas =
                    db.Positions.Where(
                        o => userIds.Contains(o.UserId.Value) && o.ClosedAt != null && o.ClosedAt >= twoWeeksAgoUtc)
                        .GroupBy(o => o.UserId).Join(db.Users, g => g.Key, u => u.Id, (g, u) => new UserDTO()
                        {
                            id = g.Key.Value,

                            nickname = u.Nickname,
                            picUrl = u.PicUrl,

                            posCount = g.Count(),
                            winRate = (decimal)g.Count(p => p.PL > 0) / g.Count(),
                            roi = g.Sum(p => p.PL.Value) / g.Sum(p => p.Invest.Value),
                        }).OrderByDescending(o => o.roi).Take(YJYGlobal.DEFAULT_PAGE_SIZE).ToList();

                foreach (var userDto in result)
                {
                    var data = datas.FirstOrDefault(o => o.id == userDto.id);

                    if (data == null) //this guy has no data
                    {
                        userDto.roi = 0;
                        userDto.posCount = 0;
                        userDto.winRate = 0;
                    }
                    else
                    {
                        userDto.roi = data.roi;
                        userDto.posCount = data.posCount;
                        userDto.winRate = data.winRate;
                    }
                }

                //result = result.OrderByDescending(o => o.roi).ToList();
            }

            return result;
        }
    }
}
