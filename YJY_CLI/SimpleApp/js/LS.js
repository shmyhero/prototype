'use strict'

import LogicData from './LogicData';

var LS = {
  Str:{
    APP_NAME: ["TradeHero Token", "TradeHero Token"],
    LANGUAGE: ["语言", "Language"],
    DATA_LOADING: ["数据读取中...", "Loading..."],
    ERROR: ["错误", "Error"],
    HINT: ["提示", "Hint"],
    

    HOME_TAB_TITLE: ["动态", "Trends"],



    MARKET_TAB_TITLE: ["行情", "Market"],
    
    
    
    POSITION_TAB_TITLE: ["首页", "Positions"],
    
    
    
    RANK_TAB_TITLE: ["行情", "Rank"],




    ME_TAB_TITLE:["我的", "Me"],
    EXIT: ["退出登录", "Log Out"],
    SUGAR_AMOUNT: ["糖果数", "Sugars"],

    ME_DEPOSIT_TITLE: ["入金", "Deposit"],
    ME_WITHDRAW_TITLE: ["出金", "Withdraw"],
    ME_DETAIL_TITLE: ["资金明细", "Details"],
    ME_HELP_CENTER_TITLE: ["帮助中心", "Help"],
    ME_ABOUT_TITLE: ["关于我们", "About Us"],

  },
  str(key){
    if(LogicData.getLanguage() == 'zh-cn'){
      return LS.Str[key][0]
    }else if(LogicData.getLanguage() == 'en-us'){
      return LS.Str[key][1]
    }else{
      console.log("ENKEY:"+key+" => "+LS.Str[key][1]);
      return LS.Str[key][1]
    }
  }
}

module.exports = LS;
