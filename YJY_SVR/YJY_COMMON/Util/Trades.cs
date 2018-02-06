using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Util
{
    public class Trades
    {
        public static decimal CalculatePL(Position p, Quote q)
        {
            return CalculatePL(p, Quotes.GetLastPrice(q));
        }

        public static decimal CalculatePL(Position p, decimal quotePrice)
        {
            decimal upl = p.Side.Value
                ? p.Invest.Value*(quotePrice/p.SettlePrice.Value - 1)
                : p.Invest.Value*(1 - quotePrice/p.SettlePrice.Value);
            upl = upl*p.Leverage.Value;

            //max loss will NOT be greater than invest
            if (upl + p.Invest < 0)
                upl = -p.Invest.Value;

            return upl;
        }
    }
}
