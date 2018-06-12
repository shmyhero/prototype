using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using YJY_API.Controllers;
using YJY_COMMON.Model.Context;
using YJY_COMMON.Service;
using YJY_API.DTO;

namespace YJY_API.Controllers
{
    [RoutePrefix("api/admin")]
    public class AdminController : YJYController
    {
        public AdminController(YJYEntities db, IMapper mapper) : base(db, mapper)
        {
        }

        [HttpPost]
        [Route("login")]
        public AdminUserDTO Login(AdminLoginFormDTO form)
        {
            if (string.IsNullOrWhiteSpace(form.email) || string.IsNullOrWhiteSpace(form.password))
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, "invalid request"));

            var user = db.AdminUsers.FirstOrDefault(o => o.Email == form.email && o.Password == form.password);

            if (user == null)
                return null;

            user.Token = UserService.NewToken();
            db.SaveChanges();

            return new AdminUserDTO()
            {
                id=user.Id,
                token = user.Token
            };
        }
    }
}