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
            decimal upl = p.Side.Value ? p.Invest.Value * (Quotes.GetLastPrice(q) / p.SettlePrice.Value - 1) : p.Invest.Value * (1 - Quotes.GetLastPrice(q) / p.SettlePrice.Value);
            return upl;
        }
    }
}
