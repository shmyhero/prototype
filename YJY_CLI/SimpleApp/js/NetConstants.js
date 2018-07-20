'use strict'
import {
  Platform
} from 'react-native' 
  

export let CFD_API_SERVER = 'http://yjy-webapi.chinacloudapp.cn';

export let CFD_API = {
  POST_USER_SIGNUP_BY_PHONE: CFD_API_SERVER + '/api/user/signupByPhone',//登录注册
  GET_STOCK_LIST: CFD_API_SERVER + '/api/security/default',  
  GET_STOCK_DETAIL: CFD_API_SERVER + '/api/security/<stockID>',
  OPEN_POSITION: CFD_API_SERVER + '/api/position',
  STOP_POSITION: CFD_API_SERVER + "/api/position/net",
  CHART_1M: CFD_API_SERVER + "/api/quote/<stockID>/tick/1m",
  OPEN_POSITION_LIST: CFD_API_SERVER + "/api/position/open",
  CLOSED_POSITION_LIST: CFD_API_SERVER + "/api/position/closed",
  STOP_PROFIT_LOSS_API: CFD_API_SERVER + "/api/position/stopTake",

  RANK_TWO_WEEKS:CFD_API_SERVER+"/api/rank/user/plclosed",
  RANK_FOLLOWING:CFD_API_SERVER+"/api/rank/user/following",

  ME_DATA: CFD_API_SERVER + "/api/user/me",

  USER_INFO:CFD_API_SERVER+"/api/user/<id>",
  USER_FOLLOW:CFD_API_SERVER+"/api/user/follow/<id>",
  USER_DEL_FOLLOW:CFD_API_SERVER+"/api/user/follow/<id>",
  USER_FUND_BALANCE:CFD_API_SERVER+"/api/fund/balance",
  MAIN_FEED_DEFAULT:CFD_API_SERVER+"/api/feed/default",//首页动态
  USER_PROFIT_ONE_MONTH: CFD_API_SERVER+"/api/user/<id>/stat/chart/plclosed/1month",
  USER_PROFIT_TOTAL: CFD_API_SERVER+"/api/user/<id>/stat/chart/plclosed",
  PERSONAL_PAGE_POSITION_OPEN:CFD_API_SERVER+"/api/user/<id>/position/open",
  PERSONAL_PAGE_POSITION_CLOSED:CFD_API_SERVER+"/api/user/<id>/position/closed",
  PERSONAL_PAGE_TRADESTYLE:CFD_API_SERVER+"/api/user/<id>/stat/tradeStyle",//交易风格
  PERSONAL_PAGE_PLDIST:CFD_API_SERVER+"/api/user/<id>/stat/plDist",//盈亏分布
  PUBLISH_TWEET: CFD_API_SERVER+"/api/status",
  USER_DYNAMIC_LIST:CFD_API_SERVER+'/api/user/<id>/status',
  DO_DYNAMIC_LIKE:CFD_API_SERVER+'/api/status/<id>/like',
  BIND_PURSE_ADDRESS:CFD_API_SERVER+'/api/fund/THT/address',
  WITHDRAW_BALANCE:CFD_API_SERVER + '/api/fund/THT/withdrawal',
  TH_PURSE_ADDRESS:CFD_API_SERVER + '/api/fund/THT/serverAddress',
  TOKEN_DETAIL:CFD_API_SERVER + '/api/fund/transfer',
  SET_FOLLOW_TRADE: CFD_API_SERVER + '/api/user/followTrade/<id>',
  RANK_USER_FOLLOW_TRADE: CFD_API_SERVER + '/api/rank/user/followTrade',//交易跟随列表
  FOLLOW_TRADE_OPTIONS: CFD_API_SERVER + '/api/user/followTrade/option',
  SET_NICKNAME: CFD_API_SERVER + '/api/user/nickname',
  SET_PORTRAIT: CFD_API_SERVER + '/api/user/avatar',
  GET_DYNAMIC_CONFIG_FILTER:CFD_API_SERVER + '/api/feed/filter',
  PUT_DYNAMIC_CONFIG_FILTER_SETTING: CFD_API_SERVER + '/api/feed/filter',
  GET_UNREAD_MESSAGE_COUNT: CFD_API_SERVER + '/api/message/unreadCount',
  GET_MESSAGES: CFD_API_SERVER + '/api/message?pageNum=<pageNum>&pageSize=<pageSize>',
  SET_MESSAGE_READ: CFD_API_SERVER + '/api/message/<id>/read',
  GET_PHONE_VERIFY_CODE_API: CFD_API_SERVER + '/api/util/sendVerifyCode',
  TIMESTAMP_LOCAL:CFD_API_SERVER + '/api/util/timestampNonce',//Local ok
  BALANCE_TYPE: CFD_API_SERVER + '/api/user/balanceType',
  WITHDRAW_DECIMAL_PLACE: CFD_API_SERVER + '/api/fund/balance/type',
}
    
 

export let AUTH_ERROR = '需要OAuth授权'
export let ANDROID_MARKET_URL = 'market://details?id=com.tradehero.cfd';
