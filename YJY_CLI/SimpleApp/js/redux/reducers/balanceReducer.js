import {
    GET_BALANCE,
    GET_BALANCE_SUCCESS,
    GET_BALANCE_FAIL,
    GET_TRADE_STYLE_SUCCESS,
    GET_TRADE_STYLE_FAIL
} from "../constants/actionTypes";

var initializeState = {
    total:0,
    balance: 0,
    isBalanceLoading: false,
    errorMessage: null,
    totalProfit: 0,
}

//Previous state, action => current state
export default function balanceReducer(state = initializeState, action) {
    switch (action.type) {
        case GET_TRADE_STYLE_SUCCESS:
            return { ...state, 
                totalProfit: action.payload.totalProfit
            };
        case GET_TRADE_STYLE_FAIL:
            return { ...state, 
                errorMessage: action.payload.errorMessage
            };
        case GET_BALANCE:
            return { ...state, isBalanceLoading: true,
                errorMessage: null
            };
        case GET_BALANCE_SUCCESS:
            return { ...state, 
                isBalanceLoading: false, 
                total: action.payload.total,
                balance: action.payload.balance,
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