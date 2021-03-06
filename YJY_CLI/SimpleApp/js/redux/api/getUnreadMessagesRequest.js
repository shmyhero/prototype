import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default () => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.GET_UNREAD_MESSAGE_COUNT,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                showLoading: true,
            }, (responseJson) => {
                resolve(responseJson);
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });    
}