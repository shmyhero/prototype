import {
    GET_BALANCE,
    GET_BALANCE_SUCCESS,
    GET_BALANCE_FAIL
} from "../constants/action-types";

import fetchBalanceRequest from "../api/fetchBalanceRequest";

export function getBalance() {
    return {
        type: GET_BALANCE,
    };
}

export function getBalanceSuccess(data) {
    return {
        type: GET_BALANCE_SUCCESS,
        payload: {
            data
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
                console.log("fetchBalance then", data)
                dispatch(getBalanceSuccess(data.balance.maxDecimal(2)))
            })
            .catch((err) => {
                console.log("fetchBalance catch", err)
                dispatch(getBalanceFailure(err));
            });
    }
}