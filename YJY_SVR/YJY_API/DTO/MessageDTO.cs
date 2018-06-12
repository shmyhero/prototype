using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class MessageDTO
    {
        public int id { get; set; }
        public string header { get; set; }
        public string body { get; set; }
        public DateTime createAt { get; set; }
        public bool isRead { get; set; }
    }
}