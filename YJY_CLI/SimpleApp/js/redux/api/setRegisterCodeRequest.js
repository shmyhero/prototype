import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (registerCode) => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        // var value = encodeURIComponent(nickName);
        var url = NetConstants.CFD_API.PUT_USER_CODE;
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    code: registerCode
                }),
                showLoading: true,
            }, (responseJson) => {
                resolve();
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });
}