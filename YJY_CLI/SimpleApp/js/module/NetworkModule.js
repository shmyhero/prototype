
var CacheModule = require('./CacheModule')

import React from 'react';
import {
	Alert,
	Platform
} from 'react-native';

import LogicData from "../LogicData";
export const API_ERROR = 'apiError';
export const NETWORK_CONNECTION_ERROR = 'networkConnectionError';

var {EventCenter, EventConst} = require('../EventCenter');

var loginOutsideAlertShown = false
export function fetchTHUrl(url, params, successCallback, errorCallback, notShowResponseLog) {
	var requestSuccess = true;

	console.log('fetching: ' + url + ' with params: ')
	console.log(params)

	var result = {
		error: null,
		errorMessage: null,
		loadedOfflineCache: false,
	}

	if(params.cache === "offline"){
		CacheModule.loadCacheForUrl(url)
		.then((value)=>{
			if(value){
				console.log("read offline cache: " + value)
				var respJson = JSON.parse(value);
				result.loadedOfflineCache = true;
				successCallback(respJson, true);
			}
		});
	}

	if(! params.headers){
		params.headers = {};
	}
	
	params.headers['User-Agent'] = Platform.OS;
	params.headers['Accept-Language'] = LogicData.getLanguage();
	console.log("url params", params)

	fetch(url, params)
		.then((response) => {
			if (response.status === 200) {
				requestSuccess = true;
			} else if (response.status === 401){
				throw new Error('身份验证失败')
			} else{
				requestSuccess = false;
			}

			if (response.length == 0) {
				response = '{}'
			}
			return response.json()
		})
		.then((responseJson) => {
			if (requestSuccess) {
				if (responseJson != null && responseJson.success === false) {
					console.log('fetchTHUrl ' + url + ' handled error with message: ' + JSON.stringify(responseJson))
					result.error = API_ERROR;
					result.errorMessage = responseJson.ExceptionMessage || responseJson.Message || responseJson.message;
					errorCallback && errorCallback(result);
				} else {
					if(!notShowResponseLog){
						console.log('fetchTHUrl ' + url + ' success with response: ')
						console.log(responseJson)
					}

					if(params.cache === "offline"){
						var userRelated = false;
						if(params.headers && params.headers.Authorization){
							userRelated = true;
						}
						CacheModule.storeCacheForUrl(url, JSON.stringify(responseJson), userRelated)
						.then(()=>{
							console.log('stored offline cache ')
							successCallback && successCallback(responseJson, false);
						})
					}else{
						successCallback && successCallback(responseJson, false);
					}
				}
			} else {
				console.log('fetchTHUrl unhandled error with message: ' + JSON.stringify(responseJson))
				result.error = NETWORK_CONNECTION_ERROR;
				result.errorMessage = responseJson.ExceptionMessage || responseJson.Message || responseJson.message;
				errorCallback && errorCallback(result);
			}
		})
		.catch((e) => {
			console.log('fetchTHUrl catches: ' + e + ", " + url);

			if(e.message=='身份验证失败'){
				var userData = LogicData.getUserData();
				if (Object.keys(userData).length !== 0) {
					console.log('多点登录 = ' + e);
					if (!loginOutsideAlertShown) {
						loginOutsideAlertShown = true
	 					Alert.alert('风险提示！', '盈交易账号已登录其他设备', [{text: '我知道了', onPress: () => {
							loginOutsideAlertShown = false;
	 						EventCenter.emitAccountLoginOutSideEvent();
						}}],{cancelable:false})
					};
				}
			}
			var message = e.message

			// if(params.cache === "offline"){
			// 	CacheModule.loadCacheForUrl(url)
			// 	.then((value)=>{
			// 		if(value){
			// 			var respJson = JSON.parse(value);
			// 			successCallback(respJson);
			// 		}else{
			// 			if(message.toLowerCase() === "network request failed"){
			// 				message = "网络连接已断开，请检查设置"
			// 			}
			// 			if(internetErrorCallback){
			// 				internetErrorCallback(message);
			// 			}
			// 			else if (!alertShow) {
			// 				alertShow = true
			// 				Alert.alert('', message, [{text: 'OK', onPress: () => alertShow=false}])
			// 			};
			// 		}
			// 	});
			// }

			if(message.toLowerCase() === "network request failed"){
				message = "网络连接已断开，请检查设置"
			}
			console.log(message);
			if(errorCallback){
				result.error = API_ERROR;
				result.errorMessage = message;
				errorCallback && errorCallback(result);
			}
		})
		.done(() => {
			
		});
}
