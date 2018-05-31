import {
    GET_ME_DATA,
    GET_ME_DATA_SUCCESS,
    GET_ME_DATA_FAIL,
    BIND_WALLET_ADDRESS,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAIL,
    SET_PORTRAIT,
    UPLOAD_PORTRAIT_SUCCESS,
    UPLOAD_PORTRAIT_FAILURE 
} from "../constants/actionTypes";

import fetchMeDataRequest from "../api/fetchMeDataRequest";
import setNickNameRequest from "../api/setNickNameRequest";
import setPortraitRequest from "../api/setPortraitRequest";
import {checkIsLoggedIn, fetchBalanceData, logout} from "../actions";
var UIConstants = require('../../UIConstants');
var LS = require('../../LS');

export function getMeData() {
    console.log("getMeData", GET_ME_DATA)
    return {
        type: GET_ME_DATA,
    };
}

export function getMeDataSuccess(data) {
    return {
        type: GET_ME_DATA_SUCCESS,
        payload: {
            data
        }
    }
}

export function getMeDataFailure(errorMessage) {
    return {
        type: GET_ME_DATA_FAIL,
        payload: {
            errorMessage
        }
    }
}

export function fetchMeData() {
    console.log("fetchMeData action")
    return (dispatch) => {   
        checkIsLoggedIn(()=>{
            dispatch(getMeData());
            fetchMeDataRequest()
                .then((data) => {
                    console.log("fetchMeData then", data)
                    dispatch(getMeDataSuccess(data))
                })
                .catch((err) => {
                    console.log("fetchMeData catch", err)
                    dispatch(getMeDataFailure(err));
                });
            fetchBalanceData()(dispatch);
        }, ()=>{
            
        })(dispatch);
    }
}

export function bindWallet(thtAddress){
    return (dispatch) => {
        //TODO!!!
        dispatch({
            type: BIND_WALLET_ADDRESS,
            payload: {
                thtAddress
            }
        });
    }
}

export function setNickName(nickName){
    return (dispatch) => {
        isLoading: true,
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
		}else if(nickName.length > UIConstants.MAX_NICKNAME_LENGTH){
            dispatch({
                type: SET_NICKNAME_FAIL,
                payload: {
                    error: LS.str("ACCOUNT_NAME_MAXINUM_LENGTH").replace("{1}", UIConstants.MAX_NICKNAME_LENGTH),
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
                // payload: {
                //     avatarSource: source,
                // }
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
//