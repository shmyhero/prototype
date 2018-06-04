import LogicData from '../../LogicData';
var StorageModule = require("../../module/StorageModule");

import {SWITCH_LANGUAGE} from '../constants/actionTypes';
var {EventCenter} = require("../../EventCenter");

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