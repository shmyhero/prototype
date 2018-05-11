import {
    GET_ME_DATA,
    GET_ME_DATA_SUCCESS,
    GET_ME_DATA_FAIL,
    BIND_WALLET_ADDRESS,
} from "../constants/actionTypes";

import fetchMeDataRequest from "../api/fetchMeDataRequest";
import {checkIsLoggedIn, fetchBalanceData} from "../actions";

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