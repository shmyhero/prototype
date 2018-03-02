namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Status
    {
        public int Id { get; set; }

        public int? UserId { get; set; }

        public DateTime? Time { get; set; }

        [StringLength(1000)]
        public string Text { get; set; }
    }
}
