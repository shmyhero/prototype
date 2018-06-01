import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default () => {
    return new Promise((resolve, reject) => {
        resolve(10);
        // var userData = LogicData.getUserData();
        // NetworkModule.fetchTHUrl(
        //     NetConstants.CFD_API.FOLLOW_TRADE_OPTIONS,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
        //             'Content-Type': 'application/json; charset=utf-8',
        //         },
        //         showLoading: true,
        //     }, (responseJson) => {
        //         resolve({
        //             availableInvestFixed: responseJson.investFixed,
        //             availableStopAfterCount: responseJson.stopAfterCount,
        //             investFixed: responseJson.investFixed[0], 
        //             stopAfterCount: responseJson.stopAfterCount[0],
        //         });
        //     }, (error) =>{
        //         reject(error.errorMessage);
        //     }
        // );
    });    
}