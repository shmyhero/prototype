import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (nickName) => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        var value = encodeURIComponent(nickName);
        console.log("value", value)
        var url = NetConstants.CFD_API.SET_NICKNAME.replace("<name>", value);
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                showLoading: true,
            }, (responseJson) => {
                resolve();
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });
}