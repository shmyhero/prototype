import {
    UPDATE_FOLLOW_CONFIG,
    SEND_FOLLOW_CONFIG_REQUEST, 
    SEND_FOLLOW_CONFIG_REQUEST_SUCCESS, 
    SEND_FOLLOW_CONFIG_REQUEST_FAIL,
    GET_FOLLOW_CONFIG_REQUEST,
    GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
    GET_FOLLOW_CONFIG_REQUEST_FAIL,
    CHECK_AGREEMENT,
    SHOW_FOLLOW_CONFIG_MODAL
} from "../constants/action-types";

var initializeState = {
    userId: 0,
    modalVisible: false,
    amount: 0,
    frequency: 0,
    isLoading: false,
    errorMessage: null,
    availableAmount: [10,20],
    availableFrequency: [1,2,3,4,5],
    isAgreementRead: true,
    valueChanged: false,
    buttonEnable: false,
}

function isButtonEnable(state){
    return state.valueChanged && state.isAgreementRead && !state.isLoading;
}

//Previous state, action => current state
export default function followReducer(state = initializeState, action) {
    var newState = {...state};
    switch (action.type) {
        case GET_FOLLOW_CONFIG_REQUEST:
            newState = { ...newState, 
                isLoading: true,
            };
            break;           
        case GET_FOLLOW_CONFIG_REQUEST_SUCCESS:
            newState = { ...newState, 
                isLoading: false,
                availableAmount: action.payload.availableAmount,
                availableFrequency: action.payload.availableFrequency,
                amount: action.payload.amount,
                frequency: action.payload.frequency,
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
                userId: action.payload.userId,
            }
            break;
        case UPDATE_FOLLOW_CONFIG:
            var valueChanged = state.valueChanged
            if(!state.valueChanged
                && (state.amount != action.payload.amount 
                    || state.frequency != action.payload.frequency)){
                valueChanged = true;
            }
            newState = { ...newState, 
                amount: action.payload.amount,
                frequency: action.payload.frequency,
                errorMessage: null,
                valueChanged: valueChanged,
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
                valueChanged: false,
                errorMessage: null
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
    newState.buttonEnable = isButtonEnable(newState);
    return newState;
}