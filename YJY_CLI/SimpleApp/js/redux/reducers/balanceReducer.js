import {GET_BALANCE, GET_BALANCE_SUCCESS, GET_BALANCE_FAIL } from "../constants/actionTypes";

var initializeState = {
    balance: 0,
    isLoading: false,
    errorMessage: null,
}

//Previous state, action => current state
export default function balanceReducer(state = initializeState, action) {
    switch (action.type) {
        case GET_BALANCE:
            return { ...state, isLoading: true,
                errorMessage: null
            };
        case GET_BALANCE_SUCCESS:
            return { ...state, 
                isLoading: false, 
                balance: action.payload.data,
                errorMessage: null
            };
        case GET_BALANCE_FAIL:
            return {
                ...state,
                isLoading: false,
                errorMessage: action.payload.errorMessage
            };
        default:
            return state;
    }
}