using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.Azure.ServiceBus;
using YJY_COMMON;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Model.Queue;
using YJY_COMMON.Util;

namespace YJY_JOBS
{
   

    

    class PositionCheck
    {
        // Connection String for the namespace can be obtained from the Azure portal under the 
        // 'Shared Access policies' section.
        private static readonly string ServiceBusConnectionString = YJYGlobal.GetConfigurationSetting("ServiceBusConnectionString");

        const string QueueName = "positiontoclose";
        static QueueClient _queueClient;

        private static readonly TimeSpan _sleepInterval = TimeSpan.FromSeconds(1);

        private static IDictionary<int, DateTime> _sentPosIds = new Dictionary<int, DateTime>();

        public static void Run()
        {
            YJYGlobal.LogLine("Starting...");

            //var mapper = MapperConfig.GetAutoMapperConfiguration().CreateMapper();

            _queueClient = new QueueClient(ServiceBusConnectionString, QueueName);

            while (true)
            {
                try
                {
                    using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                    {
                        var redisProdDefClient = redisClient.As<ProdDef>();
                        var redisQuoteClient = redisClient.As<Quote>();
                        //var redisTickClient = redisClient.As<Tick>();

                        using (var db = YJYEntities.Create())
                        {
                            var openPositions = db.Positions.Where(o => o.ClosedAt == null).ToList();

                            var prodDefs = redisProdDefClient.GetAll();
                            var quotes = redisQuoteClient.GetAll();

                            var openPositionsNotSent = openPositions.Where(o => !_sentPosIds.ContainsKey(o.Id)).ToList();

                            YJYGlobal.LogLine(openPositionsNotSent.Count + "/" + openPositions.Count +
                                              " (notSent/all) open positions.");

                            var messages = new List<Message>();
                            var posIds = new List<int>();

                            var groups = openPositionsNotSent.GroupBy(o => o.SecurityId).ToList();

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
                                    //YJYGlobal.LogLine("prod " + prodDef.Id + " quoteType is " + prodDef.QuoteType);
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
                                    var upl = Trades.CalculatePL(p, last, false);

                                    var inv = p.Invest.Value.ToString("0");
                                    var lev = p.Leverage.Value.ToString("0");
                                    var setPx = p.SettlePrice.Value.ToString("F" + prodDef.Prec);

                                    if (upl + p.Invest <= 0)
                                    {
                                        YJYGlobal.LogLine(
                                            $"position {p.Id} ({(p.Side.Value ? "↗" : "↘")} {inv}x{lev} at {setPx}) CLOSED at {last} PL {upl.ToString("0.00")}");

                                        posIds.Add(p.Id);
                                        messages.Add(new Message(Serialization.ObjectToByteArray(
                                            new PosToClose()
                                            {
                                                Id = p.Id,
                                                closeType = PositionCloseType.Liquidate,
                                                closePx = last,
                                                closePxTime = quote.Time,
                                            })));
                                        continue;
                                    }

                                    //stop
                                    if (p.StopPx != null)
                                    {
                                        if (p.Side.Value && last <= p.StopPx || !p.Side.Value && last >= p.StopPx)
                                        {
                                            YJYGlobal.LogLine(
                                                $"position {p.Id} ({(p.Side.Value ? "↗" : "↘")} {inv}x{lev} at {setPx}) STOPPED at {last} PL {upl.ToString("0.00")}");

                                            posIds.Add(p.Id);
                                            messages.Add(new Message(Serialization.ObjectToByteArray(
                                                new PosToClose()
                                                {
                                                    Id = p.Id,
                                                    closeType = PositionCloseType.Stop,
                                                    closePx = last,
                                                    closePxTime = quote.Time,
                                                })));
                                            continue;
                                        }
                                    }

                                    //take
                                    if (p.TakePx != null)
                                    {
                                        if (p.Side.Value && last >= p.TakePx || !p.Side.Value && last <= p.TakePx)
                                        {
                                            YJYGlobal.LogLine(
                                                $"position {p.Id} ({(p.Side.Value ? "↗" : "↘")} {inv}x{lev} at {setPx}) TAKEN at {last} PL {upl.ToString("0.00")}");

                                            posIds.Add(p.Id);
                                            messages.Add(new Message(Serialization.ObjectToByteArray(
                                                new PosToClose()
                                                {
                                                    Id = p.Id,
                                                    closeType = PositionCloseType.Take,
                                                    closePx = last,
                                                    closePxTime = quote.Time,
                                                })));
                                            continue;
                                        }
                                    }
                                }

                                //db.SaveChanges();
                            }

                            if (messages.Count > 0)
                            {
                                _queueClient.SendAsync(messages);
                                foreach (var posId in posIds)
                                {
                                    _sentPosIds.Add(posId, DateTime.UtcNow);
                                }
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