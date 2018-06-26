import LogicData from '../../LogicData';
var StorageModule = require("../../module/StorageModule");

import {
    SWITCH_LANGUAGE,
    GET_VERSION,
    SET_NICKNAME,
    SET_NICKNAME_FAIL,
    SET_NICKNAME_SUCCESS,
    SET_PORTRAIT,
    UPLOAD_PORTRAIT_SUCCESS,
    UPLOAD_PORTRAIT_FAILURE,
    SET_LOACL_NICKNAME,
    SET_LOACL_NICKNAME_FAIL,
    UPDATE_MAX_NICKNAME_LENGTH
} from '../constants/actionTypes';
var {EventCenter} = require("../../EventCenter");
var DeviceInfo = require('react-native-device-info');
import setNickNameRequest from "../api/setNickNameRequest";
import setPortraitRequest from "../api/setPortraitRequest";
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var NativeDataModule = require('../../module/NativeDataModule');
var LS = require('../../LS');

export let MIN_NICKNAME_LENGTH = 2;
export let MAX_NICKNAME_LENGTH = 10;

export function switchLanguage(){
    return (dispatch) => {
        var currentLocale = LogicData.getLanguage();
        var newLocale = currentLocale == "en-us" ? "zh-cn" : "en-us";
        LogicData.setLanguage(newLocale);
        StorageModule.setLanguage(newLocale).then(()=>{
            dispatch({
                type: SWITCH_LANGUAGE, 
                payload: {
                    language: newLocale
                }
            })
            EventCenter.emitUpdateTabbarEvent();
        })
    }
}

export function getVersion(){
    console.log("getVersion NativeDataModule")
    return (dispatch) => {
        const readableVersion = DeviceInfo.getReadableVersion();
        dispatch({
            type: GET_VERSION, 
            payload: {
                version: readableVersion
            }
        });
        // var subscription = RCTNativeAppEventEmitter.addListener(
        //     'nativeSendDataToRN',
        //     (args) => {
        //         console.log("nativeSendDataToRN", args)
        //         try{
        //             if (args[0] == 'versionCode') {
        //                 subscription.remove();
        //                 dispatch({
        //                     type: GET_VERSION, 
        //                     payload: {
        //                         version: args[1]
        //                     }
        //                 });
        //             }               
        //         }
        //         catch (e) {
        //             console.log(e)
        //         }
        //     }
        // );
        // NativeDataModule.passDataToNative('getVersionCode', "");
    }
}

function validateNickName(nickName){
    var re = new RegExp('^[\\w\\u4e00-\\u9eff]{' + MIN_NICKNAME_LENGTH + ',' + MAX_NICKNAME_LENGTH + '}$'); 
    return re.test(nickName)
}

export function updateLocalNickName(nickName){
    return (dispatch) => {
        dispatch({
            type: SET_LOACL_NICKNAME,
        });
        if(!nickName || nickName.length==0 ){
            dispatch({
                type: SET_LOACL_NICKNAME_FAIL,
                payload: {
                    error: LS.str("ACCOUNT_NAME_CANNOT_BE_EMPTY"),
                }
            });
			return;
		}else if(!validateNickName(nickName)){
            dispatch({
                type: SET_LOACL_NICKNAME_FAIL,
                payload: {
                    error: LS.str("ACCOUNT_NAME_FORMAT_ERROR")
                        .replace("{1}", MIN_NICKNAME_LENGTH)
                        .replace("{2}", MAX_NICKNAME_LENGTH),
                }
            });
			return;
		}
    };
}

export function setNickName(nickName){
    return (dispatch) => {
        dispatch({
            type: SET_NICKNAME,
        });

        if(!nickName || nickName.length==0 ){
            dispatch({
                type: SET_NICKNAME_FAIL,
                payload: {
                    error: LS.str("ACCOUNT_NAME_CANNOT_BE_EMPTY"),
                }
            });
			return;
		}else if(!validateNickName(nickName)){
            dispatch({
                type: SET_NICKNAME_FAIL,
                payload: {
                    error: LS.str("ACCOUNT_NAME_FORMAT_ERROR")
                        .replace("{1}", MIN_NICKNAME_LENGTH)
                        .replace("{2}", MAX_NICKNAME_LENGTH),
                }
            });
			return;
		}

        setNickNameRequest(nickName)
        .then(()=>{
            dispatch({
                type: SET_NICKNAME_SUCCESS,
                payload: {
                    nickName,
                }
            });
        }).catch((error)=>{
            dispatch({
                type: SET_NICKNAME_FAIL,
                payload: {
                    error: error,
                }
            });
            
        })      
    }
}

export function getMaxNickNameLength(){
    return (dispatch) => {
        dispatch({
            type: UPDATE_MAX_NICKNAME_LENGTH,
            payload: {
                maxLength: MAX_NICKNAME_LENGTH,
            }
        });
    }
}

export function setPortrait(portrait){
    return (dispatch) => {
        //TODO!!!
        const source = {uri: 'data:image/jpeg;base64,' + portrait};
        dispatch({
            type: SET_PORTRAIT,
            payload: {
                avatarSource: source,
            }
        });
        
        setPortraitRequest(portrait)
        .then(()=>{
            dispatch({
                type: UPLOAD_PORTRAIT_SUCCESS,
            });
        }).catch((error)=>{
            dispatch({
                type: UPLOAD_PORTRAIT_FAILURE,
                payload: {
                    error: error,
                }
            });
            
        })

    }
}