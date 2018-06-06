import {
    GET_BALANCE,
    GET_BALANCE_SUCCESS,
    GET_BALANCE_FAIL,
    GET_TRADE_STYLE_SUCCESS,
    GET_TRADE_STYLE_FAIL,
} from "../constants/actionTypes";

import fetchBalanceRequest from "../api/fetchBalanceRequest";
import fetchTradeStyleRequest from "../api/fetchTradeStyleRequest";

export function getBalance() {
    return {
        type: GET_BALANCE,
    };
}

export function getBalanceSuccess(balance, total) {
    return {
        type: GET_BALANCE_SUCCESS,
        payload: {
            total,
            balance,
        }
    }
}

export function getBalanceFailure(errorMessage) {
    return {
        type: GET_BALANCE_FAIL,
        payload: {
            errorMessage
        } 
    }
}

export function fetchBalanceData() {
    //fetchBalance catch', { [TypeError: undefined is not an object (evaluating 'action.payload.data')]
    return (dispatch) => {
        dispatch(getBalance())
        fetchBalanceRequest()
            .then((data) => {
                console.log("fetchBalance then", data);
                dispatch(getBalanceSuccess(data.balance, data.total));
            })
            .catch((err) => {
                console.log("fetchBalance catch", err);
                dispatch(getBalanceFailure(err));
            });
        fetchTradeStyleRequest()
            .then((data)=>{
                console.log("fetchTradeStyleRequest", data)
                console.log("fetchTradeStyleRequest data.avgPl", data.avgPl)
                console.log("fetchTradeStyleRequest data.posCount", data.posCount)
                var totalProfit = data.avgPl * data.posCount;
                dispatch({
                    type: GET_TRADE_STYLE_SUCCESS,
                    payload: {
                        totalProfit
                    } 
                });
            })
            .catch((errorMessage) => {
                dispatch({
                    type: GET_TRADE_STYLE_FAIL,
                    payload: {
                        errorMessage
                    } 
                });
            });
    }
}