using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace YJY_COMMON.Model.Entity
{
    /// <summary>
    /// 产品杠杆表
    /// </summary>
    [Table("SecurityLeverage")]
    public class SecurityLeverage
    {
        public int Id { get; set; }

        /// <summary>
        /// 产品Id
        /// </summary>
        public int SecurityId { get; set; }        

        public int BalanceType { get; set; }

        /// <summary>
        /// 杠杆，以分号分隔
        /// </summary>
        public string Leverage { get; set; }
    }
}
