using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/stat")]
    public class StatController : YJYController
    {
        public StatController(YJYEntities db): base(db)
        {
        }

        [HttpGet]
        [Route("~/api/user/{userId}/stat/tradeStyle")]
        public TradeStyleDTO GetTradeStyle(int userId)
        {
            var positions = db.Positions.Where(o => o.UserId == userId && o.ClosedAt != null).ToList();

            if(positions.Count==0)
                return new TradeStyleDTO();

            return new TradeStyleDTO()
            {
                avgDur = (decimal) positions.Average(o=>(o.ClosedAt-o.CreateTime).Value.TotalDays),
                avgInv = positions.Average(o=>o.Invest.Value),
                avgLev = positions.Average(o=>o.Leverage.Value),
                avgPl = positions.Average(o=>o.PL.Value),
                posCount = positions.Count,
                winRate = (decimal)positions.Count(o=>o.PL>0)/positions.Count,
            };
        }

        [HttpGet]
        [Route("~/api/user/{userId}/stat/chart/plClosed")]
        public List<PosChartDTO> PLChartClosed(int userId)
        {
            //var user = db.Users.FirstOrDefault(o => o.Id == userId);
            //if (!(user.ShowData ?? true) && userId != UserId)//not showing data && not myself
            //    return new List<PosChartDTO>();

            var dbList = db.Positions.Where(o => o.UserId == userId && o.ClosedAt != null)
                    .OrderBy(o => o.ClosedAt)
                    .ToList();

            if (dbList.Count == 0)
                return new List<PosChartDTO>();

            var result = dbList.GroupBy(o => o.ClosedAt.Value.AddHours(8).Date).Select(o => new PosChartDTO
            {
                date = o.Key,
                //Count = o.Count(),
                pl = o.Sum(p => p.PL.Value)
            }).ToList();

            #region fill-in all data points for client...

            var beginDate = DateTime.SpecifyKind(result.First().date, DateTimeKind.Utc);
            var endDate = DateTimes.GetChinaToday();
            var newResult = new List<PosChartDTO>();
            decimal cumulativePL = 0;
            for (DateTime d = beginDate; d <= endDate; d = d.AddDays(1))
            {
                if (d.DayOfWeek == DayOfWeek.Sunday) continue;

                var data = result.FirstOrDefault(o => o.date == d);

                if (data == null)
                    newResult.Add(new PosChartDTO() { date = d, pl = cumulativePL });
                else
                {
                    cumulativePL += data.pl;
                    newResult.Add(new PosChartDTO() { date = d, pl = cumulativePL });
                }
            }

            //if the first data is not zero, add a zero before it as a reference point
            if (newResult.First().pl != 0)
                newResult.Insert(0, new PosChartDTO() { date = newResult.First().date.AddDays(-1), pl = 0 });

            #endregion

            //var user = db.Users.FirstOrDefault(o => o.Id == userId);
            //if (!(user.ShowData ?? CFDUsers.DEFAULT_SHOW_DATA) && userId != UserId) //not showing data && not myself
            //{
            //    //data obfuscation
            //    var max = newResult.Max(o => o.pl);
            //    var min = newResult.Min(o => o.pl);
            //    var ratio = max - min == 0 ? 0 : 100 / (max - min);
            //    foreach (var dto in newResult)
            //    {
            //        dto.pl = (dto.pl - min) * ratio;
            //    }
            //}

            return newResult;
        }

        [HttpGet]
        [Route("~/api/user/{userId}/stat/chart/plClosed/1month")]
        public List<PosChartDTO> PLChartClosed2w(int userId)
        {
            //var user = db.Users.FirstOrDefault(o => o.Id == userId);
            //if (!(user.ShowData ?? true) && userId != UserId)//not showing data && not myself
            //    return new List<PosChartDTO>();

            var beginTime = DateTimes.GetChinaToday().AddMonths(-1);
            var beginTimeUtc = beginTime.AddHours(-8);

            var dbList = db.Positions.Where(o => o.UserId == userId && o.ClosedAt != null && o.ClosedAt >= beginTimeUtc)
                    .OrderBy(o => o.ClosedAt)
                    .ToList();

            //if (dbList.Count == 0)
            //    return new List<PosChartDTO>();

            var result = dbList.GroupBy(o => o.ClosedAt.Value.AddHours(8).Date).Select(o => new PosChartDTO
            {
                date = o.Key,
                //Count = o.Count(),
                pl = o.Sum(p => p.PL.Value)
            }).ToList();

            #region fill-in all data points for client...

            var beginDate = beginTime;
            var endDate = DateTimes.GetChinaToday();
            var newResult = new List<PosChartDTO>();
            decimal cumulativePL = 0;
            for (DateTime d = beginDate; d <= endDate; d = d.AddDays(1))
            {
                if (d.DayOfWeek == DayOfWeek.Sunday) continue;

                var data = result.FirstOrDefault(o => o.date == d);

                if (data == null)
                    newResult.Add(new PosChartDTO() { date = d, pl = cumulativePL });
                else
                {
                    cumulativePL += data.pl;
                    newResult.Add(new PosChartDTO() { date = d, pl = cumulativePL });
                }
            }

            //if the first data is not zero, add a zero before it as a reference point
            if (newResult.First().pl != 0)
                newResult.Insert(0, new PosChartDTO() { date = newResult.First().date.AddDays(-1), pl = 0 });

            #endregion

            //var user = db.Users.FirstOrDefault(o => o.Id == userId);
            //if (!(user.ShowData ?? CFDUsers.DEFAULT_SHOW_DATA) && userId != UserId) //not showing data && not myself
            //{
            //    //data obfuscation
            //    var max = newResult.Max(o => o.pl);
            //    var min = newResult.Min(o => o.pl);
            //    var ratio = max - min == 0 ? 0 : 100 / (max - min);
            //    foreach (var dto in newResult)
            //    {
            //        dto.pl = (dto.pl - min) * ratio;
            //    }
            //}

            return newResult;
        }

        /// <summary>
        /// 达人榜首页盈亏分布
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("~/api/user/{userID}/stat/plDist")]
        public List<PLSpreadDTO> GetOthersPLSpread(int userID)
        {
            List<PLSpreadDTO> spreads = new List<PLSpreadDTO>();

            //var user = db.Users.FirstOrDefault(o => o.Id == userID);
            //if (!(user.ShowData ?? CFDUsers.DEFAULT_SHOW_DATA))
            //{
            //    return spreads;
            //}

            //找出平仓笔数最多的三个产品
            var prodIDs = db.Positions.Where(n => n.UserId == userID && n.Invest.HasValue && n.PL.HasValue && n.ClosedAt.HasValue)
                .GroupBy(n => n.SecurityId).Select(s => new {
                    prodID = s.Key,
                    count = s.Count(),
                }).OrderByDescending(s => s.count).Take(3).ToList();

            prodIDs.ForEach(p => {
                //平均收益
                var pl = db.Positions.Where(n => n.UserId == userID && n.Invest.HasValue && n.PL.HasValue && n.ClosedAt.HasValue && n.SecurityId == p.prodID).Sum(n => n.PL);
                var investment = db.Positions.Where(n => n.UserId == userID && n.Invest.HasValue && n.PL.HasValue && n.ClosedAt.HasValue && n.SecurityId == p.prodID).Sum(n => n.Invest);
                //胜率
                decimal wins = db.Positions.Where(n => n.UserId == userID && n.Invest.HasValue && n.PL.HasValue && n.ClosedAt.HasValue && n.SecurityId == p.prodID && n.PL > 0).Count();
                // var totals = db.NewPositionHistory_live.Where(n => n.UserId == UserId && n.InvestUSD.HasValue && n.PL.HasValue && n.ClosedAt.HasValue && n.SecurityId == p.prodID).Count();

                var prodDef = WebCache.Instance.ProdDefs.FirstOrDefault(prod => prod.Id == p.prodID);
                spreads.Add(new PLSpreadDTO()
                {
                    name = Translator.GetProductNameByThreadCulture(prodDef.Name),
                    symbol = prodDef.Symbol,
                    count = p.count,
                    pl = pl.Value / investment.Value,
                    rate = wins / p.count
                });

            });

            return spreads;
        }
    }
}
