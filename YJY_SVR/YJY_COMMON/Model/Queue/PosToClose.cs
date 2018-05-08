using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YJY_COMMON.Model.Entity;

namespace YJY_COMMON.Model.Queue
{
    [Serializable]
  public  class PosToClose
    {
        public int Id { get; set; }
        public PositionCloseType closeType { get; set; }
        public decimal closePx { get; set; }
        public DateTime closePxTime { get; set; }
    }
}
