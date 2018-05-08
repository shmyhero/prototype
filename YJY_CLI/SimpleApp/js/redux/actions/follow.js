import {
    GET_FOLLOW_CONFIG_REQUEST,
    GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
    GET_FOLLOW_CONFIG_REQUEST_FAIL,
    SEND_FOLLOW_CONFIG_REQUEST,
    SEND_FOLLOW_CONFIG_REQUEST_SUCCESS,
    SEND_FOLLOW_CONFIG_REQUEST_FAIL,
    SHOW_FOLLOW_CONFIG_MODAL,
    UPDATE_FOLLOW_CONFIG,
    CHECK_AGREEMENT,
} from "../constants/action-types";

import setFollowConfigRequest from "../api/setFollowConfigRequest";
import getFollowConfigRequest from "../api/getFollowConfigRequest";

function getFollowConfigRequestSent() {
    return {
        type: GET_FOLLOW_CONFIG_REQUEST,
    };
}

function getFollowConfigSuccess(availableAmount, availableFrequency, amount, frequency) {
    console.log("getFollowConfigSuccess availableAmount", availableAmount)
    console.log("getFollowConfigSuccess availableFrequency", availableFrequency)
    console.log("getFollowConfigSuccess amount", amount)
    console.log("getFollowConfigSuccess frequency", frequency)
    return {
        type: GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
        payload: {
            availableAmount,
            availableFrequency,
            amount,
            frequency
        }
    }
}

function getFollowConfigFailure(errorMessage) {
    return {
        type: GET_FOLLOW_CONFIG_REQUEST_FAIL,
        payload: {
            errorMessage
        }
    }
}


function setFollowConfigRequestSent() {
    return {
        type: SEND_FOLLOW_CONFIG_REQUEST,
    };
}

function setFollowConfigSuccess(amount, frequency) {
    return {
        type: SEND_FOLLOW_CONFIG_REQUEST_SUCCESS,
        payload: {
            amount,
            frequency
        }
    }
}

function setFollowConfigFailure(errorMessage) {
    return {
        type: SEND_FOLLOW_CONFIG_REQUEST_FAIL,
        payload: {
            errorMessage
        }
    }
}

export function checkAgreement(isAgreementRead){
    return (dispatch) => {
        dispatch({
            type: CHECK_AGREEMENT,
            payload:{
                isAgreementRead
            }
        })        
    }
}

export function showFollowDialog(show, userId){
    return (dispatch) => {
        dispatch({
            type: SHOW_FOLLOW_CONFIG_MODAL,
            payload: {
                show,
                userId
            }
        })
    }
}

export function updateFollowConfig(amount, frequency){
    return (dispatch) => {
        dispatch({
            type: UPDATE_FOLLOW_CONFIG,
            payload: {
                amount,
                frequency
            }
        })        
    }
}

export function sendFollowConfigRequest(userId, amount, frequency) {
    return (dispatch) => {
        dispatch(setFollowConfigRequestSent())
        setFollowConfigRequest(userId, amount, frequency)
            .then(() => {
                dispatch(setFollowConfigSuccess(amount, frequency))
            })
            .catch((err) => {
                dispatch(setFollowConfigFailure(err));
            });
    }
}

export function getCurrentFollowConfig(){
    return (dispatch) => {
        dispatch(getFollowConfigRequestSent());
        getFollowConfigRequest()
            .then(data => {
                console.log("")
                dispatch(getFollowConfigSuccess(
                    data.availableAmount,
                    data.availableFrequency,
                    data.amount,
                    data.frequency));
            })
            .catch((err) => {
                dispatch(getFollowConfigFailure(err));
            });
    }
}