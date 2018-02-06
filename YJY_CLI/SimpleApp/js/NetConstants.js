'use strict'
import {
  Platform
} from 'react-native' 
  

export let CFD_API_SERVER = 'http://yjy-webapi.chinacloudapp.cn';

 
export let CFD_API = {
  POST_USER_SIGNUP_BY_PHONE: CFD_API_SERVER + '/api/user/signupByPhone',//登录注册
  
}
    
 

export let AUTH_ERROR = '需要OAuth授权'
export let ANDROID_MARKET_URL = 'market://details?id=com.tradehero.cfd';
