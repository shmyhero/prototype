using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using YJY_COMMON.Localization;
using YJY_COMMON.Model.Cache;
using YJY_COMMON.Model.Entity;
using YJY_COMMON.Util;
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
                cfg.CreateMap<ProdDef, SecurityDTO>()
                    .ForMember(dest => dest.name, opt => opt.MapFrom(src => Translator.GetProductNameByThreadCulture(src.Name)))
                    .ForMember(dest => dest.open, opt => opt.MapFrom(src => Quotes.GetOpenPrice(src)))
                    .ForMember(dest => dest.isOpen, opt => opt.MapFrom(src => src.QuoteType == enmQuoteType.Open))
                    .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.QuoteType))
                    .ForMember(dest => dest.tag, opt => opt.MapFrom(src => Products.GetStockTag(src.Symbol)));
                cfg.CreateMap<ProdDef, SecurityDetailDTO>()
                    .ForMember(dest => dest.last, opt => opt.MapFrom(src => Quotes.GetLastPrice(src)))
                    //.ForMember(dest => dest.ask, opt => opt.MapFrom(src => src.Offer))
                    .ForMember(dest => dest.name,
                        opt => opt.MapFrom(src => Translator.GetProductNameByThreadCulture(src.Name)))
                    .ForMember(dest => dest.open, opt => opt.MapFrom(src => Quotes.GetOpenPrice(src)))
                    //.ForMember(dest => dest.preClose, opt => opt.MapFrom(src => src.CloseAsk))
                    .ForMember(dest => dest.isOpen, opt => opt.MapFrom(src => src.QuoteType == enmQuoteType.Open))
                    .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.QuoteType))
                    .ForMember(dest => dest.tag, opt => opt.MapFrom(src => Products.GetStockTag(src.Symbol)))
                    .ForMember(dest => dest.dcmCount, opt => opt.MapFrom(src => src.Prec));

                cfg.CreateMap<Position, PositionDTO>()
                .ForMember(dest => dest.isLong, opt => opt.MapFrom(src => src.Side))
                .ForMember(dest=>dest.createAt,opt=>opt.MapFrom(src=>src.CreateTime));

                //cfg.CreateMap<User, MeDTO>();

                cfg.CreateMap<Transfer, TransferDTO>()
                .ForMember(dest=>dest.type, opt => opt.MapFrom(src =>Translator.GetTransferTypeDescription(src.Type)));
            });
        }
    }
}