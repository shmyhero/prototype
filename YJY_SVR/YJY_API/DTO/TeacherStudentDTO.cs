using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO
{
    public class TeacherStudentDTO
    {
        /// <summary>
        /// 分红
        /// </summary>
        public decimal Profit { get; set; }

        /// <summary>
        /// 邀请码
        /// </summary>
        public string InvitationCode { get; set; }

        /// <summary>
        /// 徒弟列表
        /// </summary>
        public List<Student> Students { get; set; }
    }

    public class Student
    {
        public int Id { get; set; }
       public string PicUrl { get; set; }
       public string NickName { get; set; }
        public string Phone { get; set; }
        public DateTime? BindAt { get; set; }
        public Decimal TradeVolume { get; set; }        
    }

    /// <summary>
    /// 徒弟每月交易量
    /// </summary>
    public class StudentMonthProfit
    {
        public int Month { get; set; }
        public decimal TradeVolume { get; set; }
    }
}