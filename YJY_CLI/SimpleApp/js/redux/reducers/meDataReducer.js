import {GET_ME_DATA, GET_ME_DATA_SUCCESS, GET_ME_DATA_FAIL, CHECK_LOGIN_STATE_NOT_LOGGED_IN } from "../constants/action-types";

var initializeState = {
    nickname: "",
    avatarSource: require('../../../images/head_portrait.png'),
    isLoading: false,
    errorMessage: null,
}

//Previous state, action => current state
export default function meDataReducer(state = initializeState, action) {

    switch (action.type) {
        case GET_ME_DATA:
            return { ...initializeState,
                isLoading: true,
            };
        case GET_ME_DATA_SUCCESS:
            console.log("GET_ME_DATA_SUCCESS", action.payload)
            return { ...state,
                nickname: action.payload.data.nickname,
                avatarSource: {uri: action.payload.data.picUrl},
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