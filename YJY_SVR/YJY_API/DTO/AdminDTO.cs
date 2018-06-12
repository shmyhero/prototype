using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class AdminUserDTO
    {
        public int id { get; set; }
        public string token { get; set; }
    }

    public class AdminLoginFormDTO
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}