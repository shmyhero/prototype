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
    }

    //public class SetNicknameFormDTO
    //{
    //    public string nickname { get; set; }
    //}

    public class NewStatusFormDTO
    {
        public string text { get; set; }
    }
}