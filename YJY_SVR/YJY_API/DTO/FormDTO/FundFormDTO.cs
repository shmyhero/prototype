using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_SVR.DTO.FormDTO
{
    public class THTAddressFormDTO
    {
        public string address { get; set; }
    }
    public class NewTHTWithdrawalFormDTO
    {
        //public int value { get; set; }
        public decimal amount { get; set; }
    }
}