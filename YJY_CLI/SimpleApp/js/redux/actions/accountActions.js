import LogicData from '../../LogicData';
import { CHECK_LOGIN_STATE_LOGGED_IN, CHECK_LOGIN_STATE_NOT_LOGGED_IN } from "../constants/actionTypes";
var CacheModule = require('../../module/CacheModule')
var WebSocketModule = require("../../module/WebSocketModule");
var StorageModule = require("../../module/StorageModule")

export function HasLogin() {
    return {
        type: CHECK_LOGIN_STATE_LOGGED_IN        
    }
}

export function NotLogin() {
    return {
        type: CHECK_LOGIN_STATE_NOT_LOGGED_IN
    }
}

export function checkIsLoggedIn(isLoggedIn, notLoggedIn) {
    return (dispatch) => {
        if(!LogicData.isLoggedIn()){
            console.log("checkIsLoggedIn NotLogin")
            dispatch(NotLogin());
            notLoggedIn && notLoggedIn();
        }else{
            console.log("checkIsLoggedIn Login")
            dispatch(HasLogin());
            isLoggedIn && isLoggedIn();
        }
    }
}

export function logOut(){
    return (dispatch) => {
        CacheModule.clearUserRelatedCache();
        var balanceType = LogicData.getDefaultBalanceType();
        LogicData.setBalanceType(balanceType);
        StorageModule.setBalanceType(balanceType);
        LogicData.logout(()=>{
            dispatch(NotLogin());
            //Restart the web socket.
            WebSocketModule.start();
        });
    }
}
