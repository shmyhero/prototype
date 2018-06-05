import LogicData from '../../LogicData';
var StorageModule = require("../../module/StorageModule");

import {
    SWITCH_LANGUAGE,
    GET_VERSION
} from '../constants/actionTypes';
var {EventCenter} = require("../../EventCenter");
var DeviceInfo = require('react-native-device-info');
var RCTNativeAppEventEmitter = require('RCTNativeAppEventEmitter');
var NativeDataModule = require('../../module/NativeDataModule');

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