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
}