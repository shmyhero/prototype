using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using EntityFramework.Extensions;
using YJY_API.Caching;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_COMMON;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Service;
using YJY_SVR.DTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/message")]
    public class MessageController : YJYController
    {
        public MessageController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpGet]
        [Route("unreadCount")]
        [BasicAuth]
        public int GetUnreadMessageCount()
        {
            return db.Messages.Count(o => o.UserId == UserId && o.ReadAt == null);
        }

        [HttpGet]
        [Route("")]
        [BasicAuth]
        public List<MessageDTO> GetMessages(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            var data= db.Messages.Where(o => o.UserId == UserId ).OrderByDescending(o=>o.CreateAt)
                .Skip((pageNum-1)*pageSize).Take(pageSize)
                .Join(db.Positions,o=>o.PosId,o=>o.Id,(message, position) => new
                {
                    Message=message,
                    Position=position,
                })
                .ToList();

            var result = new List<MessageDTO>();

            if (data.Count==0)
                return result;

            var prods = WebCache.Instance.ProdDefs;

            data.ForEach(o =>
            {
                var prod = prods.FirstOrDefault(p => p.Id == o.Position.SecurityId.Value);

                var dto = new MessageDTO()
                {
                    id = o.Message.Id,
                    createAt = o.Message.CreateAt.Value,
                    isRead = o.Message.ReadAt.HasValue,
                };

                var msgType = (MessageType)Enum.Parse(typeof(MessageType), o.Message.Type);
                switch (msgType)
                {
                    case MessageType.AutoClose:
                        dto.header = (string)HttpContext.GetGlobalResourceObject("Resource", "MsgType_" + o.Message.Type + "_" + o.Position.CloseType + "_Header");
                        var bodyFormat = (string)HttpContext.GetGlobalResourceObject("Resource", "MsgType_" + o.Message.Type + "_" + o.Position.CloseType + "_Body");
                        dto.body = string.Format(bodyFormat,
                           Translator.GetProductNameByThreadCulture(prod.Name),
                            o.Position.ClosePrice.Value.ToString("F"+ prod.Prec),
                            o.Position.PL >= 0 ? Resources.Resource.Earn : Resources.Resource.Lose,
                            Math.Abs(o.Position.PL.Value).ToString("0.00"));
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                result.Add(dto);
            });

          return result;
        }

        [HttpPut]
        [Route("{id}/read")]
        [BasicAuth]
        public ResultDTO SetMessageRead(int id)
        {
            var count = db.Messages.Where(o => o.Id == id && o.UserId == UserId && o.ReadAt==null).Update(o => new Message { ReadAt = DateTime.UtcNow});

            return new ResultDTO(true);
        }

        [HttpPut]
        [Route("readAll")]
        [BasicAuth]
        public ResultDTO SetAllMessageRead()
        {
            var count = db.Messages.Where(o => o.UserId == UserId && o.ReadAt == null).Update(o => new Message { ReadAt = DateTime.UtcNow });

            return new ResultDTO(true);
        }
    }
}
