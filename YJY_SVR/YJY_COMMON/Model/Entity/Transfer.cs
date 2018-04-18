namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Transfer")]
    public partial class Transfer
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        [StringLength(50)]
        public string Type { get; set; }

        public DateTime? Time { get; set; }

        public decimal? Amount { get; set; }

        public decimal? BalanceAfter { get; set; }

        public int? PositionId { get; set; }

        public int? TransactionId { get; set; }
    }
}
