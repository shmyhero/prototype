import LogicData from '../../LogicData';
import { CHECK_LOGIN_STATE_LOGGED_IN, CHECK_LOGIN_STATE_NOT_LOGGED_IN } from "../constants/action-types";

export function HasLogin() {
    return {
        type: CHECK_LOGIN_STATE_LOGGED_IN        
    }
}

export function NotLogin() {
    return {
        type: CHECK_LOGIN_STATE_NOT_LOGGED_IN
    }
}

export function checkIsLoggedIn(isLoggedIn: Function, notLoggedIn: Function) {
    return (dispatch) => {
        if(!LogicData.isLoggedIn()){
            console.log("checkIsLoggedIn NotLogin")
            dispatch(NotLogin());
            notLoggedIn && notLoggedIn();
        }else{
            console.log("checkIsLoggedIn Login")
            dispatch(HasLogin());
            isLoggedIn && isLoggedIn();
        }
    }
}