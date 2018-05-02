'use strict'

import LogicData from './LogicData';

var LS = {
  Str:{
    APP_NAME: ["TradeHero Token", "TradeHero Token"],
    LANGUAGE: ["语言", "Language"],

    DATA_LOADING: ["数据读取中...", "Loading..."],
    ERROR: ["错误", "Error"],
    HINT: ["提示", "Hint"],
  
    HOME_TAB_TITLE: ["动态", "Dynamic"],
    MARKET_TAB_TITLE: ["行情", "Market"],
    POSITION_TAB_TITLE: ["仓位", "Positions"],
    RANK_TAB_TITLE: ["榜单", "Rank"],
    ME_TAB_TITLE:["我的", "Me"], 

    EXIT: ["退出登录", "Log Out"],
    SUGAR_AMOUNT: ["糖果数", "Sugars"], 
    ME_DEPOSIT_TITLE: ["入金", "Deposit"],
    ME_WITHDRAW_TITLE: ["出金", "Withdraw"],
    ME_DETAIL_TITLE: ["资金明细", "Details"],
    ME_HELP_CENTER_TITLE: ["帮助中心", "Help"],
    ME_ABOUT_TITLE: ["关于我们", "About Us"], 

 





    PULL_TO_REFRESH:["下拉刷新...","pull to refresh ..."],
    RELEASE_TO_REFRESH:["释放刷新","release to refresh"],
    REFRESHING:["刷新中","loading..."],  
    LOAD_MORE:["加载更多","load more ..."],
    RELEASE_FOR_LOAD_MORE:["释放加载更多","release to load more..."],
    NO_MORE:["没有更多","no more data"],
    DEL:["删除","Remove"],
    MOUNT_X:["糖果x","Mount*"],
    MULRIPLE:["倍数","mulriple"],
    PROFIT:["盈利","profit"],
    LOSS:["亏损","loss"],
    CLOSE_POSITION:["平仓","close position"],
    EXPERT:["达人","Expert"],
    CONCERN:["关注","Concern"],
    FOLLOW:["跟随","Follow"],
    MINE:["我的","Mine"],
    WINRATE:["胜率:","WinRate:"],
    APPLY_FOLLOW:["申请跟随:","Apply follow"],
    AVG_MOUNT_FOLLOW:["每笔跟随糖果","Mount per time"],
    FOLLOW_TIMES:["跟随笔数","Follow times"],
    SUNDAY:["星期日","Sunday"],
    MONDAY:["星期一","Monday"],
    TUESDAY:["星期二","Tuesday"],
    WEDNESDAY:["星期三","Wednesday"],
    THURSDAY:["星期四","Thursday"],
    FRIDAY:["星期五","Friday"],
    SATURDAY:["星期六","Saturday"],
    MAIN:["'首页'","Main"],
    DYNAMIC:["动态","Dynamic"],
    OPEN:["持仓","Open"],
    CLOSED:["平仓","Close"],
    YHWGKSJ:["用户未公开数据","no public data"],
    ZWCCJL:["暂无持仓记录","no open data"],
    ZWPCJL:["暂无平仓记录","no closed data"],
    CP:["产品","Products"],
    PJYK:["平均盈亏","Average Profit/Loss"],
    ZSL:["总胜率","Total WinRate"],
    YKFB:["盈亏分布","Profit/Loss Trend"],
    ZWPCJL:["暂无盈亏分布","no data"],
    ZWJYJL:["暂无交易记录","no data"],
    MONTHLY:["近一个月","Monthly"],
    ALL:["全部","ALL"],
    INVESTMENT_TREND:["TA的收益走势","Investment Trend"],
    JYFG:["交易风格","Trade Style"],
    PJGG:["平均倍数","Average Multiple"],
    LJXD:["累积下单(次)","Total trades"],
    PJCCSJ:["平均持仓(天)","Average hold days"],
    PJBJ:["平均糖果","Average Mount"],
    PJMBHL:["平均每笔获利","Average per Profit"],
    CONCERN_CANCEL:["取消关注","-Concern"],
    CONCERN_ADD:["+关注","+Concern"],
    STATISTICS:["统计","Statistics"],
    
      
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
