import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (imageBase64String) => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        var url = NetConstants.CFD_API.SET_PORTRAIT;
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: imageBase64String,
                showLoading: true,
            }, (responseJson) => {
                resolve();
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });
}