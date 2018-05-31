import {
    SWITCH_LANGUAGE,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAIL
} from "../constants/actionTypes";

var initializeState = {
    isSettingNickName: false,
    isShowError: false,
    error: "",
    language: "",
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    console.log("settingsReducer action ", action)
    console.log("settingsReducer state ", state)
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
        case SET_NICKNAME_FAIL:
            state = { ...state,
                isSettingNickName: false,
                isShowError: action.payload.isShowError,
                error: action.payload.error,
            }
            return state;

        case SWITCH_LANGUAGE:
            state = { ...state,
                language: action.payload.language,
            }
            return state;
        default:
            return state;
    }
}