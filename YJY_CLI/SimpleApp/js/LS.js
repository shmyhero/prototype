'use strict'

import LogicData from './LogicData';

var LS = {
  Str:{
    APP_NAME: ["TradeHero Token", "TradeHero Token"],
    LANGUAGE: ["语言", "Language"],
    HOME_TAB_TITLE: ["动态", "Trends"],



    MARKET_TAB_TITLE: ["行情", "Market"],
    
    
    
    POSITION_TAB_TITLE: ["首页", "Positions"],
    
    
    
    RANK_TAB_TITLE: ["行情", "Rank"],




    ME_TAB_TITLE:["我的", "Me"],
  },
  str(key){
    if(LogicData.getLanguageEn() == 'zh-cn'){
      return LS.Str[key][0]
    }else if(LogicData.getLanguageEn() == 'en-us'){
      return LS.Str[key][1]
    }else{
      console.log("ENKEY:"+key+" => "+LS.Str[key][1]);
      return LS.Str[key][1]
    }
  }
}

module.exports = LS;
