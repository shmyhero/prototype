import {
    GET_FOLLOW_CONFIG_REQUEST,
    GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
    GET_FOLLOW_CONFIG_REQUEST_FAIL,
    SEND_FOLLOW_CONFIG_REQUEST,
    SEND_FOLLOW_CONFIG_REQUEST_SUCCESS,
    SEND_FOLLOW_CONFIG_REQUEST_FAIL,
    SEND_UNFOLLOW_REQUEST,
    SEND_UNFOLLOW_REQUEST_SUCCESS,
    SEND_UNFOLLOW_REQUEST_FAIL,
    SHOW_FOLLOW_CONFIG_MODAL,
    UPDATE_FOLLOW_CONFIG,
    CHECK_AGREEMENT,
    RESET_USER_INFO,
} from "../constants/actionTypes";

import setFollowConfigRequest from "../api/setFollowConfigRequest";
import getFollowConfigRequest from "../api/getFollowConfigRequest";
import unFollowRequest from "../api/unFollowRequest";

function getFollowConfigRequestSent() {
    return {
        type: GET_FOLLOW_CONFIG_REQUEST,
    };
}

function getFollowConfigSuccess(availableInvestFixed, availableStopAfterCount, investFixed, stopAfterCount) {
    return {
        type: GET_FOLLOW_CONFIG_REQUEST_SUCCESS,
        payload: {
            availableInvestFixed,
            availableStopAfterCount,
            investFixed,
            stopAfterCount
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

function setFollowConfigSuccess(investFixed, stopAfterCount) {
    return {
        type: SEND_FOLLOW_CONFIG_REQUEST_SUCCESS,
        payload: {
            investFixed,
            stopAfterCount
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

function unFollowRequestSent() {
    return {
        type: SEND_UNFOLLOW_REQUEST,
    };
}

function unFollowSuccess() {
    return {
        type: SEND_UNFOLLOW_REQUEST_SUCCESS
    }
}

function unFollowFailure(errorMessage) {
    return {
        type: SEND_UNFOLLOW_REQUEST_FAIL,
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

export function resetUserInfo(userId, followTrade){
    return (dispatch) => {        
        dispatch({
            type: RESET_USER_INFO,
            payload:{
                userId,
                followTrade
            }
        })        
    }
}

export function showFollowDialog(show){
    return (dispatch) => {
        dispatch({
            type: SHOW_FOLLOW_CONFIG_MODAL,
            payload: {
                show
            }
        })
    }
}

export function updateFollowConfig(investFixed, stopAfterCount){
    return (dispatch) => {
        dispatch({
            type: UPDATE_FOLLOW_CONFIG,
            payload: {
                investFixed,
                stopAfterCount
            }
        })        
    }
}

export function sendFollowConfigRequest(userId, followTrade) {
    return (dispatch) => {
        dispatch(setFollowConfigRequestSent())
        setFollowConfigRequest(userId, followTrade)
            .then(() => {
                dispatch(setFollowConfigSuccess(followTrade.investFixed, followTrade.stopAfterCount))
                dispatch(showFollowDialog(false));
            })
            .catch((err) => {
                dispatch(setFollowConfigFailure(err));
            });
    }
}

export function sendUnFollowRequest(userId) {
    return (dispatch) => {
        dispatch(unFollowRequestSent())
        unFollowRequest(userId)
            .then(() => {
                dispatch(unFollowSuccess())
            })
            .catch((err) => {
                dispatch(unFollowFailure(err));
            });
    }
}

export function getCurrentFollowConfig(){
    return (dispatch) => {
        dispatch(getFollowConfigRequestSent());
        getFollowConfigRequest()
            .then(data => {
                dispatch(getFollowConfigSuccess(
                    data.availableInvestFixed,
                    data.availableStopAfterCount,
                    data.investFixed,
                    data.stopAfterCount));
            })
            .catch((err) => {
                dispatch(getFollowConfigFailure(err));
            });
    }
}