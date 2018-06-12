using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using YJY_COMMON;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Util;
using YJY_API.Caching;
using YJY_API.DTO.SignalRDTO;
using YJY_COMMON.Model.Context;

namespace YJY_API.SignalR
{
    public class MessageTicker
    {
        // Singleton instance
        private static readonly Lazy<MessageTicker> _instance =
            new Lazy<MessageTicker>(() => new MessageTicker(GlobalHost.ConnectionManager.GetHubContext<MessageHub>().Clients));

        public static MessageTicker Instance
        {
            get { return _instance.Value; }
        }

        private readonly ConcurrentDictionary<string, int> _subscription = new ConcurrentDictionary<string, int>();

        private readonly TimeSpan _updateInterval = TimeSpan.FromMilliseconds(1000);

        private readonly Timer _timer;

        private IHubConnectionContext<dynamic> Clients { get; set; }

        private YJYEntities _db;

        private MessageTicker(IHubConnectionContext<dynamic> clients)
        {
            Clients = clients;

            _db=YJYEntities.Create();

            YJYGlobal.LogLine("Starting MessageTicker...");

            _timer = new Timer(Start, null, _updateInterval, TimeSpan.FromMilliseconds(-1));
        }

        private void Start(object state)
        {
            //DateTime dtLastBegin;
            DateTime lastMsgTime = DateTime.UtcNow.AddMinutes(-10);
            while (true)
            {
                //dtLastBegin = DateTime.Now;

                if (_subscription.Count > 0)
                {
                    try
                    {
                        var userIds = _subscription.Select(o => o.Value).Distinct().ToList();
                        var messages = _db.Messages.Where(o => userIds.Contains(o.UserId.Value) && o.ReadAt == null && o.CreateAt > lastMsgTime).ToList();

                        if (messages.Count > 0)
                        {
                            lastMsgTime = messages.Max(o => o.CreateAt.Value);

                            //YJYGlobal.LogLine("Broadcasting to " + _subscription.Count +" subscriber...");
                            foreach (var pair in _subscription)
                            {
                                var connectionId = pair.Key;
                                var userId = pair.Value;
                                var userMessages = messages.Where(o => o.UserId == userId);

                                if (userMessages.Any())
                                {
                                    //Clients.Group(userId)
                                    Clients.Client(connectionId)
                                        .p(userMessages.Select(o => new MessagePush()
                                        {
                                            msgId = o.Id,
                                            posId = o.PosId,
                                        }));
                                }
                            }
                        }
                    }
                    catch (Exception)
                    {

                    }
                }

                //var workTime = DateTime.Now - dtLastBegin;

                ////broadcast prices every second
                //var sleepTime = _updateInterval > workTime ? _updateInterval - workTime : TimeSpan.Zero;

                Thread.Sleep(_updateInterval);
            }
        }

        public void AddAuthUser(string connectionId, int userId)
        {
            _subscription.AddOrUpdate(connectionId, userId, (key, value) => userId);
        }

        public void RemoveUser(string connectionId)
        {
            int value;

            _subscription.TryRemove(connectionId, out value);
        }

        //public int GetSubscriptionCount(bool isLive = false)
        //{
        //    return _subscription.Count;
        //}

        //public void Login(string connectionId, int userId, string token)
        //{
        //    throw new NotImplementedException();
        //}
    }
}