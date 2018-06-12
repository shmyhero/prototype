using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using YJY_COMMON;
using YJY_COMMON.Model.Context;

namespace YJY_API.SignalR
{
    [HubName("M")]
    //[QueryStringAuthorize]
    public class MessageHub : Microsoft.AspNet.SignalR.Hub
    {
        private readonly MessageTicker _ticker;
        //private YJYEntities _db;

        public MessageHub() : this(MessageTicker.Instance)
        {
        }

        public MessageHub(MessageTicker ticker)
        {
            _ticker = ticker;

            //var id = Context.ConnectionId;

            //var s = HttpContext.Current.User.Identity.Name;
            //var user = Context.User;
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            //var auth = Context.QueryString["auth"];
            //var userId = auth.Substring(0, auth.IndexOf('_'));

            ////leave group
            //Groups.Remove(Context.ConnectionId, Context.ConnectionId);

            //clear quote subscription
            _ticker.RemoveUser(Context.ConnectionId);

            return base.OnDisconnected(stopCalled);
        }

        //private int? userId = null;

        //[HubMethodName("S")]
        //public void Subscribe(string strSecurityIds)
        //{
        //    //var auth = Context.QueryString["auth"];
        //    //var userId = auth.Substring(0, auth.IndexOf('_'));

        //    ////join group
        //    //Groups.Add(Context.ConnectionId, Context.ConnectionId);// single-user group

        //    //add quote subscription
        //    var secIds = strSecurityIds.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(o => Convert.ToInt32(o)).Distinct().ToList();

        //    _ticker.AddSubscription(Context.ConnectionId, secIds);
        //}

        [HubMethodName("L")]
        public void Login(string auth)
        {
            int userId = 0;
            string token = null;

            try
            {
                var split = auth.Split('_');
                userId = Convert.ToInt32(split[0]);
                token = split[1];
            }
            catch (Exception ex)
            {
                //this.Context.User.Identity.IsAuthenticated = false;
                
                YJYGlobal.LogInformation("signalR MessageHub invalid auth: " + auth);
            }


            bool isUserExist;
            using (var db = YJYEntities.Create())
            {
                //var s = HttpContext.Current.User.Identity.Name;
                //var name = Context.User.Identity.Name;

                //HttpContext.Current.User = new GenericPrincipal(new GenericIdentity(userId.ToString()), null);

                // Get the request lifetime scope so you can resolve services.
                //var requestScope =  HttpContext.Current.Request.GetDependencyScope();

                //// Resolve the service you want to use.
                //var db = requestScope.GetService(typeof(YJYEntities)) as YJYEntities;

                //var httpContextBase = Context.Request.GetHttpContext();
                //var request = Context.Request;
                //var nameValueCollection = request.Headers;

                //var db = YJYEntities.Create();

                isUserExist = db.Users.Any(o => o.Id == userId && o.AuthToken == token);
            }

            //if (!isUserExist)
            //    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);

            if (isUserExist)
                _ticker.AddAuthUser(Context.ConnectionId, userId);
            else
            {
                YJYGlobal.LogInformation("signalR MessageHub wrong auth: " + auth);
            }
        }

        //public void Broadcast()
        //{

        //}

        //public IEnumerable<QuoteFeed> GetAllStocks()
        //{
        //    return new List<QuoteFeed>(){new QuoteFeed(){Id=1,last=1.22354m}};
        //}
    }
}