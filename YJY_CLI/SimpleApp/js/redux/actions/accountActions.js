import LogicData from '../../LogicData';
import { CHECK_LOGIN_STATE_LOGGED_IN, CHECK_LOGIN_STATE_NOT_LOGGED_IN } from "../constants/actionTypes";

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

export function checkIsLoggedIn(isLoggedIn, notLoggedIn) {
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

export function logOut(){
    return (dispatch) => {
        LogicData.logout(()=>{
            dispatch(NotLogin());
        });
    }
}
