namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ETHDeposit")]
    public partial class ETHDeposit
    {
        public int Id { get; set; }

        [StringLength(100)]
        public string TransHash { get; set; }

        [StringLength(100)]
        public string From { get; set; }

        [StringLength(100)]
        public string To { get; set; }

        [StringLength(100)]
        public string TokenAmount { get; set; }

        public DateTime? CreateAt { get; set; }

        public int? PaidToUserId { get; set; }

        public decimal? PaidAmount { get; set; }

        public DateTime? PaidAt { get; set; }
    }
}
