import {
    GET_MESSAGE_LIST,
    GET_MESSAGE_LIST_SUCCESS,
    GET_MESSAGE_LIST_ATTACH,
    GET_MESSAGE_LIST_ATTACH_SUCCESS,
    GET_MESSAGE_LIST_FAIL,
    SET_MESSAGE_READ,
    UPDATE_UNREAD,
} from "../constants/actionTypes";

import fetchMessageListRequest from '../api/fetchMessageListRequest';
import getUnreadMessagesRequest from '../api/getUnreadMessagesRequest';
import setItemReadRequest from '../api/setItemReadRequest';

export function getMessageList(currentPage, data){
    var isLoading = data.isLoading;
    var isRefreshing = data.isRefreshing;
    var isEndReached = data.isEndReached;
    if((currentPage == 0)||((currentPage != 0 && !isLoading))&& !isEndReached) {
        const LIST_PAGE_ITEM = 20;
        return (dispatch) => {
            if(currentPage == 0){
                dispatch({
                    type: GET_MESSAGE_LIST,            
                });
            }else{
                dispatch({
                    type: GET_MESSAGE_LIST_ATTACH,            
                });
            }
            fetchMessageListRequest(currentPage+1, LIST_PAGE_ITEM,
                (messageList)=>{
                    var payload = {
                        nextPage: currentPage+1,
                        messageList,
                        isEndReached: messageList.length != LIST_PAGE_ITEM
                    }
                    if(currentPage == 0){
                        dispatch({
                            type: GET_MESSAGE_LIST_SUCCESS,
                            payload: payload
                        })
                    }else{
                        dispatch({
                            type: GET_MESSAGE_LIST_ATTACH_SUCCESS,
                            payload: payload
                        })
                    }
                }, (error)=>{
                dispatch({
                    type: GET_MESSAGE_LIST_FAIL,
                    payload: {
                        error
                    }
                })
            })
        }
    }
    return (dispatch) => {}
}

export function setMessageRead(rowIndex, messageList){
    return (dispatch) => {
        if(!messageList[rowIndex].isRead){
            setItemReadRequest(messageList[rowIndex].id)
            .then(()=>{})
            .catch(()=>{});
            setTimeout(()=>{
                messageList[rowIndex].isRead = true;
                var newMessageList = [];
                $.extend(true, newMessageList, messageList);
                dispatch({
                    type: SET_MESSAGE_READ,
                    payload: {
                        messageList:newMessageList,
                    }          
                })
            }, 1);
        }        
    }
}

export function updateUnread(){
    return (dispatch) => {
        getUnreadMessagesRequest().then((count)=>{
            dispatch({
                type: UPDATE_UNREAD,
                payload:{
                    unread: count,
                }
            })
        }).catch((error)=>{

        })
    }
}