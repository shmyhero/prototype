import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default () => {
    return new Promise((resolve, reject) => {
        var url = NetConstants.CFD_API.USER_FUND_BALANCE;
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                },
            },(responseJson)=>{
                resolve(responseJson)
            },(error)=>{
                reject(error.errorMessage)
            });
    })
}