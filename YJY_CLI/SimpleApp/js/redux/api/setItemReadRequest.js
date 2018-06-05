import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (id) => {
    return new Promise((resolve, reject) => {       
        var url = NetConstants.CFD_API.SET_MESSAGE_READ;
        url = url.replace("<id>", id);
    
        var userData = LogicData.getUserData();
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
                resolve(responseJson)
            }, (error) =>{
                reject(error.errorMessage);
            }
        );
    });
}