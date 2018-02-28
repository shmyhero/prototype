using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
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
                .Join(db.Users,g=>g.Key,u=>u.Id,(g,u)=> new UserDTO()
                {
                    id = g.Key.Value,

                    nickname = u.Nickname,
                    picUrl = u.PicUrl,

                    posCount = g.Count(),
                    winRate = (decimal)g.Count(p => p.PL > 0) / g.Count(),
                    roi = g.Sum(p => p.PL.Value) /g.Sum(p => p.Invest.Value),
                }).OrderByDescending(o => o.roi).ToList();

            return userDTOs;
        }
    }
}
