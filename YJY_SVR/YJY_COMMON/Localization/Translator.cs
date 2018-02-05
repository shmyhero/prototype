using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace YJY_COMMON.Localization
{
    public class Translator
    {
        public static string Translate(TransKey transKey)
        {
            if (Translations.Values.ContainsKey(transKey))
                return Translations.Values[transKey];
            else
                return transKey.ToString();
        }

        public static string GetProductNameByThreadCulture(string name)
        {
            var str = RemoveENameSuffix(name);

            if (Thread.CurrentThread.CurrentUICulture.Name == YJYGlobal.CULTURE_EN)
                return str;

            var lower = str.ToLower();

            //if (lower.StartsWith("china 50 "))
            //    return "新华富时A50";
            //return str.Replace("China 50 ","新华富时A50 ");
            //if (lower.StartsWith("japan 225 "))
            //    return "日经225";
            //return str.Replace("Japan 225 ", "日经225 ");

            if (Translations.ProdCNames.ContainsKey(lower))
                return Translations.ProdCNames[lower];
            else
                return str;
            //var strLower = str.ToLower();
            //var first = Translations.ProdCNamesList.FirstOrDefault(o => o.Key.ToLower() == strLower);
            //if (first.Key != null)
            //    return first.Value;
            //else
            //    return str;
        }

        public static string RemoveENameSuffix(string name)
        {
            return name.Replace(" CFD", string.Empty)
                .Replace(" TradeHero", string.Empty)
                .Replace(" Mini", string.Empty)
                .Replace(" Outright", string.Empty)
                .Replace(" Spot", string.Empty);//;
        }
    }
}
