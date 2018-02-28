using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YJY_COMMON.Model.Cache;

namespace YJY_SVR.DTO
{
    /// <summary>
    /// todo: for test use only
    /// </summary>
    public class ProdDefDTO : ProdDef
    {
        public string cname { get; set; }
        public decimal? minValueLong { get; set; }
        public decimal? minValueShort { get; set; }
        public decimal? maxValueLong { get; set; }
        public decimal? maxValueShort { get; set; }
    }

    public class SecurityBaseDTO
    {
        public int id { get; set; }
        public string name { get; set; }
    }

    public class SecurityDTO: SecurityBaseDTO
    {
        public string symbol { get; set; }
        //public string picUrl { get; set; }
        public string tag { get; set; }

        public decimal? preClose { get; set; }
        public decimal? open { get; set; }
        public decimal? last { get; set; }

        public bool? isOpen { get; set; }
        public int? status { get; set; }

        public string eName { get; set; }
    }

    public class SecurityDetailDTO : SecurityDTO
    {
        public int? dcmCount { get; set; }

        public DateTime? lastOpen { get; set; }
        public DateTime? lastClose { get; set; }

        public decimal? maxLeverage { get; set; }

        public decimal? gsmd { get; set; }

        public List<int> levList { get; set; }

        public string assetClass { get; set; }
    }
}