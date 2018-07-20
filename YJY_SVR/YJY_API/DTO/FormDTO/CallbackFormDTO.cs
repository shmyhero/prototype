using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO.FormDTO
{
    public class THTDepositFormDTO
    {
        //public int index { get; set; }
        //public string from { get; set; }
        //public string to { get; set; }
        //public int value { get; set; }

        public string transactionHash { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string tokenAmount { get; set; }
    }

    public class THTWithdrawalFormDTO
    {
        public string id { get; set; }
        //public string from { get; set; }
        public string to { get; set; }
        public string value { get; set; }
    }
    public class ETHDepositFormDTO
    {
        public string transactionHash { get; set; }
        public string from { get; set; }
        public string to { get; set; }
        public string ethAmount { get; set; }
    }

    public class ETHWithdrawalFormDTO
    {
        public string id { get; set; }
        public string to { get; set; }
        public string value { get; set; }
    }
}