import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");
var StorageModule = require("../../module/StorageModule");

export default () => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.ME_DATA,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                showLoading: true,
            }, (responseJson) => {                
                LogicData.setMeData(responseJson);
                StorageModule.setMeData(JSON.stringify(responseJson));
                resolve(responseJson)
            }, (error) =>{
                reject(error.errorMessage);
            }
        );}
    );
}