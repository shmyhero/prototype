using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace YJY_COMMON.Model.Queue
{
    [Serializable]
  public  class PosToClose
    {
        public int Id { get; set; }
        public CloseType closeType { get; set; }
        public decimal closePx { get; set; }
        public DateTime closePxTime { get; set; }
    }

    public enum CloseType
    {
        Liquidate,
        Stop,
        Take,
    }
}
