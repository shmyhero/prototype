import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default async (balanceType) => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        var url = NetConstants.CFD_API.BALANCE_TYPE;
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({"balanceType": balanceType}),
                showLoading: true,
            }, (responseJson) => {
                resolve();
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });
}