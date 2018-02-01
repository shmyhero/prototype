using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure;
using Microsoft.WindowsAzure.ServiceRuntime;
using ServiceStack.Redis;

namespace YJY_COMMON
{
    public class YJYGlobal
    {
        /// <summary>
        /// the default application-wide PooledRedisClientsManager
        /// </summary>
        public static IRedisClientsManager PooledRedisClientsManager;

        static YJYGlobal()
        {
            PooledRedisClientsManager = GetNewPooledRedisClientManager();
        }

        private static IRedisClientsManager GetNewPooledRedisClientManager()
        {
            var redisConStr = YJYGlobal.GetConfigurationSetting("redisConnectionString");

            if (redisConStr == null) return null;

            return new PooledRedisClientManager(100, 2, redisConStr);
        }

        public static string GetConfigurationSetting(string key)
        {
            if (RoleEnvironment.IsAvailable)
            {
                ////throw exception if not exist
                //return RoleEnvironment.GetConfigurationSettingValue(key);

                string value = null;
                try
                {
                    value = CloudConfigurationManager.GetSetting(key);
                }
                catch (Exception e)
                {
                }

                //if there's no cloud config, return local config
                return value ?? ConfigurationManager.AppSettings[key];
            }
            else
            {
                return ConfigurationManager.AppSettings[key];
            }
        }

        public static string GetDbConnectionString(string connectStringName)
        {
            if (RoleEnvironment.IsAvailable)
            {
                string value = null;
                try
                {
                    value = RoleEnvironment.GetConfigurationSettingValue(connectStringName);
                }
                catch (Exception e)
                {
                }

                //if there's no cloud config, return local config
                return value ?? ConfigurationManager.ConnectionStrings[connectStringName].ConnectionString;
            }
            else
            {
                return ConfigurationManager.ConnectionStrings[connectStringName].ConnectionString;
            }
        }
    }
}
