using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YJY_API.DTO.FormDTO;
using YJY_COMMON.Model.Entity;

namespace YJY_API.DTO
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
        public int? id { get; set; }
        public string nickname { get; set; }
        public string picUrl { get; set; }
    }

    public class MeDTO:UserBaseDTO
    {
       public string thtAddress { get; set; }
        public string phone { get; set; }

        /// <summary>
        /// 邀请码(给别人看的)，用来确定师徒关系
        /// </summary>
        public string InvitationCode { get; set; }

        /// <summary>
        /// 注册码(别人的邀请码)，用来确定师徒关系
        /// </summary>
        public string RegisterCode { get; set; }
    }

    public class UserRankDTO : UserBaseDTO
    { 
        public decimal roi { get; set; }
        //public int posCount { get; set; }
        public decimal winRate { get; set; }

        public FollowTradeDTO followTrade { get; set; }
    }

    public class UserDTO : UserBaseDTO
    {
        //public int followerCount { get; set; }
        public bool? isFollowing { get; set; }
        public FollowTradeDTO followTrade { get; set; }

        public int followerCount { get; set; }
        public int followTraderCount { get; set; }
    }

    public class FollowTradeDTO
    {
        public decimal investFixed { get; set; }
        public int stopAfterCount { get; set; }
        public DateTime? createAt { get; set; }
    }

    public class StatusDTO
    {
        public int id { get; set; }
        public int userId { get; set; }
        public DateTime time { get; set; }
        public string text { get; set; }
        public int likeCount { get; set; }
        public bool? isLiked { get; set; }
    }

    public class BalanceTypeFormDTO
    {
        public string balanceType { get; set; }
    }
}