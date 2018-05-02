using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.Caching
{
    public class WebCache
    {
        private static readonly Lazy<WebCacheInstance> _instance=
            new Lazy<WebCacheInstance>(() => new WebCacheInstance());

        public static WebCacheInstance Instance
        {
            get { return _instance.Value; }
        }
    }
}