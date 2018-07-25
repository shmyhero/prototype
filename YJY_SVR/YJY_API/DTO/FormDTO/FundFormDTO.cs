using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO.FormDTO
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
    public class FundManualAdjustFormDTO
    {
        //public int value { get; set; }
        public int userId { get; set; }
        public int balanceTypeId { get; set; }
        public decimal amount { get; set; }
    }
    public class WithdrawalDTO
    {
        public int id { get; set; }
        public UserBaseDTO user { get; set; }
        public decimal? amount { get; set; }
        public DateTime? createAt { get; set; }
        public DateTime? sendAt { get; set; }
        public string sendResult { get; set; }
        public DateTime? callbackAt { get; set; }
        public bool? callbackResult { get; set; }
        public string callbackMessage { get; set; }
        public DateTime? cancelAt { get; set; }

    }
}