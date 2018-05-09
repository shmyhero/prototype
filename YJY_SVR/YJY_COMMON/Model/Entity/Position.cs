namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Position")]
    public partial class Position
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public int? SecurityId { get; set; }

        public decimal? SettlePrice { get; set; }

        public DateTime? CreateTime { get; set; }

        public bool? Side { get; set; }

        public decimal? Invest { get; set; }

        public decimal? Leverage { get; set; }

        public DateTime? ClosedAt { get; set; }

        public decimal? PL { get; set; }

        public decimal? ClosePrice { get; set; }

        public decimal? StopPx { get; set; }

        public DateTime? StopSetAt { get; set; }

        public decimal? TakePx { get; set; }

        public DateTime? TakeSetAt { get; set; }

        [StringLength(20)]
        public string CloseType { get; set; }

        public DateTime? ClosePriceTime { get; set; }

        public int? FollowPosId { get; set; }

        public int? FollowUserId { get; set; }
    }

    public enum PositionCloseType
    {
        Liquidate,
        Stop,
        Take,
        Follow,
    }
}
