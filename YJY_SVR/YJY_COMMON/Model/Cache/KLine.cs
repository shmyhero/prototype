using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Model.Cache
{
    public class KLine
    {
        /// <summary>
        /// open
        /// </summary>
        public decimal O { get; set; }
        /// <summary>
        /// close
        /// </summary>
        public decimal C { get; set; }
        /// <summary>
        /// high
        /// </summary>
        public decimal H { get; set; }
        /// <summary>
        /// low
        /// </summary>
        public decimal L { get; set; }

        /// <summary>
        /// time
        /// </summary>
        public DateTime T { get; set; }
    }
}
