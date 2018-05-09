import {
    GET_ME_DATA,
    GET_ME_DATA_SUCCESS,
    GET_ME_DATA_FAIL,
    CHECK_LOGIN_STATE_LOGGED_IN,
    CHECK_LOGIN_STATE_NOT_LOGGED_IN} from "../constants/actionTypes";

var initializeState = {
    userLoggedin: false,
    nickname: "",
    avatarSource: require('../../../images/head_portrait.png'),
    isLoading: false,
    errorMessage: null,
    thtAddress: "",
}

//Previous state, action => current state
export default function meDataReducer(state = initializeState, action) {
    console.log("meDataReducer action ", action)
    console.log("meDataReducer state ", state)
    console.log("CHECK_LOGIN_STATE_LOGGED_IN", CHECK_LOGIN_STATE_LOGGED_IN)
    switch (action.type) {
        case CHECK_LOGIN_STATE_LOGGED_IN:
            state = { ...state,
                userLoggedin: true
            }
            console.log("meDataReducer newstate ", state)
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
                nickname: action.payload.data.nickname,
                avatarSource: {uri: action.payload.data.picUrl},
                thtAddress: action.payload.data.thtAddress,
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