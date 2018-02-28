using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using QuickFix.Fields;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Util;

namespace YJY_JOBS
{
    class PositionCheck
    {
        private static readonly TimeSpan _sleepInterval = TimeSpan.FromSeconds(3);

        public static void Run()
        {
            YJYGlobal.LogLine("Starting...");

            //var mapper = MapperConfig.GetAutoMapperConfiguration().CreateMapper();

            while (true)
            {
                try
                {
                    using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                    {
                        var redisProdDefClient = redisClient.As<ProdDef>();
                        var redisQuoteClient = redisClient.As<Quote>();
                        var redisTickClient = redisClient.As<Tick>();

                        using (var db = YJYEntities.Create())
                        {
                            var openPositions = db.Positions.Where(o => o.ClosedAt == null).ToList();

                            var prodDefs = redisProdDefClient.GetAll();
                            var quotes = redisQuoteClient.GetAll();

                            YJYGlobal.LogLine("Got " + openPositions.Count + " positions.");

                            var groups = openPositions.GroupBy(o => o.SecurityId).ToList();

                            foreach (var group in groups) //foreach security
                            {
                                var secId = group.Key;

                                //YJYGlobal.LogLine("sec: " + secId + " alert_count: " + group.Count());

                                var prodDef = prodDefs.FirstOrDefault(o => o.Id == secId);
                                var quote = quotes.FirstOrDefault(o => o.Id == secId);

                                if (prodDef == null || quote == null)
                                {
                                    YJYGlobal.LogLine("cannot find prodDef/quote " + secId);
                                    continue;
                                }

                                if (prodDef.QuoteType == enmQuoteType.Closed ||
                                    prodDef.QuoteType == enmQuoteType.Inactive)
                                {
                                    YJYGlobal.LogLine("prod " + prodDef.Id + " quoteType is " + prodDef.QuoteType);
                                    continue;
                                }

                                //if (DateTime.UtcNow - quote.Time > _tolerance)
                                //{
                                //    YJYGlobal.LogLine("quote " + quote.Id + " too old " + quote.Time);
                                //    continue;
                                //}


                                ////get historical highest and lowest price
                                //decimal highestBid;
                                //decimal lowestAsk;

                                //var ticks = redisTickClient.Lists[Ticks.GetTickListNamePrefix(TickSize.Raw) + prodDef.Id].GetAll();
                                //var dtUtcNow = DateTime.UtcNow;
                                //if (!_lastFetchTill.ContainsKey(prodDef.Id))
                                //{s
                                //    var historyTicks = ticks.Select(o => o.Time > dtUtcNow - _tolerance).ToList();

                                //}


                                var last = Quotes.GetLastPrice(quote);

                                foreach (var p in group) //foreach alert belong to a security
                                {
                                    //position goes to 0%
                                    var upl = Trades.CalculatePL(p, last);

                                    if (upl + p.Invest <= 0)
                                    {
                                        YJYGlobal.LogLine($"position { p.Id} (openAt {p.SettlePrice} isLong {p.Side}) CLOSED at {last} PL {upl}");
                                        continue;
                                    }

                                    //stop
                                    if (p.StopPx != null)
                                    {
                                        if (p.Side.Value && last <= p.StopPx || !p.Side.Value && last >= p.StopPx)
                                        {
                                            YJYGlobal.LogLine($"position {p.Id} (openAt {p.SettlePrice} isLong {p.Side}) STOPPED at {last} PL {upl}");
                                            continue;
                                        }
                                    }

                                    //take
                                    if (p.TakePx != null)
                                    {
                                        if (p.Side.Value && last >= p.TakePx || !p.Side.Value && last <= p.TakePx)
                                        {
                                            YJYGlobal.LogLine($"position {p.Id} (openAt {p.SettlePrice} isLong {p.Side}) TAKEN at {last} PL {upl}");
                                            continue;
                                        }
                                    }
                                }

                                //db.SaveChanges();
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                YJYGlobal.LogLine("");
                Thread.Sleep(_sleepInterval);
            }
        }
    }
}
