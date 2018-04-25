namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("THTWithdrawal")]
    public partial class THTWithdrawal
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        [StringLength(100)]
        public string To { get; set; }

        public DateTime? CreateAt { get; set; }

        public int? Value { get; set; }

        public DateTime? SendAt { get; set; }

        [StringLength(500)]
        public string SendResult { get; set; }

        public DateTime? CallbackAt { get; set; }

        public int? CallbackValue { get; set; }

        [StringLength(100)]
        public string CallbackTo { get; set; }

        public DateTime? CancelAt { get; set; }

        public int? CancelRefundValue { get; set; }
    }
}