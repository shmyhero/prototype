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

  RANK_TWO_WEEKS:CFD_API_SERVER+"/api/rank/user/plclosed/2w",
  RANK_FOLLOWING:CFD_API_SERVER+"/api/rank/user/following",
  
  
}
    
 

export let AUTH_ERROR = '需要OAuth授权'
export let ANDROID_MARKET_URL = 'market://details?id=com.tradehero.cfd';
