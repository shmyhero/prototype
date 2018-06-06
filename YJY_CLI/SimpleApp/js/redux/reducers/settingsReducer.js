import {
    SWITCH_LANGUAGE,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAIL,
    GET_VERSION,
    RESET_SETTINGS,
    SET_LOACL_NICKNAME,
    SET_LOACL_NICKNAME_SUCCESS,
    SET_LOACL_NICKNAME_FAIL
} from "../constants/actionTypes";

var initializeState = {
    isSettingNickName: false,
    isShowError: false,
    error: "",
    language: "",
    version: "",
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    console.log("settingsReducer action ", action)
    console.log("settingsReducer state ", state)
    switch (action.type) {

        case SET_LOACL_NICKNAME:
            state = { ...state,
                isShowError: false,
                error: "",
            }
            return state;
        case SET_LOACL_NICKNAME_FAIL:
            state = { ...state,
                isShowError: true,
                error: action.payload.error,
            }
            return state;
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
        case SET_NICKNAME_FAIL:
            state = { ...state,
                isSettingNickName: false,
                isShowError: true,
                error: action.payload.error,
            }
            return state;
        case SWITCH_LANGUAGE:
            state = { ...state,
                language: action.payload.language,
            }
            return state;
        case GET_VERSION:
            state = { ...state,
                version: action.payload.version,
            }
            return state;
        default:
            return state;
    }
}