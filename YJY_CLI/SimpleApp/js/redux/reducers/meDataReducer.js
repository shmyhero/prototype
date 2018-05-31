import {
    GET_ME_DATA,
    GET_ME_DATA_SUCCESS,
    GET_ME_DATA_FAIL,
    CHECK_LOGIN_STATE_LOGGED_IN,
    CHECK_LOGIN_STATE_NOT_LOGGED_IN,
    BIND_WALLET_ADDRESS,
    SET_PORTRAIT,
    UPLOAD_PORTRAIT_SUCCESS,
    UPLOAD_PORTRAIT_FAILURE,
    SET_NICKNAME_SUCCESS
} from "../constants/actionTypes";

var initializeState = {
    userId: 0,
    userLoggedin: false,
    nickname: "",
    avatarSource: require('../../../images/head_portrait.png'),
    isLoading: false,
    errorMessage: null,
    thtAddress: "",
    phone: "",
}

//Previous state, action => current state
export default function meDataReducer(state = initializeState, action) {
    switch (action.type) {
        case SET_PORTRAIT:
            state = { ...state,
                avatarSource: action.payload.avatarSource,
            }
            return state;
        case UPLOAD_PORTRAIT_SUCCESS:
            state = { ...state,
                
            }
            return state;
        case SET_NICKNAME_SUCCESS:
            state = { ...state,
                nickname: action.payload.nickName
            }
            return state;
        case UPLOAD_PORTRAIT_FAILURE:
            return state;
        case BIND_WALLET_ADDRESS:
            state = { ...state,
                thtAddress: action.payload.thtAddress,
            }
            return state;
        case CHECK_LOGIN_STATE_LOGGED_IN:
            state = { ...state,
                userLoggedin: true
            }
            return state;
        case CHECK_LOGIN_STATE_NOT_LOGGED_IN:
            return { ...initializeState,
                userLoggedin: false, 
            };
        case GET_ME_DATA:
            return { ...state,
                isLoading: true,
            };
        case GET_ME_DATA_SUCCESS:
            return { ...state,
                userId: action.payload.data.id,
                nickname: action.payload.data.nickname,
                avatarSource: {uri: action.payload.data.picUrl},
                thtAddress: action.payload.data.thtAddress,
                phone: action.payload.data.phone,
                isLoading: false,
            };
        case GET_ME_DATA_FAIL:
            return {
                ...state,
                errorMessage: action.payload.errorMessage,
                isLoading: false,
            };
        default:
            return state;
    }
}