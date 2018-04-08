using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using QuickFix;
using QuickFix.Transport;
using ServiceStack.Redis.Generic;
using YJY_COMMON;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Util;

namespace YJY_JOBS.Ayondo
{
    internal class AyondoFixFeedWorker
    {
        private static Timer _timerQuotes;
        private static Timer _timerProdDefs;
        private static Timer _timerProdDefRequest;
        private static Timer _timerRawTicks;
        private static Timer _timerTicks;
        private static Timer _timerKLines;

        private static AyondoFixFeedApp myApp;

        private static readonly TimeSpan _intervalProdDefRequest = TimeSpan.FromMinutes(60);
        private static readonly TimeSpan _intervalProdDefs = TimeSpan.FromMilliseconds(500);
        private static readonly TimeSpan _intervalQuotes = TimeSpan.FromMilliseconds(500);
        private static readonly TimeSpan _intervalRawTicks = TimeSpan.FromMilliseconds(500);
        private static readonly TimeSpan _intervalTicks = TimeSpan.FromSeconds(10);
        private static readonly TimeSpan _intervalKLine = TimeSpan.FromSeconds(10);

        public static void Run(bool isLive = false)
        {
            SessionSettings settings = new SessionSettings(YJYGlobal.GetConfigurationSetting("ayondoFixFeedCfgFilePath"));
            myApp = new AyondoFixFeedApp(YJYGlobal.GetConfigurationSetting("ayondoFixFeedUsername"),
                YJYGlobal.GetConfigurationSetting("ayondoFixFeedPassword"));
            IMessageStoreFactory storeFactory = 
                new MemoryStoreFactory();
                //new FileStoreFactory(settings);
            //ILogFactory logFactory = new FileLogFactory(settings);
            SocketInitiator initiator = new SocketInitiator(myApp, storeFactory, settings,
                null 
                //logFactory
                );

            //var redisClient = YJYGlobal.BasicRedisClientManager.GetClient();
            //var redisProdDefClient = redisClient.As<ProdDef>();
            //var redisTickClient = redisClient.As<Tick>();

            initiator.Start();

            //run tasks in NEW threads
            _timerProdDefs = new Timer(SaveProdDefs, null, _intervalProdDefs, TimeSpan.FromMilliseconds(-1));
            _timerProdDefRequest = new Timer(SendProdDefRequest, null, _intervalProdDefRequest,
                TimeSpan.FromMilliseconds(-1));
            _timerQuotes = new Timer(SaveQuotes, null, _intervalQuotes, TimeSpan.FromMilliseconds(-1));
            _timerRawTicks = new Timer(SaveRawTicks, null, _intervalRawTicks, TimeSpan.FromMilliseconds(-1));
            _timerTicks = new Timer(SaveTicks, null, _intervalTicks, TimeSpan.FromMilliseconds(-1));
            _timerKLines = new Timer(SaveKLine, null, _intervalKLine, TimeSpan.FromMilliseconds(-1));

            while (true)
            {
                //System.Console.WriteLine("o hai");
                System.Threading.Thread.Sleep(1000);
            }

            //initiator.Stop();
        }

        private static void SaveQuotes(object state)
        {
            while (true)
            {
                try
                {
                    IList<Quote> quotes = new List<Quote>();
                    while (!myApp.QueueQuotes.IsEmpty)
                    {
                        Quote obj;
                        var tryDequeue = myApp.QueueQuotes.TryDequeue(out obj);
                        quotes.Add(obj);
                    }

                    if (quotes.Count > 0)
                    {
                        var distinctQuotes =
                            quotes.GroupBy(o => o.Id).Select(o => o.OrderByDescending(p => p.Time).First()).ToList();

                        var dtBeginSave = DateTime.Now;

                        using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                        {
                            var redisQuoteClient = redisClient.As<Quote>();
                            redisQuoteClient.StoreAll(distinctQuotes);
                        }

                        YJYGlobal.LogLine("Count: " + distinctQuotes.Count + "/" + quotes.Count + " (distinct/raw) "
                                          + " Time: " +
                                          quotes.Min(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND)
                                          + " ~ " +
                                          quotes.Max(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND)
                                          + ". Saved to redis " + (DateTime.Now - dtBeginSave).TotalMilliseconds);
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalQuotes);
            }
        }

        private static void SaveProdDefs(object state)
        {
            while (true)
            {
                try
                {
                    //new prod list from Ayondo MDS2
                    IList<ProdDef> listNew = new List<ProdDef>();
                    while (!myApp.QueueProdDefs.IsEmpty)
                    {
                        ProdDef obj;
                        var tryDequeue = myApp.QueueProdDefs.TryDequeue(out obj);
                        listNew.Add(obj);
                    }

                    if (listNew.Count > 0)
                    {
                        YJYGlobal.LogLine("Saving " + listNew.Count + " ProdDefs to Redis...");

                        using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                        {
                            var redisProdDefClient = redisClient.As<ProdDef>();

                            //current redis list
                            var listOld = redisProdDefClient.GetAll();

                            IList<ProdDef> listToSave = new List<ProdDef>();

                            foreach (var newProdDef in listNew)
                            {
                                var old = listOld.FirstOrDefault(o => o.Id == newProdDef.Id);

                                if (old != null) //updating prod def in redis
                                {
                                    //update open/close time/price depending on state change
                                    if (old.QuoteType != enmQuoteType.Closed && newProdDef.QuoteType == enmQuoteType.Closed) //xxx -> close
                                    {
                                        YJYGlobal.LogLine("PROD CLOSED " + newProdDef.Id + " time: " + newProdDef.Time +
                                                          " offer: " + newProdDef.Offer + " bid: " + newProdDef.Bid);
                                        
                                        old.LastClose = newProdDef.Time;
                                    }
                                    else if (old.QuoteType != enmQuoteType.Open && old.QuoteType != enmQuoteType.PhoneOnly &&
                                             (newProdDef.QuoteType == enmQuoteType.Open || newProdDef.QuoteType == enmQuoteType.PhoneOnly)) //xxx -> open/phone
                                    {
                                        YJYGlobal.LogLine("PROD OPENED " + newProdDef.Id + " time: " +
                                                          newProdDef.Time + " offer: " + newProdDef.Offer + " bid: " +
                                                          newProdDef.Bid);

                                        //open time
                                        old.LastOpen = newProdDef.Time;

                                        //open prices
                                        old.OpenAsk = newProdDef.Offer;
                                        old.OpenBid = newProdDef.Bid;

                                        //preclose
                                        if (old.LastClose == null
                                            ||
                                            //last close time and this open time is not the same day (regarding session refresh time)
                                            Products.GetLocalDateRegardingSessionRefreshTime(old.LastClose.Value,
                                                newProdDef) <
                                            Products.GetLocalDateRegardingSessionRefreshTime(newProdDef.Time, newProdDef)
                                            )
                                        {
                                            old.PreClose = Quotes.GetClosePrice(newProdDef) ??
                                                           //when close ask/bid is null, get from ask/bid
                                                           Quotes.GetLastPrice(newProdDef);
                                        }
                                    }

                                    //update fields
                                    old.Time = newProdDef.Time;
                                    old.QuoteType = newProdDef.QuoteType;
                                    old.Name = newProdDef.Name;
                                    old.Symbol = newProdDef.Symbol;
                                    old.AssetClass = newProdDef.AssetClass;
                                    old.Bid = newProdDef.Bid;
                                    old.Offer = newProdDef.Offer;

                                    old.CloseBid = newProdDef.CloseBid;
                                    old.CloseAsk = newProdDef.CloseAsk;

                                    old.Shortable = newProdDef.Shortable;
                                    old.MinSizeShort = newProdDef.MinSizeShort;
                                    old.MaxSizeShort = newProdDef.MaxSizeShort;
                                    old.MinSizeLong = newProdDef.MinSizeLong;
                                    old.MaxSizeLong = newProdDef.MaxSizeLong;
                                    old.MaxLeverage = newProdDef.MaxLeverage;
                                    old.PLUnits = newProdDef.PLUnits;
                                    old.LotSize = newProdDef.LotSize;
                                    old.Ccy2 = newProdDef.Ccy2;
                                    old.Prec = newProdDef.Prec;
                                    old.SMD = newProdDef.SMD;
                                    old.GSMD = newProdDef.GSMD;
                                    old.GSMS = newProdDef.GSMS;

                                    old.SessionTime = newProdDef.SessionTime;
                                    old.SessionZone = newProdDef.SessionZone;

                                    listToSave.Add(old);
                                }
                                else //appending new prod def into redis
                                {
                                    listToSave.Add(newProdDef);
                                }
                            }

                            redisProdDefClient.StoreAll(listToSave);
                        }
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalProdDefs);
            }
        }

        private static void SendProdDefRequest(object state)
        {
            while (true)
            {
                try
                {
                    YJYGlobal.LogLine("sending mds1 request...");
                    myApp.SendMDS1Request();
                }
                catch (Exception e)
                {
                    YJYGlobal.LogLine("sending mds1 request failed");
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalProdDefRequest);
            }
        }

        private static void SaveRawTicks(object state)
        {
            while (true)
            {
                try
                {
                    IList<Quote> quotes = new List<Quote>();
                    while (!myApp.QueueQuotesForRawTick.IsEmpty)
                    {
                        Quote obj;
                        var tryDequeue = myApp.QueueQuotesForRawTick.TryDequeue(out obj);
                        quotes.Add(obj);
                    }

                    if (quotes.Count > 0)
                    {
                        var quoteGroups = quotes.GroupBy(o => o.Id).ToList();

                        var dtBeginSave = DateTime.Now;
                        var count = 0;
                        //var entitiesToSaveToDB = new List<QuoteHistory>();

                        using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                        {
                            var redisTickClient = redisClient.As<Tick>();

                            foreach (var quoteGroup in quoteGroups)
                            {
                                if (!myApp.ProdDefs.ContainsKey(quoteGroup.Key)) //no product definition
                                {
                                    YJYGlobal.LogLine("SaveRawTicks: no prodDef. tick ignored " + quoteGroup.Key);
                                    continue;
                                }

                                var prodDef = myApp.ProdDefs[quoteGroup.Key];
                                if (prodDef.QuoteType != enmQuoteType.Open &&
                                    prodDef.QuoteType != enmQuoteType.PhoneOnly) //not open not phoneOnly
                                {
                                    YJYGlobal.LogLine("SaveRawTicks: prod not opening. tick ignored. " + prodDef.Id + " " +
                                                      prodDef.Name);
                                    continue;
                                }

                                var list =
                                    redisTickClient.Lists[Ticks.GetTickListNamePrefix(TickSize.Raw) + quoteGroup.Key];

                                var ticksToAdd =
                                    quoteGroup.Select(o => new Tick {P = Quotes.GetLastPrice(o), T = o.Time})
                                        .OrderBy(o => o.T)
                                        .ToList();

                                list.AddRange(ticksToAdd);
                                count++;

                                //clear history to prevent data size get too big
                                var clearWhenSize = Ticks.GetClearWhenSize(TickSize.Raw);
                                var clearToSize = Ticks.GetClearToSize(TickSize.Raw);
                                if (list.Count > clearWhenSize)
                                {
                                    YJYGlobal.LogLine("Raw Ticks " + quoteGroup.Key + " Clearing data from " +
                                                      list.Count + " to " + clearToSize);
                                    var ticks = list.GetAll();
                                    var newTicks = ticks.Skip(ticks.Count - clearToSize);
                                    list.RemoveAll();
                                    list.AddRange(newTicks);
                                }
                            }
                        }

                        YJYGlobal.LogLine("\t" + TickSize.Raw + " Ticks " + count + "/" + quoteGroups.Count + "/" +
                                          quotes.Count + " " + " Time: " +
                                          quotes.Min(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) + " ~ " +
                                          quotes.Max(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) +
                                          " Saved to Redis " + (DateTime.Now - dtBeginSave).TotalMilliseconds);
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalRawTicks);
            }
        }

        private static void SaveTicks(object state)
        {
            while (true)
            {
                try
                {
                    IList<Quote> quotes = new List<Quote>();
                    while (!myApp.QueueQuotesForTick.IsEmpty)
                    {
                        Quote obj;
                        var tryDequeue = myApp.QueueQuotesForTick.TryDequeue(out obj);
                        quotes.Add(obj);
                    }

                    using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                    {
                        var redisTickClient = redisClient.As<Tick>();
                        var redisProdDefClient = redisClient.As<ProdDef>();

                        var prodDefs = redisProdDefClient.GetAll();

                        if (quotes.Count > 0)
                        {
                            //the time of the last message received from Ayondo
                            var dtAyondoNow = quotes.Max(o => o.Time);

                            var openingProds =
                                prodDefs.Where(
                                    o => o.QuoteType == enmQuoteType.Open || o.QuoteType == enmQuoteType.PhoneOnly).ToList();

                            var dtBeginSave = DateTime.Now;

                            foreach (var prodDef in openingProds)
                            {
                                var quotesByProd = quotes.Where(o => o.Id == prodDef.Id).ToList();

                                UpdateRedisTick(redisTickClient, prodDef.Id, dtAyondoNow, quotesByProd, TickSize.OneMinute);
                                UpdateRedisTick(redisTickClient, prodDef.Id, dtAyondoNow, quotesByProd, TickSize.TenMinute);
                                UpdateRedisTick(redisTickClient, prodDef.Id, dtAyondoNow, quotesByProd, TickSize.OneHour);
                            }

                            YJYGlobal.LogLine("\t" + " Ticks " + openingProds.Count + "/" +
                                             quotes.Count + " " + " Time: " +
                                             quotes.Min(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) +
                                             " ~ " +
                                             quotes.Max(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) +
                                             " Saved to Redis " + (DateTime.Now - dtBeginSave).TotalMilliseconds);
                        }
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalTicks);
            }
        }

        private static void UpdateRedisTick(IRedisTypedClient<Tick> redisTickClient, int secId, DateTime dtAyondoNow, IList<Quote> quotes, TickSize tickSize)
        {
            //redis tick list
            var list = redisTickClient.Lists[Ticks.GetTickListNamePrefix(tickSize) + secId];

            if (quotes.Count == 0) //fill in non-changing ticks
            {
                if (list.Count > 0)
                {
                    var last = list[list.Count - 1];

                    //redis last tick is newer
                    if (last.T >= dtAyondoNow)
                    {
                        return;//impossible
                    }

                    //update last tick in redis
                    if (Ticks.IsTickEqual(last.T, dtAyondoNow, tickSize))
                    {
                        //do nothing
                    }
                    else //append new tick with the same price as redis last
                    {
                        list.Add(new Tick() {P = last.P,T=dtAyondoNow});
                    }
                }
            }
            else
            {
                var lastQuote = quotes.OrderByDescending(o => o.Time).First();
                var newTick = new Tick { P = Quotes.GetLastPrice(lastQuote), T = dtAyondoNow };

                if (list.Count == 0) //new products coming
                {
                    list.Add(newTick);
                    return;
                }

                var last = list[list.Count - 1];

                //redis last tick is newer
                if (last.T >= dtAyondoNow)
                {
                    return;//impossible
                }

                //update last tick in redis
                if (Ticks.IsTickEqual(last.T, dtAyondoNow, tickSize))
                {
                    ////last price dominate
                    //list[list.Count - 1] = newTick;

                    //first price dominate
                    //do nothing
                }
                else //append new last tick
                {
                    list.Add(newTick);
                }
            }

            //clear history/prevent data increasing for good
            var clearWhenSize = Ticks.GetClearWhenSize(tickSize);
            var clearToSize = Ticks.GetClearToSize(tickSize);
            if (list.Count > clearWhenSize) //data count at most possible size (in x days )
            {
                YJYGlobal.LogLine("Tick " + tickSize + " " + secId + " Clearing data from " + list.Count + " to " + clearToSize);
                var ticks = list.GetAll();
                var newTicks = ticks.Skip(ticks.Count - clearToSize);
                list.RemoveAll();
                list.AddRange(newTicks);
            }
        }

        private static void SaveKLine(object state)
        {
            while (true)
            {
                try
                {
                    IList<Quote> newQuotes = new List<Quote>();
                    while (!myApp.QueueQuotesForKLine.IsEmpty)
                    {
                        Quote obj;
                        var tryDequeue = myApp.QueueQuotesForKLine.TryDequeue(out obj);
                        newQuotes.Add(obj);
                    }

                    using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                    {
                        var redisProdDefClient = redisClient.As<ProdDef>();
                        var redisKLineClient = redisClient.As<KLine>();

                        var prodDefs = redisProdDefClient.GetAll(); //need to get prod def from redis because we need to get o.LastClose, which does not always have value in myApp.ProdDefs

                        if (newQuotes.Count > 0)
                        {
                            var dtAyondoNow = newQuotes.Max(o => o.Time); //the time of the last message received from Ayondo

                            var dtNow = DateTime.UtcNow;
                            var oneMinuteAgo = dtNow.AddMinutes(-1);

                            var openOrRecentlyClosedProdDefs = prodDefs.Where(o =>
                                (o.QuoteType == enmQuoteType.Open || o.QuoteType == enmQuoteType.PhoneOnly) //is open
                                || (o.QuoteType == enmQuoteType.Closed && o.LastClose > oneMinuteAgo) //recently closed
                                )
                                .ToList();

                            var dtBeginSave = DateTime.Now;

                            foreach (var prodDef in openOrRecentlyClosedProdDefs)
                            {
                                var quotesByProd = newQuotes.Where(o => o.Id == prodDef.Id).ToList();

                                if (prodDef.QuoteType == enmQuoteType.Closed) //recently closed
                                    quotesByProd = quotesByProd.Where(o => o.Time <= prodDef.LastClose.Value).ToList(); //make sure that quotes' time is within prods' opening time

                                UpdateKLine(quotesByProd, redisKLineClient, prodDef, dtAyondoNow, KLineSize.OneMinute);
                                UpdateKLine(quotesByProd, redisKLineClient, prodDef, dtAyondoNow, KLineSize.FiveMinutes);
                                UpdateKLine(quotesByProd, redisKLineClient, prodDef, dtAyondoNow,
                                    KLineSize.FifteenMinutes);
                                UpdateKLine(quotesByProd, redisKLineClient, prodDef, dtAyondoNow, KLineSize.SixtyMinutes);
                                UpdateKLine(quotesByProd, redisKLineClient, prodDef, dtAyondoNow, KLineSize.Day);
                            }

                            YJYGlobal.LogLine("\t\t" + " KLine " + openOrRecentlyClosedProdDefs.Count + "/" +
                                              newQuotes.Count + " " + " Time: " +
                                              newQuotes.Min(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) +
                                              " ~ " +
                                              newQuotes.Max(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND) +
                                              " Saved to Redis " + (DateTime.Now - dtBeginSave).TotalMilliseconds);
                        }
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogException(e);
                }

                Thread.Sleep(_intervalKLine);
            }
        }

        private static void UpdateKLine(List<Quote> quotes, IRedisTypedClient<KLine> redisKLineClient, ProdDef prodDef,
            DateTime dtAyondoNow, KLineSize kLineSize)
        {
            var list = redisKLineClient.Lists[KLines.GetKLineListNamePrefix(kLineSize) + prodDef.Id];

            if (quotes.Count == 0) //no quotes received, then should just fill the non-changing candle
            {
                if (kLineSize != KLineSize.Day) //no need to fill the non-changing candle for day kline
                {
                    if (list.Count != 0)
                    {
                        var last = list[list.Count - 1];

                        var klineTime = KLines.GetKLineTime(dtAyondoNow, kLineSize, prodDef);

                        if (prodDef.QuoteType == enmQuoteType.Closed)
                            klineTime = KLines.GetKLineTime(prodDef.LastClose.Value, kLineSize);

                        if (klineTime > last.T) //a new candle?
                        {
                            //fill the non-changing candle
                            list.Add(new KLine()
                            {
                                T = klineTime,
                                O = last.C,
                                C = last.C,
                                H = last.C,
                                L = last.C,
                            });
                        }
                    }
                }
            }
            else
            {
                var orderedQuotes = quotes.OrderBy(o => o.Time).ToList();

                var firstQuote = orderedQuotes.First();
                var lastQuote = orderedQuotes.Last();

                var klineTime1 = KLines.GetKLineTime(firstQuote.Time, kLineSize, prodDef);
                var klineTime2 = KLines.GetKLineTime(lastQuote.Time, kLineSize, prodDef);

                //var list = redisKLineClient.Lists[KLines.GetKLineListNamePrefix(kLineSize) + prodDef.Id];

                if (klineTime1 != klineTime2 && kLineSize != KLineSize.Day) //quotes range more than 1 candle
                {
                    var list1 = orderedQuotes.Where(o => o.Time < klineTime2).ToList();
                    var list2 = orderedQuotes.Where(o => o.Time >= klineTime2).ToList();

                    var k1 = new KLine()
                    {
                        T = klineTime1,
                        O = Quotes.GetLastPrice(list1.First()),
                        C = Quotes.GetLastPrice(list1.Last()),
                        H = list1.Max(o => Quotes.GetLastPrice(o)),
                        L = list1.Min(o => Quotes.GetLastPrice(o)),
                    };
                    var k2 = new KLine()
                    {
                        T = klineTime2,
                        O = Quotes.GetLastPrice(list2.First()),
                        C = Quotes.GetLastPrice(list2.Last()),
                        H = list2.Max(o => Quotes.GetLastPrice(o)),
                        L = list2.Min(o => Quotes.GetLastPrice(o)),
                    };

                    if (list.Count == 0)
                    {
                        list.Add(k1);
                        list.Add(k2);
                    }
                    else
                    {
                        var last = list[list.Count - 1];

                        if (last.T < klineTime1) //2 new candles to append
                        {
                            list.Add(k1);
                            list.Add(k2);
                        }
                        else if (last.T == klineTime1) //update last 1, append 1 new
                        {
                            list[list.Count - 1] = new KLine()
                            {
                                T = last.T,
                                O = last.O,
                                C = k1.C,
                                H = Math.Max(last.H, k1.H),
                                L = Math.Min(last.L, k1.L),
                            };

                            list.Add(k2);
                        }
                        else
                        {
                            //should not be here
                        }
                    }
                }
                else //quotes range within 1 candle
                {
                    var k = new KLine()
                    {
                        T = klineTime1,
                        O = Quotes.GetLastPrice(firstQuote),
                        C = Quotes.GetLastPrice(lastQuote),
                        H = orderedQuotes.Max(o => Quotes.GetLastPrice(o)),
                        L = orderedQuotes.Min(o => Quotes.GetLastPrice(o)),
                    };

                    if (list.Count == 0)
                    {
                        list.Add(k);
                    }
                    else
                    {
                        var last = list[list.Count - 1];

                        if (last.T < k.T) //append 1 new
                        {
                            list.Add(k);
                        }
                        else if (last.T == k.T) //update last 1
                        {
                            list[list.Count - 1] = new KLine()
                            {
                                T = last.T,
                                O = last.O,
                                C = k.C,
                                H = Math.Max(last.H, k.H),
                                L = Math.Min(last.L, k.L),
                            };
                        }
                        else
                        {
                            //should not be here
                        }
                    }
                }
            }

            //clear history/prevent data increasing for good
            var clearWhenSize = KLines.GetClearWhenSize(kLineSize);
            var clearToSize = KLines.GetClearToSize(kLineSize);
            if (list.Count > clearWhenSize) //data count at most possible size (in x days )
            {
                YJYGlobal.LogLine("KLine " + kLineSize + " " + prodDef.Id + " Clearing data from " + list.Count + " to " +
                                  clearToSize);
                var klines = list.GetAll();
                var newKLines = klines.Skip(klines.Count - clearToSize);
                list.RemoveAll();
                list.AddRange(newKLines);
            }
        }
    }
}