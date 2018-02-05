using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_SVR.DTO.FormDTO
{
    public class NewPositionFormDTO
    {
        public int securityId { get; set; }
        public bool isLong { get; set; }
        public decimal invest { get; set; }
        public decimal leverage { get; set; }
    }
}