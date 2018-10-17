namespace YJY_COMMON.Model.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("User")]
    public partial class User
    {
        public int Id { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        public DateTime? CreatedAt { get; set; }

        [StringLength(50)]
        public string Nickname { get; set; }

        [StringLength(50)]
        public string AuthToken { get; set; }

        public DateTime? LastHitAt { get; set; }

        [StringLength(200)]
        public string PicUrl { get; set; }

        [StringLength(50)]
        public string WeChatOpenId { get; set; }

        [StringLength(50)]
        public string WeChatUnionId { get; set; }

        //public decimal? Balance { get; set; }

        [StringLength(100)]
        public string THTAddress { get; set; }

        public bool? ShowFollowingFeed { get; set; }

        public bool? ShowTradeFollowingFeed { get; set; }

        public bool? ShowHeadlineFeed { get; set; }

        //public decimal? BalanceEth { get; set; }

        //[StringLength(100)]
        //public string ETHAddress { get; set; }

        //[StringLength(10)]
        //public string BalanceType { get; set; }

        public int? ActiveBalanceId { get; set; }

        /// <summary>
        /// 邀请码(给别人看的)，用来确定师徒关系
        /// </summary>
        public string InvitationCode { get; set; }

        /// <summary>
        /// 注册师徒关系的时间
        /// </summary>
        public DateTime? RegisteredAt { get; set; }

        /// <summary>
        /// 注册码(别人的邀请码)，用来确定师徒关系
        /// </summary>
        public string RegisterCode { get; set; }
    }
}
