'use strict'

import LogicData from './LogicData';

var LS = {
  Str:{
    APP_NAME: ["BitHero", "BitHero"],
    LANGUAGE: ["语言", "Language"],

    DATA_LOADING: ["数据读取中...", "Loading..."],
    DATA_LOAD_FAILED: ["数据读取失败", "Data Loading Failed"],
    ERROR: ["错误", "Error"],
    HINT: ["提示", "Hint"],
    TAB_MAIN_TAB_LABEL: ["动态", "Dynamic"],
    TAB_MARKET_TAB_LABEL: ["行情", "Market"],
    TAB_POSITION_TAB_LABEL: ["仓位", "Positions"],
    TAB_RANK_TAB_LABEL: ["榜单", "Rank"],
    TAB_ME_TAB_LABEL:["我的", "Me"], 
    VERIFING: ["信息检查中...", "Verifying..."],    
    FINISH: ["完成", "Done"],
    SUGAR_AMOUNT: ["糖果数", "Candy"],

    LOG_OUT: ["退出登录", "Log Out"],

    PULL_TO_REFRESH:["下拉刷新...","pull to refresh ..."],
    RELEASE_TO_REFRESH:["释放刷新","release to refresh"],
    REFRESHING:["刷新中","loading..."],  
    LOADING:["加载中...","loading..."],
    LOAD_MORE:["加载更多","load more ..."],
    RELEASE_FOR_LOAD_MORE:["释放加载更多","release to load more..."],
    NO_MORE:["没有更多","no more data"] ,
    DEL:["删除","Remove"],
    MOUNT_X:["糖果 x","Candy x"],
    MULTIPLE:["倍数","multiple"],
    PROFIT:["盈利","profit"],
    LOSS:["亏损","loss"],    
    CLOSE_POSITION:["平仓","close position"],
    EXPERT:["达人","Expert"],
    CONCERN:["关注","Watch"],
    COPY_TRADE:["跟随","Copy"],
    COPYING_TRADE:["跟随中","Copying"],
    CANCLE_COPY:["取消剩余跟随({1})","Cancel Copy ({1})"],
    CANCLE_COPY_ALERT_TITLE:["确认取消跟随", "Are you sure to cancel copy?"],
    CANCLE_COPY_ALERT_MESSAGE:["未跟随的申请将自动取消", "Uncopied positions will be cancelled automatically"],
    CANCLE_COPY_ALERT_OK:["确认取消", "Confirm"],
    CANCLE_COPY_ALERT_CANCLE:["暂不", "Not Now"],
    MINE:["我的","Mine"],
    WINRATE:["胜率:","WinRate:"],
    APPLY_COPY:["申请跟随:","Apply Copy"],
    AVG_MOUNT_COPY:["每笔跟随糖果","Candy per time"],
    COPY_TIMES:["跟随笔数","Copy times"],
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
    ZWCCJL:["暂无持仓记录","There are no open positions"],
    ZWPCJL:["暂无平仓记录","There are no closed positions"],
    CP:["产品","Products"],
    PJYK:["平均盈亏","Average Profit/Loss"],
    ZSL:["总胜率","Total WinRate"],
    YKFB:["盈亏分布","Profit/Loss Trend"],
    //ZWPCJL:["暂无盈亏分布","no data"],
    ZWJYJL:["暂无交易记录","no data"],
    MONTHLY:["近一个月","Monthly"],
    ALL:["全部","ALL"],
    INVESTMENT_TREND:["TA的收益走势","Investment Trend"],
    JYFG:["交易风格","Trade Style"],
    PJGG:["平均倍数","Average Multiple"],
    LJXD:["累积下单(次)","Total trades"],
    PJCCSJ:["平均持仓(天)","Average hold days"],
    PJBJ:["平均糖果","Average Candy"],
    PJMBHL:["平均每笔获利","Average Per Profit"],
    CONCERN_CANCEL:["取消关注","UnWatch"],
    CONCERN_ADD:["+关注","Watch"],
    STATISTICS:["统计","Statistics"],
    PHONE_NUM:["手机号","Phone Number"],
    VCODE:["验证码","VCode"],
    GET_VCODE:["获取验证码","Get VCode"],
    YOU_ARE_LOGIN:["您正在登录糖果市场","You are login Candy market"],
    FAST_LOGIN:["快速登录","Fast Login"],
    LOGIN:["登录","Login"],
    TOTAL_MOUNT:["总糖果","Total Candy"],
    REMAIN_MOUNT:["剩余糖果","Remain Candy"],
    SHARE:["分享","Share"],
    NO_DYNAMIC:["暂无动态","No Data"],
    NO_COPY:["没有跟随记录","No Copy"],
    
    
    
     
    
    ME_DEPOSIT_TITLE: ["入金", "Deposit"],
    ME_WITHDRAW_TITLE: ["出金", "Withdraw"],
    ME_DETAIL_TITLE: ["资金明细", "Transactions"],
    ME_HELP_CENTER_TITLE: ["帮助中心", "Help Center"],
    ME_ABOUT_TITLE: ["关于我们", "About Us"],


    NO_TRANSACTIONS: ["暂无资金明细", "There are no transactions"],
    POSITION_TAKE_LOSS:['亏损','Take loss'],
    POSITION_TAKE_PROFIT:['获利','Take Profit'],
    POSITION_CONFIRM: ['确认','OK'],
    POSITION_SETTED:['已设置','Setted'],
    TAKE_PROFIT: ['止盈','Take Profit'],
    STOP_LOSS: ['止损','Stop loss'],
    TAKE_PROFIT_STOP_LOSS_TITLE:['止盈/止损','Profit / Loss'],

    STOCK_MARKET_STOP:['暂停','Stop'],
    STOCK_MARKET_CLOSED:['闭市','closed'],
    STOCK_DETAIL: ['详情', "Detail"],

    TWEET_HINT: ["今天你怎么看？", "What's your opinion today?"],
    TWEET_PUBLISH_TITLE: ["发布动态", "Publish Tweet"],
    TWEET_PUBLISH: ["发布", "Publish"],
    TWEET_PUBLISH_FAILED_TITLE: ["发布失败", "Publish failed"],
    TWEET_PUBLISH_PRODUCTS: ["产品", "Products"],

    POSITION_HOLD_NO_ITEMS: ["暂无持仓记录", "There are no open positions"],
    POSITION_CLOSED_NO_ITEMS: ["暂无平仓记录", "There are no closed positions"],
    BUY_LONG: ["上升","LONG"],
    BUY_SHORT: ["下降","SHORT"],
    BUY: ["开始", "Start"],
    SELECT_PRODUCT: ["选择产品", "Choose Products"],

    BIND_PURSE_ADDRESS_HINT: ["请输入/粘贴钱包地址", "Please enter/paste wallet address"],
    BIND_PURSE_HINT: ["绑定须知：入金前需要绑定您的钱包地址，钱包地址绑定后，入金才能和糖果账户关联起来！", "Binding Notice: You need to bind your wallet address before Deposit, After binding, funds can be associated with the token account."],
    BIND_CONFIRM: ["确认绑定", "Confirm binding"],
    BIND_PURSE_HEADER: ["绑定钱包地址", "Bind wallet address"],
    DEPOSIT_COPY_YJY_ADDRESS: ["复制BitHero收款地址", "Copy wallet address of BitHero"],
    DEPOSIT_YJY_ADDRESS: ["BitHero收款地址: ", "Wallet address of BitHero: "],
    DEPOSIT_HINT_1: ["注册以太坊钱包: ", "Registered Ethereum Wallet: "],
    DEPOSIT_HINT_2: ["以太坊官网: ", "Ethereum Website: "],
    DEPOSIT_HINT_3: ["用户把自己的Token转入BitHero: ", "Users transfer their Token to BitHero"],
    DEPOSIT_COPY_SUCCESS: ["复制成功", "Successful"],
    DEPOSIT_AGREEMENT: ["《购买糖果协议内容》", "《Candy clause》"],

    WITHDRAW_ADDRESS_HINT: ["我的收款地址", "My wallet address"],
    WITHDRAW_READ_AGREEMENT: ["我已经阅读并同意", "Accept "],
    WITHDRAW_AGREEMENT: ["出金协议内容", "the Agreement"],
    WITHDRAW_AMOUNT: ["出金金额", "Withdraw Limit"],
    WITHDRAW_CANDY: ["糖果", "Candy"],
    WITHDRAW_ALL: ['全部出金', 'Withdraw all'],
    WITHDRAW_AVAILABLE_AMOUNT: ['可出资金：{1}糖果，', 'Withdraw Limit :{1} Candy,'],
    WITHDRAW_WITHDRAW: ["确认出金", "withdraw"],
    WITHDRAW_REQUEST_SUBMITED: ["出金提交成功", "Submitted"],
    WITHDRAW_ETA_MESSAGE: ["预计资金到账时间为1小时，具体以钱包余额为准！", "Funds may arrive within one hour."],

    COPY_AGREEMENT: ["《跟随规则》", "Copy Agreement"],
    COPY_AMOUNT: ["每笔跟随糖果", "Candy"],
    COPY_COUNT: ["跟随笔数", "Times"],

    ORDER_TYPE:['类型','type'],
    ORDER_SUGAR_AMOUNT: ["糖果", "Candy"],
    ORDER_MULTIPLE: ["倍数", "Multiple"],
    ORDER_TRADE_PRICE: ["交易价格", "Trade Price"],
    ORDER_MAX_RISK: ["最大风险（糖果）", "Maximum Risk"],
    ORDER_PROFIT_AND_LOSS: ["盈亏（糖果）", "Profit / loss (Candy)"],
    
    ORDER_CURRENT_BUY_PRICE:['当前买价','Current Price'],
    ORDER_CURRENT_SELL_PRICE:['当前卖价','Current Price'],
    ORDER_OPEN_PRICE:['开仓价格','Trade Price'],
    ORDER_CLOSE_PRICE:['平仓价格','Close Price'],
    ORDER_OPEN_TIME: ["开仓时间", "Opened"],
    ORDER_CLOSE_TIME: ["平仓时间", "Closed"],
    ORDER_OPEN: ["开仓","Open"],
    ORDER_CLOSE: ["平仓","Closed"],


    MY_MESSAGES:['我的消息','Messages'],
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
  },
  imageList: {
    deposit_token_image: [require("../images/zh-cn/deposit_token_image.jpg"), require("../images/en-us/deposit_token_image.jpg"), ],
    stock_detail_amount_container: [require("../images/zh-cn/stock_detail_amount_container.png"), require("../images/en-us/stock_detail_amount_container.png")],
    stock_detail_direction_container: [require("../images/zh-cn/stock_detail_direction_container.png"), require("../images/en-us/stock_detail_direction_container.png")],
    stock_detail_multiple_container: [require("../images/zh-cn/stock_detail_multiple_container.png"), require("../images/en-us/stock_detail_multiple_container.png")],
    stock_detail_option_down_selected: [require("../images/zh-cn/stock_detail_option_down_selected.png"), require("../images/en-us/stock_detail_option_down_selected.png")],
    stock_detail_option_down_unselected: [require("../images/zh-cn/stock_detail_option_down_unselected.png"), require("../images/en-us/stock_detail_option_down_unselected.png")],
    stock_detail_option_up_selected: [require("../images/zh-cn/stock_detail_option_up_selected.png"), require("../images/en-us/stock_detail_option_up_selected.png")],
    stock_detail_option_up_unselected: [require("../images/zh-cn/stock_detail_option_up_unselected.png"), require("../images/en-us/stock_detail_option_up_unselected.png")],
    stock_detail_trading_container:[require("../images/zh-cn/stock_detail_trading_container.png"), require("../images/en-us/stock_detail_trading_container.png")],
    bind_purse_address_hint: [require("../images/zh-cn/bind_purse_address_hint.png"), require("../images/en-us/bind_purse_address_hint.png")],
    splash: [require('../images/zh-cn/splash.jpg'), require('../images/en-us/splash.jpg')],
  },

  loadImage(imageFileName){
    if(LogicData.getLanguage() == 'zh-cn'){
      return LS.imageList[imageFileName][0]
    }else if(LogicData.getLanguage() == 'en-us'){
      return LS.imageList[imageFileName][1]
    }else{
      return LS.imageList[imageFileName][1]
    }
  }
}

module.exports = LS;
