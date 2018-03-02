using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_SVR.Controllers.Attributes;
using YJY_SVR.DTO;
using YJY_SVR.DTO.FormDTO;

namespace YJY_SVR.Controllers
{
    [RoutePrefix("api/status")]
    public class StatusController : YJYController
    {
        public StatusController(YJYEntities db) : base(db)
        {
        }

        [HttpGet]
        [Route("~/api/user/{userId}/status")]
        public List<StatusDTO> GetUserStatusList(int userId)
        {
            var tryGetAuthUser = TryGetAuthUser();
            int? authUserId = tryGetAuthUser?.Id;

            var result = db.Status.Where(o => o.UserId == userId).OrderByDescending(o=>o.Time).Take(YJYGlobal.DEFAULT_PAGE_SIZE)
                .GroupJoin(db.StatusLikes, s => s.Id, l => l.StatusId, (s, likes) => new StatusDTO
                {
                    id=s.Id,
                    time=s.Time.Value,
                    text=s.Text,
                    likeCount = likes.Count(),
                    isLiked = authUserId == null?(bool?) null:likes.Any(l=>l.LikeUserId== authUserId),
                })
                .ToList();

            return result;
        }

        [HttpPost]
        [Route("")]
        [BasicAuth]
        public ResultDTO NewStatus(NewStatusFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.text))
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "invalid empty text"));

            db.Status.Add(new Status()
            {
                UserId = UserId,
                Text = form.text,
                Time = DateTime.UtcNow,
            });
            db.SaveChanges();

            return new ResultDTO(true);
        }

        [HttpPut]
        [Route("{statusId}/like")]
        [BasicAuth]
        public ResultDTO LikeStatus(int statusId)
        {
            var status = db.Status.FirstOrDefault(o => o.Id == statusId);

            if (status == null)
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "no such status"));

            try
            {
                db.StatusLikes.Add(new StatusLike()
                {
                    StatusId = statusId,
                    LikeUserId = UserId,
                    Time = DateTime.UtcNow,
                });
                db.SaveChanges();
            }
            catch (Exception e)
            {
                //return new ResultDTO(false);
                YJYGlobal.LogException(e);
            }

            return new ResultDTO(true);
        }
    }
}
