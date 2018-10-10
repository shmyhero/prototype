using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace YJY_COMMON.Model.Entity
{
    /// <summary>
    /// 用户杠杆表
    /// </summary>
    [Table("UserLeverage")]
    public class UserLeverage
    {
        public int Id { get; set; }

        /// <summary>
        /// ID为0
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 1模拟，2实盘
        /// </summary>
        public int BalanceType { get; set; }

        /// <summary>
        /// 杠杆，以分号分隔
        /// </summary>
        public string Leverage { get; set; }
    }
}
