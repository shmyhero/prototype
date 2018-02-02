using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Entity;
using YJY_SVR.DTO;

namespace YJY_API
{
    public class MapperConfig
    {
        public static MapperConfiguration GetAutoMapperConfiguration()
        {
            return new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<ProdDef, ProdDefDTO>();
            });
        }
    }
}