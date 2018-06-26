import {
    SWITCH_LANGUAGE,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAIL,
    GET_VERSION,
    RESET_SETTINGS,
    SET_LOACL_NICKNAME,
    SET_LOACL_NICKNAME_SUCCESS,
    SET_LOACL_NICKNAME_FAIL,
    UPDATE_MAX_NICKNAME_LENGTH
} from "../constants/actionTypes";

var initializeState = {
    maxNickNameLength: 0,
    isSettingNickName: false,
    isShowError: false,
    error: "",
    language: "",
    version: "",
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    switch (action.type) {
        case UPDATE_MAX_NICKNAME_LENGTH:
            state = {...state,
                maxNickNameLength: action.payload.maxLength};
            return state;
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