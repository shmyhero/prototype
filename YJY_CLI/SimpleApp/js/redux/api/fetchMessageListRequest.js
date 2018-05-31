import LogicData from '../../LogicData';
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require("../../NetConstants");

export default (currentPage, itemCount) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            var list = []
            if(currentPage ==2){
                itemCount = 3;
            }
            for (var i = 0; i < itemCount; i++){
                list.push({
                    title: "平仓消息" + i + currentPage,
                    body: "这是一条测试消息！",
                    createdAt: '2018-05-04T08:42:03.407',
                })
            }
            resolve(list);
        }, 1000);
       
        //var userData = LogicData.getUserData();
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