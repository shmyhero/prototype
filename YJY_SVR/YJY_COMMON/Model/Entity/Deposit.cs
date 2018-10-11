using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace YJY_COMMON.Model.Entity
{
    [Table("Deposit")]
    public class Deposit
    {
        public int Id { get; set; }

        public string OrderNum { get; set; }

        public int UserId { get; set; }

        /// <summary>
        /// 订单金额
        /// </summary>
        public decimal Amount { get; set; }

        /// <summary>
        /// 收到的支付金额
        /// </summary>
        public decimal ReceivedAmount { get; set; }

        /// <summary>
        /// 0，未支付
        /// 1，已支付未充值
        /// 2，已充值
        /// </summary>
        public int Status { get; set; }

        public DateTime? PayAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }

    public enum DepositStatus
    {
        /// <summary>
        /// 订单未支付
        /// </summary>
        Unpaid = 0,
        /// <summary>
        /// 订单已支付，但未给客户充值
        /// </summary>
        PaidNotCharge = 1,
        /// <summary>
        /// 已充值
        /// </summary>
        Charged = 2
    }
}
