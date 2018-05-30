import {
    GET_ME_DATA,
    GET_ME_DATA_SUCCESS,
    GET_ME_DATA_FAIL,
    CHECK_LOGIN_STATE_LOGGED_IN,
    CHECK_LOGIN_STATE_NOT_LOGGED_IN,
    BIND_WALLET_ADDRESS,
    SWITCH_LANGUAGE,
    SET_PORTRAIT,
    UPLOAD_PORTRAIT_SUCCESS,
    UPLOAD_PORTRAIT_FAILURE,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAILURE
} from "../constants/actionTypes";

var initializeState = {
    isSettingNickName: false,
    isShowError: false,
    error: "",
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    console.log("meDataReducer action ", action)
    console.log("meDataReducer state ", state)
    console.log("CHECK_LOGIN_STATE_LOGGED_IN", CHECK_LOGIN_STATE_LOGGED_IN)
    switch (action.type) {
        case SET_NICKNAME:
            state = { ...state,
                isSettingNickName: true,
            }
            return state;
        case SET_NICKNAME_SUCCESS:
            state = { ...state,
                isSettingNickName: false,
            }
            return state;
        case SET_NICKNAME_FAILURE:
            state = { ...state,
                isSettingNickName: false,
                isShowError: action.payload.isShowError,
                error: action.payload.error,
            }
            return state;
        default:
            return state;
    }
}