namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("UserTradeFollow")]
    public partial class UserTradeFollow
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int FollowingId { get; set; }

        public DateTime? CreateAt { get; set; }

        public DateTime? UpdateAt { get; set; }

        public decimal? InvestFixed { get; set; }

        public decimal? InvestRatio { get; set; }

        public int? StopAfterCount { get; set; }

        public DateTime? StopUntil { get; set; }

        public DateTime? LastTriggerAt { get; set; }
    }
}
