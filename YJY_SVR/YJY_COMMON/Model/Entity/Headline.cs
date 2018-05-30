namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Headline")]
    public partial class Headline
    {
        public int Id { get; set; }

        [StringLength(200)]
        public string Header { get; set; }

        [StringLength(2000)]
        public string Body { get; set; }

        public DateTime? CreateAt { get; set; }

        [StringLength(10)]
        public string Language { get; set; }
    }
}
