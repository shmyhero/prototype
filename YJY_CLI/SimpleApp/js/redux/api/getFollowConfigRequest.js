import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (amount, frequency) => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        setTimeout(()=>{
            var responseJson = {
                availableAmount: [10,20,50,100],
                availableFrequency: [1,2,3,4,5],
                amount: 30,
                frequency: 5,
            }
            resolve(
                responseJson);
        }, 1000);
        // NetworkModule.fetchTHUrl(
        //     NetConstants.CFD_API.ME_DATA,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
        //             'Content-Type': 'application/json; charset=utf-8',
        //         },
        //         showLoading: true,
        //     }, (responseJson) => {	
        //         console.log("fetchmedataRequest", responseJson)				
        //         LogicData.setMeData(responseJson);
        //         resolve(responseJson)
        //     }, (error) =>{
        //         reject(error.errorMessage);
        //     }
        // );
    });
}