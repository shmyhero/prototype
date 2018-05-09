import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default () => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        setTimeout(()=>{
            var responseJson = {
                availableAmount: [10,20,50,100],
                availableFrequency: [1,2,3,4,5],
                investFixed: 30,
                stopAfterCount: 5,
            }
            resolve(
                responseJson);
        }, 1000);        
    });
}