using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using EntityFramework.Extensions;
using ServiceStack.Common.Utils;
using YJY_API.Controllers;
using YJY_API.Controllers.Attributes;
using YJY_API.DTO;
using YJY_API.DTO.FormDTO;
using YJY_COMMON;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Model.Entity;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/headline")]
    public class HeadlineController : YJYController
    {
        public HeadlineController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpGet]
        [Route("all")]
        [AdminAuth]
        public List<HeadlineDTO> GetHeadlineList(int pageNum = 1, int pageSize = YJYGlobal.DEFAULT_PAGE_SIZE)
        {
            return db.Headlines.OrderByDescending(o=>o.CreateAt)
                .Skip((pageNum - 1) * pageSize).Take(pageSize).ToList()
                .Select(o=>Mapper.Map<HeadlineDTO>(o)).ToList();
        }

        [HttpGet]
        [Route("{id}")]
        [AdminAuth]
        public HeadlineDTO GetHeadline(int id)
        {
            return Mapper.Map<HeadlineDTO>(db.Headlines.FirstOrDefault(o => o.Id == id));
        }

        [HttpPost]
        [Route("")]
        [AdminAuth]
        public ResultDTO NewHeadline(HeadlineFormDTO form)
        {
            if(string.IsNullOrWhiteSpace(form.header)||string.IsNullOrWhiteSpace(form.body))
                return new ResultDTO(false);

            db.Headlines.Add(new Headline()
            {
                Header = form.header,
                Body = form.body,
                CreateAt = DateTime.UtcNow,
                Language = form.language,
            });
            db.SaveChanges();

            return new ResultDTO { success = true };
        }

        [HttpPut]
        [Route("{id}")]
        [AdminAuth]
        public ResultDTO UpdateHeadline(int id, HeadlineFormDTO form)
        {
            var headline = db.Headlines.FirstOrDefault(o => o.Id == id);

            if(headline==null)
                return new ResultDTO(false);

            headline.Header = form.header;
            headline.Body = form.body;
            headline.Language = form.language;
            db.SaveChanges();

            return new ResultDTO { success = true };
        }

        [HttpDelete]
        [Route("{id}")]
        [AdminAuth]
        public ResultDTO DeleteHeadline(int id)
        {
            db.Headlines.Where(o => o.Id == id).Delete();
            return new ResultDTO(true);
        }
    }
}
