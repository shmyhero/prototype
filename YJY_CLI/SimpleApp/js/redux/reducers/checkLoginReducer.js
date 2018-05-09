import { CHECK_LOGIN_STATE_LOGGED_IN, CHECK_LOGIN_STATE_NOT_LOGGED_IN } from "../constants/actionTypes";

var initializeState = {
    userLoggedin: false
}

//Previous state, action => current state
export default function checkLoginReducerReducer(state = initializeState, action) {
    switch (action.type) {
        case CHECK_LOGIN_STATE_LOGGED_IN:
            return { ...state, userLoggedin: true, };        
        case CHECK_LOGIN_STATE_NOT_LOGGED_IN:
            return { ...state, userLoggedin: false, };
        default:
            return state; 
    }
}