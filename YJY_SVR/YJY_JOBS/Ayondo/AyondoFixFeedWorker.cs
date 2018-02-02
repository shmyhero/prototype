using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
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
        private static Timer _timerTicks;
        private static Timer _timerKLine5m;

        private static AyondoFixFeedApp myApp;

        private static readonly TimeSpan _intervalProdDefs = TimeSpan.FromSeconds(1);
        private static readonly TimeSpan _intervalProdDefRequest = TimeSpan.FromMinutes(60);
        private static readonly TimeSpan _intervalQuotes = TimeSpan.FromMilliseconds(500);
        private static readonly TimeSpan _intervalTicks = TimeSpan.FromMilliseconds(1000);
        private static readonly TimeSpan _intervalKLine = TimeSpan.FromSeconds(10);

        public static void Run(bool isLive = false)
        {
            SessionSettings settings = new SessionSettings(YJYGlobal.GetConfigurationSetting("ayondoFixFeedCfgFilePath"));
            myApp =new AyondoFixFeedApp(YJYGlobal.GetConfigurationSetting( "ayondoFixFeedUsername"),YJYGlobal.GetConfigurationSetting( "ayondoFixFeedPassword"));
            IMessageStoreFactory storeFactory = new MemoryStoreFactory(); //new FileStoreFactory(settings);
            ILogFactory logFactory = new FileLogFactory(settings);
            SocketInitiator initiator = new SocketInitiator(myApp, storeFactory, settings,
                //null 
                logFactory
                );

            //var redisClient = YJYGlobal.BasicRedisClientManager.GetClient();
            //var redisProdDefClient = redisClient.As<ProdDef>();
            //var redisTickClient = redisClient.As<Tick>();

            initiator.Start();

            _timerProdDefs = new Timer(SaveProdDefs, null, _intervalProdDefs, TimeSpan.FromMilliseconds(-1));
            _timerProdDefRequest = new Timer(SendProdDefRequest, null, _intervalProdDefRequest, TimeSpan.FromMilliseconds(-1));
            _timerQuotes = new Timer(SaveQuotes, null, _intervalQuotes, TimeSpan.FromMilliseconds(-1));

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
                        var distinctQuotes = quotes.GroupBy(o => o.Id).Select(o => o.OrderByDescending(p => p.Time).First()).ToList();

                        var dtBeginSave = DateTime.Now;

                        using (var redisClient = YJYGlobal.PooledRedisClientsManager.GetClient())
                        {
                            var redisQuoteClient = redisClient.As<Quote>();
                            redisQuoteClient.StoreAll(distinctQuotes);
                        }

                        YJYGlobal.LogLine("Count: " + distinctQuotes.Count + "/" + quotes.Count + " (distinct/raw) "
                                          + " Time: " + quotes.Min(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND)
                                          + " ~ " + quotes.Max(o => o.Time).ToString(YJYGlobal.DATETIME_MASK_MILLI_SECOND)
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

                            //var fxToFollow = "EURUSD";

                            //var fxOld = listOld.FirstOrDefault(o => o.Symbol == fxToFollow && !o.Name.EndsWith(" Outright"));
                            //var fxOldNotClosed = fxOld.QuoteType != enmQuoteType.Closed;
                            //var fxOldNotOpen = fxOld.QuoteType != enmQuoteType.Open && fxOld.QuoteType != enmQuoteType.PhoneOnly;

                            IList<ProdDef> listToSave = new List<ProdDef>();
                            //var listToSaveAsQuote = new List<ProdDef>();

                            foreach (var newProdDef in listNew)
                            {
                                var old = listOld.FirstOrDefault(o => o.Id == newProdDef.Id);

                                if (old != null) //updating prod def in redis
                                {
                                    //update open/close time/price depending on state change
                                    if (old.QuoteType != enmQuoteType.Closed && newProdDef.QuoteType == enmQuoteType.Closed) //xxx -> close
                                    {
                                        YJYGlobal.LogLine("PROD CLOSED " + newProdDef.Id + " time: " + newProdDef.Time + " offer: " + newProdDef.Offer + " bid: " + newProdDef.Bid);

                                        //if (old.AssetClass == "Currencies" && old.Symbol.StartsWith("XBT"))
                                        //{
                                        //    //for bitcoin products, Open/Close change with EURGBP
                                        //}
                                        //else
                                        //{
                                            //close time
                                            old.LastClose = newProdDef.Time;
                                        //}

                                        ////prod def will be treated as a new QUOTE when stock open/close
                                        //listToSaveAsQuote.Add(newProdDef);
                                    }
                                    else if (old.QuoteType != enmQuoteType.Open && old.QuoteType != enmQuoteType.PhoneOnly &&
                                             (newProdDef.QuoteType == enmQuoteType.Open || newProdDef.QuoteType == enmQuoteType.PhoneOnly)) //xxx -> open/phone
                                    {
                                        YJYGlobal.LogLine("PROD OPENED " + newProdDef.Id + " time: " + newProdDef.Time + " offer: " + newProdDef.Offer + " bid: " +
                                                          newProdDef.Bid);

                                        //if (old.AssetClass == "Currencies" && old.Symbol.StartsWith("XBT"))
                                        //{
                                        //    //for bitcoin products, Open/Close change with EURGBP
                                        //}
                                        //else
                                        //{
                                            //open time
                                            old.LastOpen = newProdDef.Time;

                                            //open prices
                                            old.OpenAsk = newProdDef.Offer;
                                            old.OpenBid = newProdDef.Bid;

                                            //preclose
                                            old.PreClose = Quotes.GetClosePrice(newProdDef) ??
                                                           //when close ask/bid is null, get from ask/bid
                                                           Quotes.GetLastPrice(newProdDef);
                                        //}

                                        ////prod def will be treated as a new QUOTE when stock open/close
                                        //listToSaveAsQuote.Add(newProdDef);
                                    }

                                    //update fields
                                    old.Time = newProdDef.Time;
                                    old.QuoteType = newProdDef.QuoteType;
                                    old.Name = newProdDef.Name;
                                    old.Symbol = newProdDef.Symbol;
                                    old.AssetClass = newProdDef.AssetClass;
                                    old.Bid = newProdDef.Bid;
                                    old.Offer = newProdDef.Offer;

                                    //if (old.AssetClass == "Currencies" && old.Symbol.StartsWith("XBT"))
                                    //{
                                    //    //for bitcoin products, Open/Close change with EURGBP
                                    //}
                                    //else
                                    //{
                                        old.CloseBid = newProdDef.CloseBid;
                                        old.CloseAsk = newProdDef.CloseAsk;
                                    //}

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

                            //-------------------when EURGBP changes status, set bitcoin products' LastOpen/LastClose----------------------------
                            //var fxNew = listToSave.FirstOrDefault(o => o.Symbol == fxToFollow && !o.Name.EndsWith(" Outright"));

                            //if (fxNew != null)
                            //{
                            //    if (fxOldNotClosed && fxNew.QuoteType == enmQuoteType.Closed) //xxx -> close
                            //    {
                            //        YJYGlobal.LogLine(fxToFollow + " CLOSED - changing bitcoins infos...");

                            //        var prodDefs = redisProdDefClient.GetAll();

                            //        var bitcoins = prodDefs.Where(
                            //        o => o.AssetClass == "Currencies" && o.Symbol.StartsWith("XBT"))
                            //        .ToList();

                            //        var redisQuoteClient = redisClient.As<Quote>();

                            //        foreach (var bitcoin in bitcoins)
                            //        {
                            //            bitcoin.LastClose = fxNew.Time;

                            //            var bcQuote = redisQuoteClient.GetById(bitcoin.Id);
                            //            if (bcQuote != null)
                            //            {
                            //                bitcoin.CloseAsk = bcQuote.Ask;
                            //                bitcoin.CloseBid = bcQuote.Bid;
                            //            }
                            //        }

                            //        redisProdDefClient.StoreAll(bitcoins);
                            //    }
                            //    else if (fxOldNotOpen &&
                            //             (fxNew.QuoteType == enmQuoteType.Open || fxNew.QuoteType == enmQuoteType.PhoneOnly)) //xxx -> open/phone
                            //    {
                            //        YJYGlobal.LogLine(fxToFollow + " OPENED - changing bitcoins infos...");

                            //        var prodDefs = redisProdDefClient.GetAll();

                            //        var bitcoins = prodDefs.Where(
                            //        o => o.AssetClass == "Currencies" && o.Symbol.StartsWith("XBT"))
                            //        .ToList();

                            //        var redisQuoteClient = redisClient.As<Quote>();

                            //        foreach (var bitcoin in bitcoins)
                            //        {
                            //            bitcoin.LastOpen = fxNew.Time;

                            //            var bcQuote = redisQuoteClient.GetById(bitcoin.Id);
                            //            if (bcQuote != null)
                            //            {
                            //                bitcoin.OpenAsk = bcQuote.Ask;
                            //                bitcoin.OpenBid = bcQuote.Bid;
                            //            }

                            //            bitcoin.PreClose = Quotes.GetClosePrice(bitcoin);
                            //        }

                            //        redisProdDefClient.StoreAll(bitcoins);
                            //    }
                            //}
                            //-------------------------------------------------------------------------------------------------------------------------
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
    }
}
