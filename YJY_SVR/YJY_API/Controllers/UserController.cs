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

        [HttpGet]
        [Route("me")]
        [BasicAuth]
        public UserBaseDTO GetMe()
        {
            var user = GetUser();

            var userDto = Mapper.Map<UserBaseDTO>(user);

            return userDto;
        }

        [HttpGet]
        [Route("{userId}")]
        public UserDTO GetUser(int userId)
        {
            var user = db.Users.FirstOrDefault(o => o.Id == userId);

            var userDto = Mapper.Map<UserDTO>(user);

            var tryGetAuthUser = TryGetAuthUser();
            if (tryGetAuthUser != null)
            {
                userDto.isFollowing = db.UserFollows.Any(o => o.UserId == tryGetAuthUser.Id && o.FollowingId == userId);
            }

            return userDto;
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
    }
}
