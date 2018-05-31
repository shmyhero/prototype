import {
    GET_MESSAGE_LIST,
    GET_MESSAGE_LIST_SUCCESS,
    GET_MESSAGE_LIST_ATTACH,
    GET_MESSAGE_LIST_ATTACH_SUCCESS,
    GET_MESSAGE_LIST_FAIL,
    SET_MESSAGE_READ,
} from "../constants/actionTypes";

var initializeState = {
    messageList: [],
    nextPage: 0,
    newMassageCount: 0,
    isRefreshing: false,
    isLoading: false,
    isEndReached: false,
}

//Previous state, action => current state
export default function settingsReducer(state = initializeState, action) {
    switch (action.type) {
        case GET_MESSAGE_LIST:
            state = { ...state,
                isRefreshing: true,
                isEndReached: false,
            }
            return state;
        case GET_MESSAGE_LIST_ATTACH:
            state = { ...state,
                isLoading: true,
            }
            return state;
        case GET_MESSAGE_LIST_SUCCESS:
            state = { ...state,
                messageList: action.payload.messageList,
                nextPage: action.payload.nextPage,
                isEndReached: action.payload.isEndReached,
                isRefreshing: false,
            }
            return state;
        case GET_MESSAGE_LIST_ATTACH_SUCCESS:
            state = { ...state,
                messageList: state.messageList.concat(action.payload.messageList),
                nextPage: action.payload.nextPage,
                isEndReached: action.payload.isEndReached,
                isLoading: false,
            }
            return state;
        case GET_MESSAGE_LIST_FAIL:
            state = { ...state,
                isLoading: false,
                isShowError: true,
                error: action.payload.error,
            }
            return state;
        case SET_MESSAGE_READ:
            state = { ...state,
                messageList: action.payload.messageList,
            }
            return state;
        default:
            return state;
    }
}