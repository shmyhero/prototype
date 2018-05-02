using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class TradeStyleDTO
    {
        public decimal winRate { get; set; }
        public int posCount { get; set; }

        public decimal avgInv { get; set; }
        public decimal avgLev { get; set; }
        public decimal avgPl { get; set; }
        public decimal avgDur { get; set; }
}

    public class PosChartDTO
    {
        public DateTime date { get; set; }
        public decimal pl { get; set; }
    }

    public class PLSpreadDTO
    {
        /// <summary>
        /// 商品名
        /// </summary>
        public string name { get; set; }
        public string symbol { get; set; }
        /// <summary>
        /// 交易笔数
        /// </summary>
        public int count { get; set; }
        /// <summary>
        /// 平均盈利
        /// </summary>
        public decimal pl { get; set; }
        /// <summary>
        /// 胜率
        /// </summary>
        public decimal rate { get; set; }
    }
}