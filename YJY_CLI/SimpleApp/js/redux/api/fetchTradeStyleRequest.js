import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default () => {
    return new Promise((resolve, reject) => {
        var userData = LogicData.getUserData();
        var url = NetConstants.CFD_API.PERSONAL_PAGE_TRADESTYLE;
        url = url.replace('<id>', userData.userId)
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