import {
    SWITCH_LANGUAGE,
    SET_NICKNAME,
    SET_NICKNAME_SUCCESS,
    SET_NICKNAME_FAIL,
    SET_REGISTERCODE,
    SET_REGISTERCODE_SUCCESS,
    SET_REGISTERCODE_FAIL,
    GET_VERSION,
    RESET_SETTINGS,
    SET_LOACL_NICKNAME,
    SET_LOACL_NICKNAME_SUCCESS,
    SET_LOACL_NICKNAME_FAIL,
    UPDATE_MAX_NICKNAME_LENGTH,
    SET_BALANCE_TYPE,
    GET_BALANCE_TYPE_SETTING_SUCCESS
} from "../constants/actionTypes";

var initializeState = {
    maxNickNameLength: 0,
    isSettingNickName: false,
    isShowError: false,
    error: "",
    language: "",
    version: "",
    balanceType: "BTH",
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    switch (action.type) {
        case SET_BALANCE_TYPE:
            state = {...state,
                balanceType: action.payload.balanceType
            };
            return state;
        case GET_BALANCE_TYPE_SETTING_SUCCESS:
            state = {...state,
                balanceTypeSettings: action.payload.balanceTypeSettings
            };
            return state;
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

        case SET_REGISTERCODE:
            state = { ...state,
                isSettingRegisterCode: true,
            }
            return state;
        case SET_REGISTERCODE_SUCCESS:
            state = { ...state,
                isSettingRegisterCode: false,
            }
            return state;
        case SET_REGISTERCODE_FAIL:
            state = { ...state,
                isSettingRegisterCode: false,
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