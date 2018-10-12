using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace YJY_COMMON.Model.Entity
{
    [Table("Refund")]
    public class Refund
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        /// <summary>
        /// 申请提现金额
        /// </summary>
        public decimal Amount { get; set; }

        //付款二维码
        public string QRCode { get; set; }

        /// <summary>
        /// 0，未支付
        /// 1，已支付
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// 实际支付金额
        /// </summary>
        public decimal? PayAmount { get; set; }

        /// <summary>
        /// 出金支付时间
        /// </summary>
        public DateTime? PayAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
