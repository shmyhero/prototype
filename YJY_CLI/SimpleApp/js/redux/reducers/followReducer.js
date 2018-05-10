import {
    UPDATE_FOLLOW_CONFIG,
    SEND_FOLLOW_CONFIG_REQUEST, 
    SEND_FOLLOW_CONFIG_REQUEST_SUCCESS, 
    SEND_FOLLOW_CONFIG_REQUEST_FAIL,
    GET_FOLLOW_CONFIG_REQUEST,
    GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
    GET_FOLLOW_CONFIG_REQUEST_FAIL,
    SEND_CANCLE_COPY_REQUEST,
    SEND_CANCLE_COPY_REQUEST_SUCCESS ,
    SEND_CANCLE_COPY_REQUEST_FAIL,
    CHECK_AGREEMENT,
    SHOW_FOLLOW_CONFIG_MODAL,
    RESET_USER_INFO
} from "../constants/actionTypes";

var initializedFollowTrade = {
    investFixed: 0,
    stopAfterCount: 0,
}

var initializeState = {
    userId: 0,
    modalVisible: false,
    followTrade: {
        ...initializedFollowTrade,
    },
    newFollowTrade: {
        ...initializedFollowTrade,
    },
    isLoading: false,
    errorMessage: null,
    availableInvestFixed: [10,20],
    availableStopAfterCount: [1,2,3,4,5],
    isAgreementRead: true,
    valueChanged: false,
    followConfigButtonEnable: false,
    isFollowing: false,
}

function isFollowing(state){
    return state.followTrade 
        && state.followTrade.investFixed > 0 
        && state.followTrade.stopAfterCount > 0;
}

function isFollowConfigButtonEnable(state){
    return state.newFollowTrade 
        && state.newFollowTrade.investFixed != state.followTrade.investFixed
        && state.newFollowTrade.stopAfterCount != state.followTrade.stopAfterCount
        && state.isAgreementRead
        && !state.isLoading;
}

//Previous state, action => current state
export default function followReducer(state = initializeState, action) {
    var newState = {...state};
    switch (action.type) {
        case RESET_USER_INFO:
            var followTrade = action.payload.followTrade ? action.payload.followTrade : initializedFollowTrade;
            newState = { ...initializeState, 
                userId: action.payload.userId,
                followTrade: followTrade,
                newFollowTrade: followTrade,
            };
            break;
        case SEND_CANCLE_COPY_REQUEST:
            newState = { ...newState, 
                isLoading: true,
            };
            break;
        case SEND_CANCLE_COPY_REQUEST_SUCCESS:
            newState = { ...newState, 
                isLoading: false,
                followTrade: {
                    ...initializedFollowTrade,
                },
            };
            break;
        case SEND_CANCLE_COPY_REQUEST_FAIL:
            newState = { ...newState, 
                isLoading: false,
            };
            break;
        case GET_FOLLOW_CONFIG_REQUEST:
            newState = { ...newState, 
                isLoading: true,
            };
            break;           
        case GET_FOLLOW_CONFIG_REQUEST_SUCCESS:
            var newFollowTrade = followTrade;
            if(!newFollowTrade || newFollowTrade.investFixed == 0 || investFixed.stopAfterCount == 0){
                newFollowTrade = { 
                    investFixed: action.payload.investFixed,
                    stopAfterCount: action.payload.stopAfterCount
                }
            }
            newState = { ...newState, 
                isLoading: false,
                availableInvestFixed: action.payload.availableInvestFixed,
                availableStopAfterCount: action.payload.availableStopAfterCount,
                newFollowTrade,
            };
            break;
        case GET_FOLLOW_CONFIG_REQUEST_FAIL:
            newState = { ...newState, 
                isLoading: false,
            };
            break;
        case CHECK_AGREEMENT:
            var isAgreementRead = action.payload.isAgreementRead;
            newState = { ...newState, 
                isAgreementRead: isAgreementRead,
            };
        case SHOW_FOLLOW_CONFIG_MODAL:
            newState = { ...newState,
                modalVisible: action.payload.show,
            }
            break;
        case UPDATE_FOLLOW_CONFIG:
            newState = { ...newState, 
                newFollowTrade: {
                    investFixed: action.payload.investFixed,
                    stopAfterCount: action.payload.stopAfterCount,
                },
                errorMessage: null,
            };
            break;
        case SEND_FOLLOW_CONFIG_REQUEST:
            var newState = { ...newState, 
                isLoading: true,
                errorMessage: null
            };
            break;
        case SEND_FOLLOW_CONFIG_REQUEST_SUCCESS:
            newState = { ...newState, 
                isLoading: false,
                followTrade: {
                    investFixed: action.payload.investFixed,
                    stopAfterCount: action.payload.stopAfterCount,
                },
                errorMessage: null,
            };
            break;
        case SEND_FOLLOW_CONFIG_REQUEST_FAIL:
            newState = { ...newState, 
                isLoading: false,
                errorMessage: action.payload.errorMessage
            };
            break;
        default:
            return state;
    }
    newState.followConfigButtonEnable = isFollowConfigButtonEnable(newState);
    return newState;
}