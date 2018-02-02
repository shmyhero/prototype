using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.DesignPatterns.Model;

namespace YJY_COMMON.Model.Cache
{
    public class Quote : IHasIntId
    {
        /// <summary>
        /// security id
        /// </summary>
        public int Id { get; set; }

        public decimal Bid { get; set; }
        public decimal Ask { get; set; }

        public DateTime Time { get; set; }

        //        public int 
    }
}
