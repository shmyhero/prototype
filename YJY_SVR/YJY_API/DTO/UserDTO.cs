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

    public class UserBaseDTO
    {
        public int id { get; set; }
        public string nickname { get; set; }
        public string picUrl { get; set; }
    }

    public class UserDTO : UserBaseDTO
    {
        //public int id { get; set; }
        //public string nickname { get; set; }
        //public string picUrl { get; set; }
        public decimal roi { get; set; }
        public int posCount { get; set; }
        public decimal winRate { get; set; }

        //public int rank { get; set; }

        //public bool showData { get; set; }
    }
}