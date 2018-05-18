using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Newtonsoft.Json;
using YJY_COMMON.Util.Extension;
using System.Collections.Concurrent;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;

namespace YJY_API.Controllers.Attributes
{
    public class ApiHitRecorder : ActionFilterAttribute
    {
        private static Timer _timer;
        private static readonly TimeSpan _dbSaveInterval = TimeSpan.FromSeconds(10);

        private static readonly Lazy<ConcurrentQueue<ApiHit>> _apiHitsQueue = new Lazy<ConcurrentQueue<ApiHit>>(() =>
        {
            _timer = new Timer(SaveApiHitsToDB, null, _dbSaveInterval, TimeSpan.FromMilliseconds(-1));

            return new ConcurrentQueue<ApiHit>();
        });

        private static ConcurrentQueue<ApiHit> ApiHitsQueue
        {
            get { return _apiHitsQueue.Value; }
        }

        private static void SaveApiHitsToDB(object state)
        {
            while (true)
            {
                try
                {
                    var apiHits = new List<ApiHit>();
                    while (!ApiHitsQueue.IsEmpty)
                    {
                        ApiHit apiHit;
                        ApiHitsQueue.TryDequeue(out apiHit);
                        apiHits.Add(apiHit);
                    }

                    if (apiHits.Count > 0)
                    {
                        using (var db = YJYHistoryEntities.Create())
                        {
                            //ef extension - BulkInsert
                            //using (var transactionScope = new TransactionScope())
                            //{
                            db.BulkInsert(apiHits);
                            db.SaveChanges();
                            //transactionScope.Complete();
                            //}

                            ////ef - AddRange
                            //db.ApiHits.AddRange(apiHits);
                            //db.SaveChanges();
                        }
                    }
                }
                catch (Exception e)
                {
                    YJYGlobal.LogExceptionAsInfo(e);
                }

                Thread.Sleep(_dbSaveInterval);
            }
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            base.OnActionExecuting(actionContext);

            //record start time
            ((YJYController)actionContext.ControllerContext.Controller).RequestStartAt = DateTime.UtcNow;
        }

        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            base.OnActionExecuted(actionExecutedContext);

            var controller = (YJYController)actionExecutedContext.ActionContext.ControllerContext.Controller;

            var startAt = controller.RequestStartAt;
            var timeSpent = (DateTime.UtcNow - startAt).TotalMilliseconds;

            var httpMethod = actionExecutedContext.Request.Method.Method;

            int? userId;
            try
            {
                userId = controller.UserId;
            }
            catch (Exception)
            {
                userId = null;
            }

            var isException = actionExecutedContext.Exception != null;

            var param = JsonConvert.SerializeObject(actionExecutedContext.ActionContext.ActionArguments);

            string ip = null;
            if (actionExecutedContext.Request.Properties.ContainsKey("MS_HttpContext"))
            {
                var requestBase = ((HttpContextWrapper)actionExecutedContext.Request.Properties["MS_HttpContext"]).Request;
                ip = requestBase.UserHostAddress;
            }

            var httpActionDescriptor = (ReflectedHttpActionDescriptor)actionExecutedContext.ActionContext.ActionDescriptor;
            var methodInfo = httpActionDescriptor.MethodInfo.ToString().Trim('{', '}');
            var methodName = methodInfo.Substring(methodInfo.IndexOf(' ') + 1);
            var controllerName = actionExecutedContext.ActionContext.ControllerContext.Controller.ToString();

            var reqHeader = actionExecutedContext.Request.Headers.Select(o=>o.Key+":"+string.Join(",",o.Value)).Aggregate((o, n) => o + System.Environment.NewLine + n);
            var responseHeader = actionExecutedContext.Response.Content.Headers.Select(o => o.Key + ":" + string.Join(",", o.Value)).Aggregate((o, n) => o + System.Environment.NewLine + n);

            var apiHit = new ApiHit()
            {
                HitAt = startAt,
                HttpMethod = httpMethod.TruncateMax(20),
                ApiName = (controllerName + '.' + methodName).TruncateMax(200),
                Ip = ip,
                IsException = isException,
                Param = param.TruncateMax(1000),
                TimeSpent = timeSpent,
                Url = actionExecutedContext.Request.RequestUri.AbsoluteUri.TruncateMax(200),
                UserId = userId,
                RequestHeader = reqHeader.TruncateMax(1000),
                ResponseHeader = responseHeader.TruncateMax(1000),
            };

            if (apiHit.HttpMethod != "GET")
                apiHit.ResponseContent =
                    actionExecutedContext.Response.Content.ReadAsStringAsync().Result.TruncateMax(1000);

            ////too many spam logs
            //if (apiHit.Url.Contains("api/sendCode"))
            //    return;

            ApiHitsQueue.Enqueue(apiHit);
        }
    }
}