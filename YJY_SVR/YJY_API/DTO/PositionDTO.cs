﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_SVR.DTO
{
    public class PositionDTO
    {
        public int id { get; set; }

        //public int secId { get; set; }
        //public string symbol { get; set; }
        //public string name { get; set; }
        public SecurityDetailDTO security { get; set; }

        public decimal invest { get; set; }
        public bool isLong { get; set; }
        public decimal leverage { get; set; }
        public decimal settlePrice { get; set; }

        public decimal? pl { get; set; }
        public decimal? upl { get; set; }
        public DateTime createAt { get; set; }

        public decimal? stopPx { get; set; }
        public decimal? takePx { get; set; }
    }
}