using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_COMMON.Util;
using YJY_COMMON.Util.Extension;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;
using YJY_SVR.DTO.FormDTO;
using Z.EntityFramework.Plus;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/user")]
    public class UserController : YJYController
    {
        public UserController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpPost]
        [ActionName("signupByPhone")]
        public SignupResultDTO SignupByPhone(SignupByPhoneFormDTO form)
        {
            var result = new SignupResultDTO();

                var user = db.Users.FirstOrDefault(o => o.Phone == form.phone);

                if (user == null) //phone doesn't exist
                {
                    var userService = new UserService(db);
                    userService.CreateUserByPhone(form.phone);

                    //refetch
                    user = db.Users.FirstOrDefault(o => o.Phone == form.phone);

                    var nickname = "u" + user.Id.ToString("000000");
                    user.Nickname = nickname;

                    //check duplicate nickname and generate random suffix
                    int tryCount = 0;
                    while (db.Users.Any(o => o.Id != user.Id && o.Nickname == user.Nickname))
                    {
                        user.Nickname = nickname.TruncateMax(4) + Randoms.GetRandomAlphabeticString(4);

                        tryCount++;

                        if (tryCount > 10)
                        {
                            YJYGlobal.LogError("Tryout exceeded: signupByPhone - check duplicate nickname and generate random suffix. userid: "+user.Id);
                            break;
                        }
                    }

                    db.SaveChanges();

                    result.success = true;
                    result.isNewUser = true;
                    result.userId = user.Id;
                    result.token = user.AuthToken;
                }
                else //phone exists
                {
                    //generate a new token
                    user.AuthToken = UserService.NewToken();
                    db.SaveChanges();

                    result.success = true;
                    result.isNewUser = false;
                    result.userId = user.Id;
                    result.token = user.AuthToken;
                }
           
            return result;
        }

        [HttpPut]
        [Route("follow/{followingId}")]
        [BasicAuth]
        public ResultDTO SetFollowing(int followingId)
        {
            if (UserId == followingId)
                return new ResultDTO(false);

            var any = db.UserFollows.Any(o => o.UserId == UserId && o.FollowingId == followingId);

            if (!any)
            {
                db.UserFollows.Add(new UserFollow()
                {
                    UserId = UserId,
                    FollowingId = followingId,
                    FollowAt = DateTime.UtcNow
                });
                db.SaveChanges();
            }

            return new ResultDTO(true);
        }

        [HttpDelete]
        [Route("follow/{followingId}")]
        [BasicAuth]
        public ResultDTO DeleteFollowing(int followingId)
        {
            if (UserId == followingId)
                return new ResultDTO(false);

            db.UserFollows.Where(o => o.UserId == UserId && o.FollowingId == followingId).Delete();

            return new ResultDTO(true);
        }

        [HttpGet]
        [Route("following")]
        [BasicAuth]
        public List<UserDTO> GetFollowingUsers()
        {
            var result =
                db.UserFollows
                    .Where(o => o.UserId == UserId)
                    .OrderByDescending(o => o.FollowAt)
                    .Join(db.Users, f => f.FollowingId, u => u.Id, (f, u) => new UserDTO()
                    {
                        id = u.Id,
                        nickname = u.Nickname,
                        picUrl = u.PicUrl,
                        //showData = o.Following.ShowData ?? CFDUsers.DEFAULT_SHOW_DATA,
                        //rank = o.Following.LiveRank ?? 0,
                    }).ToList();

            if (result.Count > 0)
            {
                var userIds = result.Select(o => o.id).ToList();

                var twoWeeksAgo = DateTimes.GetChinaToday().AddDays(-13);
                var twoWeeksAgoUtc = twoWeeksAgo.AddHours(-8);

                var datas =
                    db.Positions.Where(
                        o => userIds.Contains(o.UserId.Value) && o.ClosedAt != null && o.ClosedAt >= twoWeeksAgoUtc)
                        .GroupBy(o => o.UserId).Join(db.Users, g => g.Key, u => u.Id, (g, u) => new UserDTO()
                        {
                            id = g.Key.Value,

                            nickname = u.Nickname,
                            picUrl = u.PicUrl,

                            posCount = g.Count(),
                            winRate = (decimal) g.Count(p => p.PL > 0)/g.Count(),
                            roi = g.Sum(p => p.PL.Value)/g.Sum(p => p.Invest.Value),
                        }).OrderByDescending(o => o.roi).Take(YJYGlobal.DEFAULT_PAGE_SIZE).ToList();

                foreach (var userDto in result)
                {
                    var data = datas.FirstOrDefault(o => o.id == userDto.id);

                    if (data == null) //this guy has no data
                    {
                        userDto.roi = 0;
                        userDto.posCount = 0;
                        userDto.winRate = 0;
                    }
                    else
                    {
                        userDto.roi = data.roi;
                        userDto.posCount = data.posCount;
                        userDto.winRate = data.winRate;
                    }
                }

                //result = result.OrderByDescending(o => o.roi).ToList();
            }

            return result;
        }
    }
}
