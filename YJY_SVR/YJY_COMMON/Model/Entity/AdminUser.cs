namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("AdminUser")]
    public partial class AdminUser
    {
        public int Id { get; set; }

        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(200)]
        public string Password { get; set; }

        [StringLength(200)]
        public string Token { get; set; }

        [StringLength(50)]
        public string Nickname { get; set; }

        public DateTime? LastHitAt { get; set; }
    }
}
