using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_SVR.DTO
{
    public class SignupResultDTO : ResultDTO
    {
        //public bool success { get; set; }
        public bool? isNewUser { get; set; }

        public int? userId { get; set; }
        public string token { get; set; }
    }
}