using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.Storage;
using ServiceStack.Redis;

namespace YJY_COMMON
{
    public class YJYGlobal
    {
        //public const string CULTURE_CN = "zh-CN";
        //public const string CULTURE_EN = "en";
        public const string DATETIME_MASK_MILLI_SECOND = "yyyy-MM-dd HH:mm:ss.fff";
        public const string DATETIME_MASK_SECOND = "yyyy-MM-dd HH:mm:ss";

        public const int DEFAULT_PAGE_SIZE = 50;
        
        public static TimeSpan PROD_DEF_ACTIVE_IF_TIME_NOT_OLDER_THAN_TS = TimeSpan.FromDays(14);
        public const string ASSET_CLASS_STOCK = "Single Stocks";
        public const string ASSET_CLASS_FX = "Currencies";
        public const string ASSET_CLASS_CRYPTO_FX = "Cryptocurrencies";
        public const string ASSET_CLASS_INDEX = "Stock Indices";
        public const string ASSET_CLASS_COMMODITY = "Commodities";

        public const string THT_COMPANY_ADDRESS = "0xa6b52d348bff523a22c17639967ad8f8409f136f";

        public const string CALLBACK_AUTH_TOKEN = "jR7cB9s6n2I0C4zP1xZ6b92Mki0Q3Ae7G1L3vU5hoT8xD5Fy3Ux9bR1wO5Hb7ec4HJ6Es2oC";

        public const decimal NEW_USER_INIT_BALANCE = 100000;
        public const decimal NEW_USER_INIT_BALANCE_ETH = 100;
        public const decimal BALANCE_TO_TOKEN_RATIO = 1;

        /// <summary>
        /// the default application-wide PooledRedisClientsManager
        /// </summary>
        public static IRedisClientsManager PooledRedisClientsManager;

        public const string THT_BC_API_HOST= "http://139.217.205.9:9527/";

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

        public static void LogError(string message)
        {
            Trace.TraceError(GetLogDatetimePrefix() + message);
        }
        public static void LogWarning(string message)
        {
            Trace.TraceWarning(GetLogDatetimePrefix() + message);
        }
        public static void LogInformation(string message)
        {
            Trace.TraceInformation(GetLogDatetimePrefix() + message);
        }

        public static void LogLine(string message)
        {
            Trace.WriteLine(GetLogDatetimePrefix() + message);
        }

        public static void LogException(Exception exception)
        {
            var ex = exception;
            while (ex != null)
            {
                Trace.WriteLine(GetLogDatetimePrefix() + ex.Message);
                Trace.WriteLine(GetLogDatetimePrefix() + ex.StackTrace);

                ex = ex.InnerException;
            }

            //if (exception is FaultException<ExceptionDetail>)
            //{
            //    var detail = ((FaultException<ExceptionDetail>)exception).Detail;

            //    var d = detail;
            //    while (d != null)
            //    {
            //        Trace.WriteLine(GetLogDatetimePrefix() + d.Message);
            //        Trace.WriteLine(GetLogDatetimePrefix() + d.StackTrace);

            //        d = d.InnerException;
            //    }
            //}
        }

        public static void LogExceptionAsInfo(Exception exception)
        {
            var ex = exception;
            while (ex != null)
            {
                Trace.TraceInformation(GetLogDatetimePrefix() + ex.Message);
                Trace.TraceInformation(GetLogDatetimePrefix() + ex.StackTrace);

                ex = ex.InnerException;
            }

            //if (exception is FaultException<ExceptionDetail>)
            //{
            //    var detail = ((FaultException<ExceptionDetail>)exception).Detail;

            //    var d = detail;
            //    while (d != null)
            //    {
            //        Trace.TraceInformation(GetLogDatetimePrefix() + d.Message);
            //        Trace.TraceInformation(GetLogDatetimePrefix() + d.StackTrace);

            //        d = d.InnerException;
            //    }
            //}
        }

        public static void LogExceptionAsWarning(Exception exception)
        {
            var ex = exception;
            while (ex != null)
            {
                Trace.TraceWarning(GetLogDatetimePrefix() + ex.Message);
                Trace.TraceWarning(GetLogDatetimePrefix() + ex.StackTrace);

                ex = ex.InnerException;
            }

            //if (exception is FaultException<ExceptionDetail>)
            //{
            //    var detail = ((FaultException<ExceptionDetail>)exception).Detail;

            //    var d = detail;
            //    while (d != null)
            //    {
            //        Trace.TraceWarning(GetLogDatetimePrefix() + d.Message);
            //        Trace.TraceWarning(GetLogDatetimePrefix() + d.StackTrace);

            //        d = d.InnerException;
            //    }
            //}
        }

        private static string GetLogDatetimePrefix()
        {
            return DateTime.Now.ToString(DATETIME_MASK_MILLI_SECOND) + " ";
        }
    }
}
