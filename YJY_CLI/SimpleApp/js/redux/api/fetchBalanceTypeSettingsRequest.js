import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (successCallback, failureCallback) => {
    var userData = LogicData.getUserData();     
    NetworkModule.fetchTHUrl(
        NetConstants.CFD_API.BALANCE_TYPE_SETTINGS,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
            },
            cache: 'offline',
        },(responseJson)=>{
            successCallback && successCallback(responseJson)
        },(error)=>{
            failureCallback && failureCallback(error.errorMessage)
        });
}