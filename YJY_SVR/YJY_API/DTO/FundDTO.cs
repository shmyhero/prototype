using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class BalanceDTO
    {
        public decimal balance { get; set; }

        public decimal? total { get; set; }

        public int? id { get; set; }
        public BalanceTypeDTO type { get; set; }
    }
    public class BalanceTypeDTO
    {
        public int id { get; set; }
        public string code { get; set; }
        public int? precision { get; set; }
    }
    public class THTAddressDTO
    {
        public string address { get; set; }
    }

    public class TransferDTO
    {
        public decimal amount { get; set; }
        public decimal balanceAfter { get; set; }
        public DateTime time { get; set; }
        public string type { get; set; }
    }
}