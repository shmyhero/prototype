using System;

namespace YJY_JOBS.SignalR
{
    public class QuoteFeed
    {
        public int id { get; set; }
        public decimal last { get; set; }

        //public decimal bid { get; set; }
        //public decimal ask { get; set; }

        public DateTime time { get; set; }
    }
}
