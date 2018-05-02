using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO.FormDTO
{
    public class NewPositionFormDTO
    {
        public int securityId { get; set; }
        public bool isLong { get; set; }
        public decimal invest { get; set; }
        public decimal leverage { get; set; }
    }

    public class NetPositionFormDTO
    {
        public int posId { get; set; }
        public int securityId { get; set; }
    }

    public class StopTakeFormDTO
    {
        public int posId { get; set; }
        public decimal? stopPx { get; set; }
        public decimal? takePx { get; set; }
    }
}