'use strict'

require('../utils/jquery-1.6.4')
require('../utils/jquery.signalR-2.2.0')

import React from 'react';
import {
	Alert,
	NetInfo,
	Platform,
} from 'react-native';

import LogicData from '../LogicData';

var AppStateModule = require('./AppStateModule');
var StorageModule = require('./StorageModule')
var CacheModule = require('./CacheModule')
var {EventCenter, EventConst} = require('../EventCenter');
var NetConstants = require('../NetConstants');

var serverURL = NetConstants.CFD_API_SERVER;
var stockPriceServerName = 'Q'
var subscribeStock = 'S';
var alertServerName = 'A'
var serverListenerName = 'p'
var previousInterestedStocks = null
var webSocketConnection = null
var stockPriceWebSocketProxy = null
var alertWebSocketProxy = null
var wsStockInfoCallback = null
var wsAlertCallback = null

var socketConnected = false;
var networkConnectionStatus = DISCONNECTED;

const CONNECTED = "connected";
const DISCONNECTED = "disconnected";

var wsErrorCallback = (errorMessage) =>
{
	if (AppStateModule.getAppState() === AppStateModule.STATE_ACTIVE && webSocketConnection && webSocketConnection.state == 4) {
		var previousSocketConnected = socketConnected;
		socketConnected = false;
		if(previousSocketConnected){
			EventCenter.emitNetworkConnectionChangedEvent();
		}
		if(networkConnectionStatus === CONNECTED){
			console.log('web socket ready to restart');
			setTimeout(()=>{
				if (webSocketConnection && webSocketConnection.state == 4){
					start();
				}
			}, 5000);
		}else{
			console.log('web socket no network connection.');
			//Do nothing until the device is online.
		}
	}
}

AppStateModule.registerTurnToActiveListener(() => {
	console.log('App is back again. Always restart the socket')
	start();
})

AppStateModule.registerTurnToBackgroundListener(() => {
	console.log('App move to background. Stop Web sockets.')
	stop();
})

export function isConnected(){
	return socketConnected;
}
//34821,34847
export function start() {
	stop();

	console.log('start web socket');

	NetInfo.addEventListener(
	  'connectionChange',
	  handleConnectivityChange
	);

	// var connection = $.hubConnection('http://yjy-webapi.chinacloudapp.cn');
	// var hub = connection.createHubProxy('Q');

	// connection.start().done(()=>{
	// 	console.log("socket ok")
	// }).fail(()=>{
	// 	console.log("socket failed")
	// });

	// return;

	webSocketConnection = $.hubConnection(NetConstants.CFD_API_SERVER);
	webSocketConnection.disconnected(function() {
		wsErrorCallback('网络已断开。')
	});

	webSocketConnection.logging = false;

	//connection-handling
	webSocketConnection.connectionSlow(function () {
		wsErrorCallback('网络不稳定。webSocketConnection.state: ' + webSocketConnection.state)
	});

	webSocketConnection.error(function (error) {
		wsErrorCallback('网络错误。' + error)
	});

	stockPriceWebSocketProxy = webSocketConnection.createHubProxy(stockPriceServerName);

	//receives broadcast messages from a hub function, called "broadcastMessage"
	// StockInfo data structure: {"Symbol":"MSFT","Price":31.97,"DayOpen":30.31,"Change":1.66,"PercentChange":0.0519}
	stockPriceWebSocketProxy.on(serverListenerName, (stockInfo) => {
		console.log("socketUpdate! " + JSON.stringify(stockInfo))

		//Stock Price is changed.
		stockInfo.forEach((data)=>{
			var updateData = {
				"id":data.id,
				"last": data.last,
				"lastBid": data.bid,
				"lastAsk": data.ask,
			}
			CacheModule.updateStockData(updateData);
		});

		if (wsStockInfoCallback !== null) {
			// console.log("socketUpdate! wsStockInfoCallback != null")
			wsStockInfoCallback(stockInfo)
		}
	});

	// // Currently no alert service.
	// alertWebSocketProxy = webSocketConnection.createHubProxy(alertServerName);
	// alertWebSocketProxy.on(serverListenerName, (alertInfoArr) => {
	// 	console.log('alert comes.')
	// 	for (var i = 0; i < alertInfoArr.length; i++) {
	// 		Alert.alert('', alertInfoArr[i])
	// 	}

	// 	if (wsAlertCallback) {
	// 		wsAlertCallback(alertInfoArr)
	// 	}
	// });

	// atempt connection, and handle errors
	startWebSocket(webSocketConnection);
}

function handleConnectivityChange(reach){
	var origionNetworkConnectionStatus = networkConnectionStatus;
    if(Platform.OS === 'ios'){
        switch(reach){
          case 'none':
          case 'unknown':
            networkConnectionStatus = DISCONNECTED;
            break;
          case 'wifi':
          case 'cell':
            networkConnectionStatus = CONNECTED;
            break;
        }
    }else{
        switch(reach){
          case 'NONE':
          case 'DUMMY':
          case 'UNKNOWN':
            networkConnectionStatus = DISCONNECTED;
            break;
          case 'MOBILE':
          case 'WIFI':
            networkConnectionStatus = CONNECTED;
            break;
        }
    }

	if(origionNetworkConnectionStatus !== networkConnectionStatus){

		if (networkConnectionStatus === CONNECTED && webSocketConnection && webSocketConnection.state == 4){
			start();
		}else if(networkConnectionStatus === DISCONNECTED){
			if(webSocketConnection){
				webSocketConnection.stop();
			}
			wsErrorCallback('网络已断开。');
		}
	}
}

function startWebSocket(webSocketConnection){
	webSocketConnection.start()
		.done(() => {
			socketConnected = true;
			networkConnectionStatus = CONNECTED;

			EventCenter.emitNetworkConnectionChangedEvent();

			console.log('WebSocket now connected, connection ID=' + webSocketConnection.id);
			registerInterestedStocks(previousInterestedStocks)

			var userData = LogicData.getUserData()
			if (userData != null) {
				alertServiceLogin(userData.userId + '_' + userData.token)
			}
		})
		.fail((error) => {
			console.log("webSocketConnection.start error", error)
			wsErrorCallback(error.message)
	});
}

export function stop() {
	console.log("stop websocket")
	if (webSocketConnection !== null) {
		webSocketConnection.stop()
		webSocketConnection = null
	}

	NetInfo.removeEventListener(
		'change',
		handleConnectivityChange
	);
}

export function registerInterestedStocksCallbacks(stockInfoCallback) {
	// console.log("register call backs")
	wsStockInfoCallback = stockInfoCallback
}

export function registerAlertCallbacks(alertCallback) {
	wsAlertCallback = alertCallback
}

export function registerInterestedStocks(stockList) {
	// console.log("register interested backs")
	console.log('registerInterestedStocks: ' + webSocketConnection)
	if (webSocketConnection
		&& webSocketConnection.state == 1 && stockPriceWebSocketProxy !== null
		// && stockList !== null
		// && stockList.length > 0
		) {
		console.log('Send stockList to websocket server: ' + stockList)
		previousInterestedStocks = stockList
	    var messagePromise = stockPriceWebSocketProxy.invoke(subscribeStock, stockList);

	    messagePromise
	    	.done(() => {
		    	console.log ('Send Message to server succeeded');
			})
			.fail(function (error) {
		    	if (wsErrorCallback) {
		    		wsErrorCallback(error.message)
		    	}
			});
	}else{
		console.log('Send stockList to websocket server later: ' + stockList)
		previousInterestedStocks = stockList;
	}
}

export function cleanRegisteredCallbacks() {
	// console.log("clean registerCallbacks")
	registerInterestedStocks("");
	registerInterestedStocksCallbacks(null);
}

export function alertServiceLogin(token) {
	if (webSocketConnection && webSocketConnection.state == 1 && alertWebSocketProxy !== null && token !== null) {
		var messagePromise = alertWebSocketProxy.invoke('L', token);

	    messagePromise
	    	.done((result) => {
		    	console.log ('Send Login to Alert server succeed: ' + result);
			})
			.fail(function (error) {
		    	if (wsErrorCallback) {
		    		wsErrorCallback(error.message)
		    	}
			});
	}
}

export function getPreviousInterestedStocks() {
	return previousInterestedStocks
}
