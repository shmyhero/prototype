using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using YJY_API.Controllers.Attributes;

namespace YJY_API
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);

            WebApiConfig.ConfigureJSONFormatter(GlobalConfiguration.Configuration);
            WebApiConfig.ConfigureDependencyResolver(GlobalConfiguration.Configuration);

            GlobalConfiguration.Configuration.Filters.Add(new ApiHitRecorder());

            GlobalConfiguration.Configuration.MessageHandlers.Add(new CultureHandler());
        }
    }
}
