using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

namespace YJY_COMMON.SMS
{
    public class YunPianSMS
    {
        private const string BASE_URI = "http://yunpian.com";
        private const string VERSION = "v1";
        private const string URI_GET_USER_INFO = BASE_URI + "/" + VERSION + "/user/get.json";
        private const string URI_SEND_SMS = BASE_URI + "/" + VERSION + "/sms/send.json";
        private const string URI_TPL_SEND_SMS = BASE_URI + "/" + VERSION + "/sms/tpl_send.json";

        private const string API_KEY = "faf57dcccf1bff886c1ee4626bf1db28";
        private const string TEMPLATE_ID = "1392151";

    
        //public static string GetUserInfo()
        //{
        //    var req = WebRequest.Create(URI_GET_USER_INFO + "?apikey=" + ApiKey);
        //    var resp = req.GetResponse();
        //    var sr = new StreamReader(resp.GetResponseStream());
        //    return sr.ReadToEnd().Trim();
        //}

        public static string SendSms(string text, string mobile)
        {
            var parameter = "apikey=" + API_KEY + "&text=" + text + "&mobile=" + mobile;
            var req = WebRequest.Create(URI_SEND_SMS);
            req.ContentType = "application/x-www-form-urlencoded";
            req.Method = "POST";
            var bytes = Encoding.UTF8.GetBytes(parameter);
            req.ContentLength = bytes.Length;
            var os = req.GetRequestStream();
            os.Write(bytes, 0, bytes.Length);
            os.Close();
            var resp = req.GetResponse();
            var sr = new StreamReader(resp.GetResponseStream());
            return sr.ReadToEnd().Trim();
        }

        public static string TplSendCodeSms(string tplValue, string mobile)
        {
            var encodedTplValue = Uri.EscapeDataString(tplValue);
            var parameter = "apikey=" + API_KEY + "&tpl_id=" + TEMPLATE_ID + "&tpl_value=" + encodedTplValue + "&mobile=" +
                            mobile;
            var req = WebRequest.Create(URI_TPL_SEND_SMS);
            req.ContentType = "application/x-www-form-urlencoded";
            req.Method = "POST";
            var bytes = Encoding.UTF8.GetBytes(parameter);
            req.ContentLength = bytes.Length;
            var os = req.GetRequestStream();
            os.Write(bytes, 0, bytes.Length);
            os.Close();
            var resp = req.GetResponse();
            var sr = new StreamReader(resp.GetResponseStream());
            return sr.ReadToEnd().Trim();
        }
    }
}
