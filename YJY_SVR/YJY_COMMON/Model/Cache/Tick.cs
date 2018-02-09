using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Model.Cache
{
    public class Tick //: IHasIntId
    {
        ///// <summary>
        ///// security id
        ///// </summary>
        //public int Id { get; set; }

        /// <summary>
        /// price
        /// </summary>
        public decimal P { get; set; }

        //time
        public DateTime T { get; set; }
    }
}
