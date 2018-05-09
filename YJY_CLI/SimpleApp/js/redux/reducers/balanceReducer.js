import {GET_BALANCE, GET_BALANCE_SUCCESS, GET_BALANCE_FAIL } from "../constants/actionTypes";

var initializeState = {
    balance: 0,
    isBalanceLoading: false,
    errorMessage: null,
}

//Previous state, action => current state
export default function balanceReducer(state = initializeState, action) {
    switch (action.type) {
        case GET_BALANCE:
            return { ...state, isBalanceLoading: true,
                errorMessage: null
            };
        case GET_BALANCE_SUCCESS:
            return { ...state, 
                isBalanceLoading: false, 
                balance: action.payload.data,
                errorMessage: null
            };
        case GET_BALANCE_FAIL:
            return {
                ...state,
                isBalanceLoading: false,
                errorMessage: action.payload.errorMessage
            };
        default:
            return state;
    }
}