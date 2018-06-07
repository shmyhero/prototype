import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (currentPage, itemCount) => {
    return new Promise((resolve, reject) => {       
        var url = NetConstants.CFD_API.GET_MESSAGES;        
        url = url.replace("<pageNum>", currentPage)
        url = url.replace("<pageSize>", itemCount)
    
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                showLoading: true,
				cache: 'offline',
            }, (responseJson) => {
                resolve(responseJson)
            }, (error) =>{
                console.log("error.errorMessage", error.errorMessage)
                reject(error.errorMessage);
            }
        );
    });
}