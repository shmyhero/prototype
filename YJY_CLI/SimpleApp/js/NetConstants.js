'use strict'
import {
  Platform
} from 'react-native' 
  

export let CFD_API_SERVER = 'http://yjy-webapi.chinacloudapp.cn';

 
export let CFD_API = {
  POST_USER_SIGNUP_BY_PHONE: CFD_API_SERVER + '/api/user/signupByPhone',//登录注册
  GET_STOCK_LIST: CFD_API_SERVER + '/api/security/default',  
  GET_STOCK_DETAIL: CFD_API_SERVER + '/api/security/<stockID>',
  ORDER: CFD_API_SERVER + '/api/position',
}
    
 

export let AUTH_ERROR = '需要OAuth授权'
export let ANDROID_MARKET_URL = 'market://details?id=com.tradehero.cfd';
