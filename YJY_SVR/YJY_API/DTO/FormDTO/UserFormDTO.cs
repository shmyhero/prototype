﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YJY_API.DTO.FormDTO
{
    public class SignupByPhoneFormDTO
    {
        public string phone { get; set; }
        public string verifyCode { get; set; }

        /// <summary>
        /// Web代表网站登录
        /// </summary>
        public string source { get; set; }
    }

    public class SetNicknameFormDTO
    {
        public string nickname { get; set; }
    }

    public class SetCodeFormDTO
    {
        public string code { get; set; }
    }

    public class NewStatusFormDTO
    {
        public string text { get; set; }
    }

    public class SetFollowTradeFormDTO
    {
        public decimal investFixed { get; set; }
        public int stopAfterCount { get; set; }

    }

    public class FollowTradeOptionDTO
    {
        public int[] investFixed { get; set; }
        public int[] stopAfterCount { get; set; }

    }
}