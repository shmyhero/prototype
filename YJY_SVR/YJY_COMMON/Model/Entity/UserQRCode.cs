using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace YJY_COMMON.Model.Entity
{
    [Table("UserQRCode")]
    public class UserQRCode
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public string QRCode { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
