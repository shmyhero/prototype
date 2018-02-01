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

        public decimal? ClosedPrice { get; set; }

        public decimal? StopPx { get; set; }

        public decimal? TakePx { get; set; }
    }
}
