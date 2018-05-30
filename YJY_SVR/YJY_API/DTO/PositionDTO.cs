using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class PositionBaseDTO
    {
        public int id { get; set; }

        public decimal? invest { get; set; }
        public decimal? leverage { get; set; }
        public bool? isLong { get; set; }

        public decimal? roi { get; set; }
        public decimal? pl { get; set; }
        public decimal? upl { get; set; }

        public DateTime? createAt { get; set; }
        public DateTime? closedAt { get; set; }

        public SecurityBaseDTO security { get; set; }
    }

    public class PositionDTO: PositionBaseDTO
    {
       
        //public int secId { get; set; }
        //public string symbol { get; set; }
        //public string name { get; set; }
        //public SecurityDetailDTO security { get; set; }

        public decimal settlePrice { get; set; }

        //public DateTime createAt { get; set; }

        public decimal? stopPx { get; set; }
        public decimal? takePx { get; set; }

        //public DateTime? closedAt { get; set; }
        public decimal? closePrice { get; set; }

        public UserBaseDTO followUser { get; set; }
    }
}