import React, { Component } from 'react';
import {
    AppRegistry,
    Button,
    View,
    StyleSheet,
    Platform,
    FlatList,
    Switch,
    Slider,
    TextInput,
    TouchableOpacity,
    Image,
    LayoutAnimation,
    ImageBackground,
    Dimensions,
	ListView,
	Alert,
} from 'react-native';


import ViewKeys from '../ViewKeys';
import NinePatchView from 'react-native-9patch-image';
import CustomStyleText from './component/CustomStyleText';
import StockOrderInfoModal from "./StockOrderInfoModal";
import LogicData from "../LogicData";
import CustomKeyboard from "./CustomKeyboard";
import SubmitButton from "./component/SubmitButton";
import NetworkErrorIndicator from './component/NetworkErrorIndicator';

var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock') 
var {height, width} = Dimensions.get('window');
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var WebSocketModule = require('../module/WebSocketModule');
var LS = require("../LS");
var DEFAULT_PERCENT = -1
var MAX_LOSS_PERCENT = -90
var stockPriceFontSize = 15

const ROW_PADDING = UIConstants.ITEM_ROW_MARGIN_VERTICAL;
const ROW_SIMPLE_CONTENT_PADDING = 10;
const SIMPLE_ROW_HEIGHT = UIConstants.ITEM_ROW_HEIGHT + ROW_PADDING;
const STOP_PROFIT_LOSS_SMALL_HEIGHT = 100;
const FOLLOW_ROW_HEIGHT = 50;

const SUB_ACTION_NONE = 0;
const SUB_ACTION_STOP_LOSS_PROFIT = 2;
const TYPE_STOP_PROFIT = 1;
const TYPE_STOP_LOSS = 2;

const SHADOW_LEFT = Platform.OS == "android" ? 10 : 12;
const SHADOW_TOP = Platform.OS == "android" ? 6 : 7;
const SHADOW_RIGHT = Platform.OS == "android" ? 10 : 12;
const SHADOW_BOTTOM = Platform.OS == "android" ? 3 : 5;
const OUTER_ROW_MARGIN_TOP = 0;

const UNSELECTED_ROW_HEIGHT = 90
const ROW_HEIGHT = 51
const OK_ROW_HEIGHT = 64
const EXTEND_HEIGHT_FIRST = ROW_HEIGHT * 3 + OK_ROW_HEIGHT
const EXTEND_HEIGHT_SECOND = ROW_HEIGHT * 2 - 2
const extendTPSLHeight = 50

export default class  MyPositionTabHold extends React.Component {
    static navigationOptions = {
        title: 'Home',
    }

	stopProfitLossStockId = 0
	stopProfitLossKeyboardType = 0  //1 stop profit, 2 stop loss
	stopProfitMinValue = 0
	stopProfitMaxValue = 0
	stopLossMinValue = 0
	stopLossMaxValue = 0

	stopProfitPercent = DEFAULT_PERCENT
	stopLossPercent = MAX_LOSS_PERCENT
	stopProfitUpdated = false
	stopLossUpdated = false
	isWaiting = false

	constructor(props){
        super(props)

		var state = this.getInitialState()
		state.isDataLoading = false;
		state.stockInfoRowData = [];
        this.state = state;
	}
	
	componentWillMount(){
		WebSocketModule.registerMessageCallback((closePositions)=>this.closePositionList(closePositions))
	}

	//通过WebSocket通知到客户端有仓位被强行平仓了
	closePositionList(closePositions){
		var changed = false;
		for(i in this.state.stockInfoRowData){
			var stock = this.state.stockInfoRowData[i];
			for(j in closePositions){
				if(stock.id == closePositions[j].posId){
					this.state.stockInfoRowData.splice(i, 1);

					if(this.state.selectedRow > i){
						this.state.selectedRow -= 1;
					}else if (this.state.selectedRow == i){
						this.state.selectedRow = -1;
						this.state.selectedSubItem = SUB_ACTION_NONE;
					}
					changed = true;
					
				}
			}
		}

		if(changed){
			this.setState({
				selectedRow: this.state.selectedRow,
				selectedSubItem: this.state.selectedSubItem,
				stockInfoRowData: this.state.stockInfoRowData
			});
		}
	}

	getInitialState(){
		this.stopProfitUpdated = false
		this.stopLossUpdated = false
		this.stopProfitPercent = DEFAULT_PERCENT
		this.stopLossPercent = MAX_LOSS_PERCENT

		var state = {
			selectedRow: -1,
			selectedSubItem: SUB_ACTION_NONE,
			stockDetailInfo: [],
			showExchangeDoubleCheck: false,
			stopProfitSwitchIsOn: false,
			stopLossSwitchIsOn: false,
			profitLossUpdated: false,
			profitLossConfirmed: false,
			contentLoaded: false,
			isRefreshing: false,
			dataStatus:0,//0正常 1等待刷新 2加载中
			// height: UIConstants.getVisibleHeight(),
			totalCount:0,
			isFocused: false,
			errorMessage: "",
		}
		return state;
	}

	refreshFooterBar(responseJson){
		var totalCount = 0;
		for (var i = 0; i < responseJson.length; i++) {
			var rowData = responseJson[i];
			var profitPercentage = 0
			var profitAmount = rowData.upl
			if (rowData.settlePrice !== 0) {
				profitPercentage = (this.getLastPrice(rowData) - rowData.settlePrice) / rowData.settlePrice * rowData.leverage
				profitPercentage *= (rowData.isLong ? 1 : -1)
				profitAmount = profitPercentage * rowData.invest

				profitAmount = rowData.upl
			}
			totalCount += profitAmount;

		};

		this.setState({
			totalCount:totalCount
		})
	}

	loadOpenPositionInfo(onFinished, onFailed) {
		var userData = LogicData.getUserData();
		console.log("userData:", userData)
		this.setState({
			isDataLoading: true,
		}, ()=>{			
			var url = NetConstants.CFD_API.OPEN_POSITION_LIST;
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
					//TODO: Use real data!!!!!
					// for (var i in responseJson){
					// 	responseJson[i].isFollowing = true;
					// 	responseJson[i].followingUser = "一个人"
					// 	responseJson[i].followingUserPortrit = "https://yjystorage.blob.core.chinacloudapi.cn/user-pic/default/5.jpg"
					// }
					//TODO: Use real data!!!!!
					
					this.setState({
						stockInfoRowData: responseJson,
						isDataLoading: false,
						isRefreshing: false,
						contentLoaded: true,
					}, ()=>{
						var interestedStockIds = [];
						for (var i = 0; i < this.state.stockInfoRowData.length; i++) {
							var stockId = this.state.stockInfoRowData[i].security.id
							if (interestedStockIds.indexOf(stockId) < 0) {
								interestedStockIds.push(stockId)
							}
						};
	
						WebSocketModule.registerInterestedStocks(interestedStockIds.join(','))
						WebSocketModule.registerInterestedStocksCallbacks(
							(realtimeStockInfo) => {
								this.handleStockInfo(realtimeStockInfo)
							}
						)
						
						onFinished && onFinished();
					});
				},
				(exception) => {
					this.setState({
						errorMessage: exception.errorMessage,
						isDataLoading: false,
						isRefreshing: false,
					}, ()=>{
						onFailed && onFailed();
					});
				}
			);
		})
	}

	refresh(){
		var state = this.getInitialState();

		if(LogicData.isLoggedIn()){
			state.isRefreshing = true;
			this.setState(state, ()=>{
				this.loadOpenPositionInfo();
			});
		}else{
			state.isDataLoading = false;
			state.stockInfoRowData = [];
			this.setState(state);
		}
	}

	handleStockInfo(realtimeStockInfo) {
		var hasUpdate = false
		// var hasUpdateDetail = false
		var sdi = this.state.stockDetailInfo
		for (var i = 0; i < this.state.stockInfoRowData.length; i++) {
			for (var j = 0; j < realtimeStockInfo.length; j++) {
				if (this.state.stockInfoRowData[i].security.id == realtimeStockInfo[j].id &&
							this.state.stockInfoRowData[i].security.last !== realtimeStockInfo[j].last) {
					this.state.stockInfoRowData[i].security.last = realtimeStockInfo[j].last;
					hasUpdate = true;

					if(this.stopProfitLossStockId == this.state.stockInfoRowData[i].security.id ){
						this.updateStopProfitLossMinMaxValue(this.state.stockInfoRowData[i])
					}
				}				
			};
		};

		if(this.dataToStore){
			var needToUpdateCache = false;
			for (var i = 0; i < this.dataToStore.length; i++) {
				for (var j = 0; j < realtimeStockInfo.length; j++) {
					if (this.dataToStore[i].security.id == realtimeStockInfo[j].id &&
								this.dataToStore[i].security.last !== realtimeStockInfo[j].last) {

						this.dataToStore[i].security.last = realtimeStockInfo[j].last;
						needToUpdateCache = true;
					}
				}
			}
		}

		this.setState({
			stockInfoRowData: this.state.stockInfoRowData,
		})
    }
    
	stockPressed(rowData, rowID) {
		this.setState({
			showExchangeDoubleCheck: false,
		})
		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy

		var state = {};
		var viewPosition = 0;
		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			newData[rowID].hasSelected = false
			state = {
				selectedRow: -1,
				selectedSubItem: SUB_ACTION_NONE,
				stockInfoRowData: newData,
			};
			this.setState(state)
		} else {
			this.isWaiting = false
			if (this.state.selectedRow >=0) {
				newData[this.state.selectedRow].hasSelected = false
			}
			newData[rowID].hasSelected = true

			var stopProfit = rowData.takePx !== undefined
			// var stopLoss = rowData.stopPx !== undefined
			
			var stopLoss = this.priceToPercentWithRow(rowData.stopPx, rowData, 2) >= MAX_LOSS_PERCENT
			console.log("stopLoss ", stopLoss)
			this.stopProfitPercent = DEFAULT_PERCENT
			this.stopLossPercent = MAX_LOSS_PERCENT
			this.stopProfitUpdated = false
			this.stopLossUpdated = false

			state = {
				selectedRow: rowID,
				selectedSubItem: SUB_ACTION_NONE,
				stockInfoRowData: newData,
				stopProfitSwitchIsOn: stopProfit,
				stopLossSwitchIsOn: stopLoss,
				profitLossUpdated: false,
				profitLossConfirmed: false,
			};
			this.setState(state, ()=>{
				this.scrollToCurrentSelectedItem(rowID, 1);
			})		
		}
	}

	scrollToCurrentSelectedItem(selectedRow, viewPosition){
		setTimeout(()=>{
			this.flatListRef.scrollToIndex({
				index: selectedRow, 
				animated: true, 
				viewPosition:viewPosition,
				viewOffset:0,
			});
		}, 100);
	}

	subItemPress(rowData) {
		var detalY = 0
		var state = {
			selectedSubItem: this.state.selectedSubItem === SUB_ACTION_STOP_LOSS_PROFIT ? SUB_ACTION_NONE : SUB_ACTION_STOP_LOSS_PROFIT,
		};
		this.setState(state, ()=>{
			console.log("this.state.selectedRow " + this.state.selectedRow)
			this.scrollToCurrentSelectedItem(this.state.selectedRow, 1)
		});
	}

	okPress(rowData) {
		if (!rowData.security.isOpen)
			return

		if (this.state.showExchangeDoubleCheck === false) {
			this.setState({
				showExchangeDoubleCheck: true,
			}, ()=>{
				this.scrollToCurrentSelectedItem(this.state.selectedRow, 1)
			});
			return
		}

		if (this.isWaiting) {
			return
		}
		this.isWaiting = true

		var userData = LogicData.getUserData();  
		
		console.log(this.state.stockInfoRowData[this.state.selectedRow])

		var selectedRowData = this.state.stockInfoRowData[this.state.selectedRow];
		var body = {
			posId: this.state.stockInfoRowData[this.state.selectedRow].id,
			securityId: this.state.stockInfoRowData[this.state.selectedRow].security.id,
		}
		
		console.log("NetConstants.CFD_API.STOP_POSITION")
		NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.STOP_POSITION,
			{
				method: 'POST',
				headers: {
					'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					'Content-Type': 'application/json; charset=utf-8',
				},
				showLoading: true,
				body: JSON.stringify(body),
			}, (responseJson) => {
				this.state.stockInfoRowData.splice(this.state.selectedRow, 1);

				this.setState ({
					selectedRow: -1,
					selectedSubItem: SUB_ACTION_NONE,
					stockInfoRowData: this.state.stockInfoRowData,
				}, ()=>{
					var showData = responseJson;
					console.log("selectedRowData", selectedRowData)
					console.log("responseJson", responseJson)
					showData.stockName = selectedRowData.security.name;
					showData.isCreate = false;

					// { isLong: true,
					// 	settlePrice: 1317.7,
					// 	createAt: '2018-03-02T07:15:53.063',
					// 	closedAt: '2018-03-02T07:41:49.1643988Z',
					// 	closePrice: 1317.1,
					// 	id: 39,
					// 	invest: 200,
					// 	leverage: 1,
					// 	pl: -0.09106776959854292 }

					showData.time = new Date(responseJson.createAt);
					this.refs["orderFinishedModal"].show(showData);
				})
			},
			(exception) => {
				alert(exception.errorMessage)
			}
		);

	}

	onSwitchPressed(type, value) {
		var state = {};
		if (type===1) {
			state.stopProfitSwitchIsOn = value;
			this.stopProfitUpdated = true
		} else{
			state.stopLossSwitchIsOn = value;
			this.stopLossUpdated = true
		};

		state.profitLossUpdated = true;
		this.setState(state,()=>{
			this.scrollToCurrentSelectedItem(this.state.selectedRow, 1);
		});
	}

	switchConfrim(rowData) {
		var currentStopProfitUpdated = this.stopProfitUpdated;
		var currentStopLossUpdated = this.stopLossUpdated;
		var currentStopLossPercent = this.stopLossPercent;
		var currentStopProfitPercent = this.stopProfitPercent;
		var currentStopProfitSwitchIsOn = this.state.stopProfitSwitchIsOn;
		var currentStopLossSwitchIsOn = this.state.stopLossSwitchIsOn;

		var lastSelectedRow = this.state.selectedRow;
		
		this.sendStopProfitLossRequest(rowData)
		.then((info)=>{		
			var newState = {
				profitLossUpdated: false,
				profitLossConfirmed: true,
			};

			if(info){
				var tempStockInfo = this.state.stockInfoRowData;
				if ('stopPx' in info){
					tempStockInfo[lastSelectedRow].stopPx = info.stopPx;
				}
				if ('takePx' in info){
					tempStockInfo[lastSelectedRow].takePx = info.takePx;
				}
				//tempStockInfo[lastSelectedRow].isSettingProfitLoss = false;
				newState.stockInfoRowData = tempStockInfo;
			}
			console.log("stop profit/loss finsished. Update state")
			this.setState(newState);
		})
		.catch((error)=>{
			console.log("Met error! " + error);
			//var tempStockInfo = this.state.stockInfoRowData;
			var newState = {
				profitLossUpdated: false,
				profitLossConfirmed: true,
			};
			this.setState(newState);
		});
	}

	sendStopProfitLossRequest(rowData){
		
		var lastSelectedRow = this.state.selectedRow;
		var stopLossSwitchIsOn = this.stopLossSwitchIsOn;
		var stopLossPercent = this.stopLossPercent;
		var stopLossUpdated = this.stopLossUpdated;
		var stopProfitPercent = this.stopProfitPercent;
		var stopProfitUpdated = this.stopProfitUpdated;

		return new Promise((resolve, reject)=>{
			try{
				if (stopLossSwitchIsOn && stopLossPercent < MAX_LOSS_PERCENT) {
					Alert.alert('', '暂时超出' + MAX_LOSS_PERCENT + '，无法设置');
					reject();
					return
				}

				var body = {
					posId: rowData.id,
				};

				if(this.state.stopLossSwitchIsOn){
					var stopLossPrice = this.percentToPriceWithRow(stopLossPercent, rowData, TYPE_STOP_LOSS);
					body.stopPx = stopLossPrice;
				}
				if(this.state.stopProfitSwitchIsOn){
					var stopProfitPrice = this.percentToPriceWithRow(stopProfitPercent, rowData, TYPE_STOP_PROFIT);
					body.takePx = stopProfitPrice;
				}

				var url = NetConstants.CFD_API.STOP_PROFIT_LOSS_API
				var userData = LogicData.getUserData()
				NetworkModule.fetchTHUrl(
					url,
					{
						method: 'PUT',
						headers: {
							'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
							'Content-Type': 'application/json; charset=utf-8',
						},
						body: JSON.stringify(body),
						showLoading: true,
					},
					(responseJson) => {
						console.log("set stop loss returned");
						this.stopLossUpdated = false
						this.stopProfitUpdated = false							

						var stockInfo = {};
						stockInfo.stopPx = responseJson.stopPx;
						stockInfo.takePx = responseJson.takePx;

						resolve(stockInfo);
					},
					(result) => {
						Alert.alert('', result.errorMessage);
						resolve(null);
					}
				);				
			}catch(error){
				console.log("stop loss has ERROR:" + error);
			}
		});
	}

	getLastPrice(rowData) {
		return rowData.security.last 
	}

	renderFollowStatus(rowData){
		if(rowData.followUser){
			var statusTxt = LS.str("COPY_TRADE")
			return(
				<Image source={LS.loadImage("position_follow_open")} 
					style={styles.followIcon} resizeMode="contain"/>
			)
		}else{
			return null;
		}
	}

	renderStockStatus(rowData){
		if(rowData.security!==undefined){
			if(rowData.security.isOpen){
				return null;
			}else{
				return(
					<Image source={require("../../images/item_stoped.png")} 
						style={styles.statusIcon}/>
				);
			}
		}
	}

	renderProfit(percentChange, endMark) {
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<CustomStyleText style={[styles.stockPercentText, 
			//{color: ColorConstants.stock_color(percentChange), fontSize:textSize}
			]}>
				 {startMark}{percentChange} {endMark}
			</CustomStyleText>
		);
	}

	renderStockMaxPriceInfo(maxPrice, maxPercentage, isTop) {
		if (maxPrice && maxPercentage)
		{
			return (
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
						<CustomStyleText style={[styles.priceText, isTop && {color:'black'}]}>
							{maxPrice}
						</CustomStyleText>
					</View>

					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
						<CustomStyleText style={[styles.priceText, isTop && {color:'black'}]}>
							{maxPercentage} %
						</CustomStyleText>
					</View>
				</View>
			);
		}
		else {
			return (
				<View style={{height:16}}/>)
		}
	}

	setSliderValue(type, value, rowData) {
		// console.log('Rambo:this.stopLossPercent' + value)
		if (type === TYPE_STOP_PROFIT) {
			this.stopProfitPercent = value
			this.stopProfitUpdated = true
		}
		else {
			this.stopLossPercent = value
			this.stopLossUpdated = true
		}
		this.useNativePropsToUpdate(type, value, rowData)
	}

	percentToPrice(percent, basePrice, leverage, type, isLong) {
		//if (type === TYPE_STOP_PROFIT) {
			// 止盈
		return isLong ? basePrice * (1+percent/100/leverage) : basePrice * (1-percent/100/leverage)
		// }
		// else {
		// 	// 止损
		// 	return isLong ? basePrice * (1-percent/100/leverage) : basePrice * (1+percent/100/leverage)
		// }
	}

	percentToPriceWithRow(percent, rowData, type) {
		var leverage = rowData.leverage === 0 ? 1 : rowData.leverage
		return this.percentToPrice(percent, rowData.settlePrice, leverage, type, rowData.isLong)
	}

	priceToPercent(price, basePrice, leverage, type, isLong) {
		//if (type === TYPE_STOP_PROFIT) {
			return (price-basePrice)/basePrice*100*leverage * (isLong?1:-1)
		// }
		// else {
		// 	return (basePrice-price)/basePrice*100*leverage * (isLong?1:-1)
		// }
	}

	priceToPercentWithRow(price, rowData, type) {
		var leverage = rowData.leverage === 0 ? 1 : rowData.leverage
		return this.priceToPercent(price, rowData.settlePrice, leverage, type, rowData.isLong)
	}

	renderSlider(rowData, type, startPercent, endPercent, percent) {
		var disabled = false
		if (type === TYPE_STOP_PROFIT) {
			if (endPercent < MAX_LOSS_PERCENT) {
				// max visible percent should be not less than MAX_LOSS_PERCENT(-90)
				endPercent = MAX_LOSS_PERCENT
				startPercent = endPercent
				disabled = true
			}
		}
		return (
			<View style={[styles.sliderView]}>
				<Slider
					ref={component => this.bindSliderRef(type, component, type)}
					style={styles.slider}
					minimumTrackTintColor={ColorConstants.COLOR_MAIN_THEME_BLUE}
					minimumValue={startPercent}
					value={percent}
					maximumValue={endPercent}
                    step={0.01}
                    thumbTintColor={ColorConstants.COLOR_MAIN_THEME_BLUE}
					disabled={disabled}
					onSlidingComplete={(value) => this.setState({profitLossUpdated: true})}
					onValueChange={(value) => this.setSliderValue(type, value, rowData)} />
				<View style = {styles.subDetailRowWrapper}>
					<CustomStyleText style={styles.sliderLeftText}>{startPercent.toFixed(2)}%</CustomStyleText>
					<CustomStyleText style={styles.sliderRightText}>{endPercent.toFixed(2)}%</CustomStyleText>
				</View>
			</View>
			)
	}

	useNativePropsToUpdate(type, value, rowData){
		var displayValue = value.toFixed(2);
		var price = this.percentToPriceWithRow(value, rowData, type)
		if (type === TYPE_STOP_PROFIT){
			this._text1.setNativeProps({text: displayValue+'%'});
			this._text3.setNativeProps({text: price.toFixed(rowData.security.dcmCount)})
		}
		else if (type === TYPE_STOP_LOSS) {
			var props = {text: displayValue+'%'};
			if(Platform.OS === "ios"){
				props.color = displayValue >= 0 ? ColorConstants.STOCK_RISE : ColorConstants.STOCK_DOWN;
			}else{
				props.style = {color: displayValue >= 0 ? ColorConstants.STOCK_RISE : ColorConstants.STOCK_DOWN};
			}
			this._text2.setNativeProps(props);
			this._text4.setNativeProps({text: price.toFixed(rowData.security.dcmCount)})
		}
	}

	bindRef(type, component, mode){
		if (mode === 1) {
			if (type === TYPE_STOP_PROFIT){
				this._text1 = component
			}
			else if (type === TYPE_STOP_LOSS) {
				this._text2 = component
			}
		}
		else {
			if (type === TYPE_STOP_PROFIT){
				this._text3 = component
			}
			else if (type === TYPE_STOP_LOSS) {
				this._text4 = component
			}
		}
	}

	bindSliderRef(type, component){
		if (type === TYPE_STOP_PROFIT){
			this._slider1 = component
		}
		else if (type === TYPE_STOP_LOSS) {
			this._slider2 = component
		}
	}

	renderStopProfitLoss(rowData, type) {
		var titleText = type === TYPE_STOP_PROFIT ?  LS.str("TAKE_PROFIT"): LS.str("STOP_LOSS")
		var switchIsOn = type === TYPE_STOP_PROFIT ? this.state.stopProfitSwitchIsOn : this.state.stopLossSwitchIsOn
		var price = rowData.settlePrice
		var percent = type === TYPE_STOP_PROFIT ? this.stopProfitPercent : this.stopLossPercent
		var startPercent = 0
		var endPercent = MAX_LOSS_PERCENT

		if (type === TYPE_STOP_PROFIT) {
			// stop profit
			startPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)

			// if (startPercent < 0)
			// 	startPercent = 0
			endPercent = startPercent + 100
			if (percent === DEFAULT_PERCENT) {
				percent = rowData.takePx === undefined ? startPercent
					: this.priceToPercentWithRow(rowData.takePx, rowData, type)
				this.stopProfitPercent = percent
			}
		} else{
			// stop loss
			startPercent = MAX_LOSS_PERCENT
			endPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use smd to make sure this order is guaranteed.
			//endPercent -= rowData.security.gsmd*100*rowData.leverage

			if(endPercent - startPercent > 100){
				startPercent = endPercent - 100
			}

			console.log("renderStopProfitLoss this.stopLossUpdated", this.stopLossUpdated)
			if (!this.stopLossUpdated){//percent === MAX_LOSS_PERCENT) {

				percent = rowData.stopPx === undefined ? endPercent : this.priceToPercentWithRow(rowData.stopPx, rowData, type)

				if (percent < startPercent) {
					percent = startPercent
				}
				this.stopLossPercent = percent
			}
		};

		var color = ( percent >= 0 ? ColorConstants.STOCK_RISE : ColorConstants.STOCK_DOWN);

		var disabled = false
		if (type === TYPE_STOP_LOSS) {
			if (startPercent < MAX_LOSS_PERCENT) {
				disabled = true
			}
		}

		price = this.percentToPriceWithRow(percent, rowData, type)

		var endValue1 = this.percentToPriceWithRow(startPercent, rowData, type)
		var endValue2 = this.percentToPriceWithRow(endPercent, rowData, type)

		var minValue = Math.min(endValue1, endValue2).toFixed(4)
		var maxValue = Math.max(endValue1, endValue2).toFixed(4)

		return (
			<View>
				<View style={[styles.subDetailRowWrapper, {height:50}]}>
					<CustomStyleText style={[styles.extendLeft, {minWidth:10}]}>{titleText}</CustomStyleText>
					{
						switchIsOn ?
						<View style={[styles.extendMiddle,
							 {flexDirection: 'row', flex:3, paddingTop:0, paddingBottom:0, justifyContent: 'center', alignItems: 'center'}]}>
							<TextInput editable={false} ref={component => this.bindRef(type, component, 1)} defaultValue={percent.toFixed(2)+'%'}
								style={{flex:3, textAlign:'right', fontSize:17, color: color}}
								underlineColorAndroid='transparent'/>
							<TouchableOpacity
								style={{flex:3, alignSelf:'stretch', flexDirection:'column', alignItems:'center', justifyContent:'center'}}
								onPress={()=>{
									this.onChangeStopProfitValuePressed(
										rowData,
										type,
										price.toFixed(rowData.security.dcmCount))
								}}>
								<View style={[styles.stopProfitLossInputBox]} pointerEvents={'none'}>
									<TextInput editable={false} ref={component => this.bindRef(type, component, 2)}
										defaultValue={price.toFixed(rowData.security.dcmCount)}
										style={styles.stopProfitLossInputBoxText}
										numberOfLines={1}
										underlineColorAndroid='transparent'
										pointerEvents={'none'}/>
								</View>
							</TouchableOpacity>
						</View>
						: null
					}
					<View style={styles.extendRight}>
		        <Switch
		          onValueChange={(value) => this.onSwitchPressed(type, value)}
		          value={switchIsOn}
							disabled={disabled}
						  onTintColor={ColorConstants.COLOR_MAIN_THEME_BLUE} />
			        </View>
				</View>
				{ switchIsOn ? this.renderSlider(rowData, type, startPercent, endPercent, percent) : null}
				{ type == 1 ? (<View style={styles.darkSeparator} />) : null}
				
			</View>)
	}

	toFixedCeil(num, precision) {
		return (+(Math.ceil(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
	}

	toFixedFloor(num, precision) {
		return (+(Math.floor(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
	}

	getErrorText(type, minValue, maxValue) {
		if( type == 1){
			return '止盈位置' +" "+ minValue.toString()+" " + "到" +" "+ maxValue.toString()+" "+   "之间";
		}else if (type == 2){
			return "止损位置" +" "+ minValue.toString()+" " + "到"+" " + maxValue.toString() +" "+ "之间";
		}
	}

	getError(value, rowData, type){
		var maxValue, minValue = 0;
		if( type == 1){
			var maxValue = this.toFixedFloor(this.stopProfitMaxValue, rowData.security.dcmCount);
			var minValue = this.toFixedCeil(this.stopProfitMinValue, rowData.security.dcmCount);
		}else if (type == 2){
			var maxValue = this.toFixedFloor(this.stopLossMaxValue, rowData.security.dcmCount);
			var minValue = this.toFixedCeil(this.stopLossMinValue, rowData.security.dcmCount);
		}

		if(value < minValue || value > maxValue){
			return this.getErrorText(type, minValue, maxValue)
		}
		return null;
	}

	getStopProfitLossMinMaxValue(rowData, type){
		var percent = type === TYPE_STOP_PROFIT ? this.stopProfitPercent : this.stopLossPercent
		var startPercent = 0
		var endPercent = MAX_LOSS_PERCENT

		if (type === TYPE_STOP_PROFIT) {
			// stop profit
			startPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)

			// if (startPercent < 0)
			// 	startPercent = 0
			endPercent = startPercent + 100
			if (percent === DEFAULT_PERCENT) {
				percent = rowData.takePx === undefined ? startPercent
					: this.priceToPercentWithRow(rowData.takePx, rowData, type)
				this.stopProfitPercent = percent
			}
		} else{
			// stop loss
			startPercent = MAX_LOSS_PERCENT
			endPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use smd to make sure this order is guaranteed.
			//endPercent -= rowData.security.gsmd*100*rowData.leverage

			if(endPercent - startPercent > 100){
				startPercent = endPercent - 100
			}

			if (!this.stopLossUpdated){//percent === MAX_LOSS_PERCENT) {

				percent = rowData.takePx === undefined ? endPercent : this.priceToPercentWithRow(rowData.stopPx, rowData, type)
				if (percent < startPercent) {
					percent = startPercent
				}
				this.stopLossPercent = percent
			}
		};

		var endValue1 = this.percentToPriceWithRow(startPercent, rowData, type)
		var endValue2 = this.percentToPriceWithRow(endPercent, rowData, type)

		var minValue = Math.min(endValue1, endValue2).toFixed(4)
		var maxValue = Math.max(endValue1, endValue2).toFixed(4)
		return {
			minValue:minValue,
			maxValue: maxValue
		};
	}

	updateCurrentStopLossProfitMinMaxValue(rowData, type){
		var values = this.getStopProfitLossMinMaxValue(rowData,type)
		var minValue = values.minValue;
		var maxValue = values.maxValue;

		if(type === TYPE_STOP_PROFIT){
			this.stopProfitMinValue = minValue
			this.stopProfitMaxValue = maxValue
		}else if (type === TYPE_STOP_LOSS){
			this.stopLossMinValue = minValue
			this.stopLossMaxValue = maxValue
		}
	}

	updateStopProfitLossMinMaxValue(rowData){
        console.log("updateStopProfitLossMinMaxValue 2")
        var type = this.stopProfitLossKeyboardType;

        var previousMinValue = 0;
        var previousMaxValue = 0;

        var minValue, maxValue = 0;

        if(type === TYPE_STOP_PROFIT){
            previousMinValue = this.stopProfitMinValue;
            previousMaxValue = this.stopProfitMaxValue;
        }else if (type === TYPE_STOP_LOSS){
            previousMinValue = this.stopLossMinValue;
            previousMaxValue = this.stopLossMaxValue;
        }

        console.log("updateStopProfitLossMinMaxValue 3")
        this.updateCurrentStopLossProfitMinMaxValue(rowData, type);
        if(type === TYPE_STOP_PROFIT){
            minValue = this.stopProfitMinValue;
            maxValue = this.stopProfitMaxValue;
        }else if (type === TYPE_STOP_LOSS){
            minValue = this.stopLossMinValue;
            maxValue = this.stopLossMaxValue;
        }
        if(previousMinValue != minValue || previousMaxValue != maxValue){
            console.log("updateStopProfitLossMinMaxValue 4")
        }
	}

	onChangeStopProfitValuePressed(
		rowData,
		type,
		currentValue){

		this.stopProfitLossKeyboardType = type;
		this.stopProfitLossStockId = rowData.security.id;

		this.updateCurrentStopLossProfitMinMaxValue(rowData, type);

		
		this.keyboardRef.showWithData({
			value: currentValue,
			checkError: (value)=>{
				return this.getError(value, rowData, type);
			},
			hasDot: true,
			dcmCount: rowData.security.dcmCount,
			onInputConfirmed: (newValue)=>{
				var newPercent = this.priceToPercentWithRow(newValue, rowData, type)
				this.setSliderValue(type, newPercent, rowData)
			}
		})
		// MainPage.showKeyboard({
		// 	value: currentValue,
		// 	checkError: (value)=>{
		// 		return this.getError(value, rowData, type);
		// 	},
		// 	hasDot: true,
		// 	dcmCount: rowData.security.dcmCount,
		// 	onInputConfirmed: (newValue)=>{
		// 		var newPercent = this.priceToPercentWithRow(newValue, rowData, type)
		// 		this.setSliderValue(type, newPercent, rowData)
		// 	}
		// })
	}

	_renderActivityIndicator() {
			return ActivityIndicator ? (
					<ActivityIndicator
							style={{marginRight: 10,}}
							animating={true}
							color={'black'}
							size={'small'}/>
			) : Platform.OS == 'android' ?
					(
							<ProgressBarAndroid
									style={{marginRight: 10,}}
									color={'black'}
									styleAttr={'Small'}/>

					) :  (
					<ActivityIndicatorIOS
							style={{marginRight: 10,}}
							animating={true}
							color={'black'}
							size={'small'}/>
			)
	}

	renderSubDetail(rowData) {
		var thisPartHeight = STOP_PROFIT_LOSS_SMALL_HEIGHT //170
		thisPartHeight += this.state.stopLossSwitchIsOn ? 55 : 0
		thisPartHeight += this.state.stopProfitSwitchIsOn ? 55 : 0

		return (
			<View style={{height:thisPartHeight}}>
				{this.renderStopProfitLoss(rowData, TYPE_STOP_PROFIT)}
				{this.renderStopProfitLoss(rowData, TYPE_STOP_LOSS)}
			</View>
		);
	}

	onOKButtonPressed(rowData){
		if(this.state.selectedSubItem === SUB_ACTION_STOP_LOSS_PROFIT){
			this.switchConfrim(rowData);
		}else{
			this.okPress(rowData);
		}
	}

	renderOKView(rowData) {
		var profitAmount = rowData.upl
		if (rowData.settlePrice !== 0) {
			var lastPrice = this.getLastPrice(rowData)
			var profitPercentage = (lastPrice - rowData.settlePrice) / rowData.settlePrice * rowData.leverage

			profitPercentage *= (rowData.isLong ? 1 : -1)
			profitAmount = profitPercentage * rowData.invest
		}

		var buttonText = (profitAmount < 0 ? LS.str("POSITION_TAKE_LOSS"):LS.str("POSITION_TAKE_PROFIT")) + ': ' + profitAmount.toFixed(2)
		if (this.state.showExchangeDoubleCheck) {
			buttonText = LS.str("POSITION_CONFIRM")+':' + profitAmount.toFixed(2)
		}

		var separatorStyle = styles.darkSeparator;
		var buttonEnabled = true;
		if(this.state.selectedSubItem === SUB_ACTION_STOP_LOSS_PROFIT){
			var buttonText = LS.str("POSITION_CONFIRM")
			if (!this.state.profitLossUpdated && this.state.profitLossConfirmed) {
				buttonText = LS.str("POSITION_SETTED")
			}
			//separatorStyle = {backgroundColor: 'pink'};
			if(rowData.isSettingProfitLoss){
				buttonText = LS.str("WITHDRAW_WITHDRAW");
			}
			console.log("this.stopLossUpdated", this.stopLossUpdated)
			console.log("this.stopProfitUpdated", this.stopProfitUpdated)
			
			buttonEnabled = this.stopLossUpdated || this.stopProfitUpdated
		}

		if(!rowData.security.isOpen){
			buttonEnabled = false
		}
		return(
			<View>
				<View style={separatorStyle}/>
				<SubmitButton
					style={{marginTop:10, marginBottom:10}}
					isImportant={true}
					enable={buttonEnabled}
					onPress={()=>this.onOKButtonPressed(rowData)}
					text={buttonText}/>
			</View>)
	}

	renderStopProfitLossRow(rowData){
		if(!rowData.followUser){
			var stopLossImage = (rowData.takePx !== undefined || rowData.stopPx !== undefined) ? 
							require('../../images/position_stop_profit_loss_enabled.png') : 
							require('../../images/position_stop_profit_loss_disabled.png');
			var stopLoss = this.priceToPercentWithRow(rowData.stopPx, rowData, 2) >= MAX_LOSS_PERCENT
			var stopProfit = rowData.takePx !== undefined

			return (
			<View>
				<View style={styles.extendRowWrapper}>
					<View style={[styles.extendLeft, this.state.selectedSubItem==SUB_ACTION_STOP_LOSS_PROFIT && styles.bottomBorder]}/>
					<TouchableOpacity onPress={()=>this.subItemPress(rowData)}
						style={[styles.extendMiddle, 
								(this.state.selectedSubItem===SUB_ACTION_STOP_LOSS_PROFIT)&&styles.leftTopRightBorder,
								{borderTopColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderBottomColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderLeftColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderRightColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
							]}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("TAKE_PROFIT_STOP_LOSS_TITLE")}</CustomStyleText>
						<Image style={styles.extendImageBottom} source={stopLossImage}/>
					</TouchableOpacity>

					<View style={[styles.extendRight, this.state.selectedSubItem==SUB_ACTION_STOP_LOSS_PROFIT && styles.bottomBorder, ]}/>
				</View>

				{this.state.selectedSubItem !== SUB_ACTION_NONE ? this.renderSubDetail(rowData): null}
			</View>
			)
		}
	}

	getDetailContainerHeight(rowID){
		var height = 0;
		if(this.state.selectedRow == rowID){
			if(this.state.selectedSubItem===SUB_ACTION_STOP_LOSS_PROFIT){
				height = EXTEND_HEIGHT_FIRST + EXTEND_HEIGHT_SECOND;
				height += this.state.stopLossSwitchIsOn ? 55 : 0
				height += this.state.stopProfitSwitchIsOn ? 55 : 0
			}else{
				height = EXTEND_HEIGHT_FIRST;
			}
		}
		return height;
	}

	renderDetailInfo(rowData, rowID) {
		var tradeImage = rowData.isLong ? require('../../images/stock_detail_direction_up_disabled.png') : require('../../images/stock_detail_direction_down_disabled.png')
        var lastPrice = this.getLastPrice(rowData)
        
		// console.log('RAMBO rowData.id = ' + rowData.security.id)		
		var currentPriceLabel = rowData.isLong ? LS.str("ORDER_CURRENT_BUY_PRICE") : LS.str("ORDER_CURRENT_SELL_PRICE")
		var openDate = new Date(rowData.createAt)
		
		var financing_dividend_sum = 0;
		if(rowData.financingSum){
			financing_dividend_sum += rowData.financingSum;
		}
		if(rowData.dividendSum){
			financing_dividend_sum += rowData.dividendSum;
		}

		var containerStyle = {height: this.getDetailContainerHeight(rowID)}

		return (
			<View style={[styles.extendWrapper, containerStyle]} >				
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_TYPE")}</CustomStyleText>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<CustomStyleText style={styles.extendTextTop}>
                            {LS.str("ORDER_SUGAR_AMOUNT").replace("{1}", LS.getBalanceTypeDisplayText())}
						</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{rowData.invest.toFixed(2)}</CustomStyleText>
					</View>
					<View style={styles.extendRight}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_MULTIPLE")}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{"x"+rowData.leverage}</CustomStyleText>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_TRADE_PRICE")}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{rowData.settlePrice.maxDecimal(5)}</CustomStyleText>
					</View>
					<View style={styles.extendMiddle}>
						<CustomStyleText style={styles.extendTextTop}>{currentPriceLabel}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{lastPrice.maxDecimal(5)}</CustomStyleText>
					</View>
					<View style={styles.extendRight}>
						<CustomStyleText style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</CustomStyleText>
					</View>
				</View>
                <View style={styles.darkSeparator} />
				{this.renderStopProfitLossRow(rowData)}
				{this.renderFollowRow(rowData)}
				{this.renderOKView(rowData)}

				<CustomKeyboard ref={(ref)=>this.keyboardRef = ref}/>
			</View>
		);
	}

	getItemLayout(data, index){
		var smallItemHeight = SIMPLE_ROW_HEIGHT;
		var bigItemHeight = SIMPLE_ROW_HEIGHT + 51 * 3 + 64 + UIConstants.ITEM_ROW_MARGIN_VERTICAL;
		var itemHeight = smallItemHeight;
		if(this.state.selectedSubItem === SUB_ACTION_STOP_LOSS_PROFIT){
			bigItemHeight += STOP_PROFIT_LOSS_SMALL_HEIGHT;
		}
		if(this.state.stopLossSwitchIsOn){
			bigItemHeight += 55;
		}
		if(this.state.stopProfitSwitchIsOn){
			bigItemHeight += 55;
		}

		if (index == this.state.selectedRow){
			itemHeight = bigItemHeight;
		}
		
		var offset = smallItemHeight * index;
		// if (index >= this.state.selectedRow){
		// 	offset += bigItemHeight - smallItemHeight;
		// }
		//console.log("index " + index + ", height: " + itemHeight);
		return {
			length: itemHeight, 
			offset: offset - 4,
			index: index};
	}

	renderFollowRow(rowData){
		if(rowData.followUser){
			return (
				<View style={[styles.rowWrapper, {height:FOLLOW_ROW_HEIGHT, flex:1, justifyContent:'center', alignItems:'center'}]}>
					<View style={{justifyContent:'center', alignItems:'center'}}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("POSITION_COPY_TRADE").replace("{1}", rowData.followUser.nickname)}</CustomStyleText>					
						<Image source={{uri:rowData.followUser.picUrl}} 
							style={{height:20,width:20, borderRadius:10}}></Image>
					</View>
				</View>
			)
		}else{
			return null;
		}
	}

	renderItem(data){
		var rowData = data.item;
		var rowID = data.index;

		var profitPercentage = 0
		var profitAmount = rowData.upl
		if (rowData.settlePrice !== 0) {
			profitPercentage = (this.getLastPrice(rowData) - rowData.settlePrice) / rowData.settlePrice * rowData.leverage
			profitPercentage *= (rowData.isLong ? 1 : -1)
			profitAmount = profitPercentage * rowData.invest
		}
		var topLine = rowData.security.name
		var bottomLine = rowData.security.symbol

		var rowHeaderHeight = UIConstants.ITEM_ROW_HEIGHT;

		var touchableStyle={height:rowHeaderHeight,
			//borderWidth:0,
			//borderColor: ColorConstants.stock_color(profitAmount),
			backgroundColor:ColorConstants.stock_color(profitAmount),
			justifyContent:'center'}
		if(this.state.selectedRow == rowID){
			//touchableStyle.borderBottomWidth = 0;
			touchableStyle.borderTopLeftRadius = UIConstants.ITEM_ROW_BORDER_RADIUS;
			touchableStyle.borderTopRightRadius = UIConstants.ITEM_ROW_BORDER_RADIUS;
		}else{
			touchableStyle.borderRadius = UIConstants.ITEM_ROW_BORDER_RADIUS;
		}

		// var rowBackgroundColor = profitAmount > 0 ? "green" : profitAmount < 0 ? "red" : "gray";

		var additionalStyle = {}
		var additionalOuterStyle = {};
		if(rowID == 0){
			//additionalStyle.marginTop = UIConstants.ITEM_ROW_MARGIN_VERTICAL;
			additionalOuterStyle.marginTop = UIConstants.ITEM_ROW_MARGIN_VERTICAL - SHADOW_TOP;
		}

		if(this.state.stockInfoRowData && rowID == this.state.stockInfoRowData.length-1){
			additionalOuterStyle.marginBottom = UIConstants.ITEM_ROW_MARGIN_VERTICAL - SHADOW_BOTTOM;
			additionalStyle.marginBottom = SHADOW_BOTTOM;
		}

		var displayRowHeight = UNSELECTED_ROW_HEIGHT + SHADOW_TOP + SHADOW_BOTTOM + this.getDetailContainerHeight(rowID);
		//var rowHeight = UIConstants.ITEM_ROW_HEIGHT + SHADOW_TOP + SHADOW_BOTTOM;
		var rowWidth = width - UIConstants.ITEM_ROW_MARGIN_HORIZONTAL * 2 + SHADOW_LEFT + SHADOW_RIGHT;

		return (
			<View style={[styles.outerRowContainer, additionalOuterStyle]}>
				<NinePatchView
						style={{height: displayRowHeight, width:rowWidth, position:'absolute', top:0, left:0, bottom:0, right:0,}}
						source={Platform.OS === 'android' ? {uri: 'row_background'} : require('../../images/row_background.png')}
						capInsets={{top: 30, left: 40, bottom: 55, right: 26}}/>
				<View style={[styles.rowContainer, additionalStyle]}>
					<TouchableOpacity style={[styles.rowTouchable,
							touchableStyle
						]} activeOpacity={1} onPress={() => this.stockPressed(rowData, rowID)}>
						<View style={[styles.rowWrapper, {height: UNSELECTED_ROW_HEIGHT}]} key={rowData.key}>
							<View style={styles.rowLeftPart}>							
								<CustomStyleText style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
									{topLine}
								</CustomStyleText>
								{this.renderStockStatus(rowData)}
							</View>

							<View style={{flexDirection: 'row', alignItems: 'center', 
								position:'absolute',
								bottom: 0,
								left: ROW_PADDING}}>
								{this.renderFollowStatus(rowData)}
							</View>

							<View style={styles.rowCenterPart}>
								{this.renderProfit(profitAmount, null)}
							</View>

							<View style={styles.rowRightPart}>
								{this.renderProfit(profitPercentage * 100, "%")}
							</View>
						</View>
					</TouchableOpacity>
					{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData, rowID): null}
				</View>
			</View>
		);
	}

	renderLoadingText() {
		if(this.state.stockInfoRowData.length === 0){
			if(this.state.isDataLoading) {
				return (
					<View style={styles.loadingTextView}>
						<CustomStyleText style={styles.loadingText}>{LS.str("DATA_LOADING")}</CustomStyleText>
					</View>
				);
			}else{
				return this.renderEmpty();
			}
		}
	}

	renderEmpty(){
		return (
			<View style={styles.loadingTextView}>
				<CustomStyleText style={styles.loadingText}>{LS.str("POSITION_HOLD_NO_ITEMS")}</CustomStyleText>
			</View>
		);
	}

	renderContent(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator 
					isBlue={false}
					onRefresh={()=>this.loadOpenPositionInfo()}
					refreshing={this.state.isDataLoading}/>
			)
		}else{
			return(
				<View style={{flex:1}}>
					{this.renderLoadingText()}
					{/* <RefreshableFlatList */}
					<FlatList
						style={{flex:1}}
						ref={(ref) => { this.flatListRef = ref;}}
						data={this.state.stockInfoRowData}
						//FlatList configuration
						refreshing={this.state.isRefreshing}
						onRefresh={()=>this.refresh()}
						getItemLayout={(data, index) => this.getItemLayout(data, index)}
						keyExtractor={(item, index) => index.toString()}
						renderItem={(data)=>this.renderItem(data)}
						//RefreshableFlatList configuration
						// onRefreshing={()=>this.refresh()}
						// onLoadMore={() => new Promise((resolve) => {							
						// 	this.loadOpenPositionInfo(resolve);
						// })}
						// showBottomIndicator={!this.state.isRefreshing}
						// showBottomIndicator={this.state.hasMore}
						// topPullingPrompt="下拉刷新数据"
						// topHoldingPrompt="下拉刷新数据"
						// topRefreshingPrompt="刷新数据中..."
						// bottomPullingPrompt="下拉载入更多"
						// bottomHoldingPrompt="下拉载入更多"
						// bottomRefreshingPrompt="载入数据中..."
					/>
					{this.renderOrderFinishedModal()}
				</View>
			)
		}
	}

	renderOrderFinishedModal(){
        return (
            <StockOrderInfoModal ref='orderFinishedModal'/>
        );
    }

	render() {
		return (
			this.renderContent()
		)
    }
}

const styles = StyleSheet.create({
	list: {
		alignSelf: 'stretch',
		flex:1,
		padding:0,
		margin:0
	},

	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	outerRowContainer:{		
		marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL - SHADOW_LEFT,
		marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL - SHADOW_RIGHT,
		marginTop: OUTER_ROW_MARGIN_TOP - SHADOW_TOP,
        marginBottom: UIConstants.ITEM_ROW_MARGIN_VERTICAL - OUTER_ROW_MARGIN_TOP - SHADOW_BOTTOM,
	},

    rowContainer: {    
        // margin:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
        // marginTop: 0,
		// marginBottom: UIConstants.ITEM_ROW_MARGIN_VERTICAL,

		marginLeft: SHADOW_LEFT,
		marginRight: SHADOW_RIGHT,
		marginTop: SHADOW_TOP,
        marginBottom: SHADOW_BOTTOM,
	},
	
	rowTouchable: {
		paddingTop:ROW_SIMPLE_CONTENT_PADDING,
		paddingBottom:ROW_SIMPLE_CONTENT_PADDING,
		height: UIConstants.ITEM_ROW_HEIGHT,
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
        alignItems: 'center',
        paddingLeft: ROW_PADDING,
		paddingRight: ROW_PADDING,
		flex:1,
	},

	rowLeftPart: {
		flex: 4,
		alignItems: 'center',
		flexDirection:'row',		
		paddingLeft: 0,
	},

	rowCenterPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
	},

	rowRightPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 0,
		alignItems: 'flex-end',
	},

	stockNameText: {
		fontSize: UIConstants.STOCK_ROW_NAME_FONT_SIZE,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
		color: 'white',
	},

	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
	},

	stockPercentText: {
		fontSize: UIConstants.STOCK_ROW_PRICE_FONT_SIZE,
		color: '#ffffff',
		//fontWeight: 'normal',
	},

	darkSeparator: {
		marginLeft: ROW_PADDING,
		marginRight: ROW_PADDING,
		height: 0.5,
		backgroundColor: '#dfdfdf',
	},

	extendWrapper: {
		//borderWidth: 0,//Platform.OS == "android" ? 0 : 1,
		// borderTopWidth:0,
		// borderColor:'#f1f1f1',
		borderBottomLeftRadius: UIConstants.ITEM_ROW_BORDER_RADIUS,
		borderBottomRightRadius: UIConstants.ITEM_ROW_BORDER_RADIUS,
		alignItems: 'stretch',
		justifyContent: 'space-around',
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		height: ROW_HEIGHT,
	},

	extendLeft: {
		flex: 1,
		//minWidth:50,
		alignItems: 'flex-start',
		marginLeft: ROW_PADDING,
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendMiddle: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: ROW_PADDING,
		paddingTop: 8,
		paddingBottom: 8,
	},

	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
	extendImageBottom: {
		width: 24,
		height: 24,
    },

	netIncomeText: {
		fontSize: 14,
		color: '#e60b11',
		alignSelf: 'center',
		marginTop: 10,
	},

	rightTopBorder: {
		borderRightWidth: 1,
		borderRightColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
		borderTopWidth: 1,
		borderTopColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
	},
	bottomBorder: {
		borderBottomWidth: 1,
        borderBottomColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
	},
	leftTopRightBorder: {
		borderLeftWidth: 1,
		borderLeftColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
		borderRightWidth: 1,
		borderRightColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
		borderTopWidth: 1,
		borderTopColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
	},
	leftTopBorder: {
		borderLeftWidth: 1,
		borderLeftColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
		borderTopWidth: 1,
		borderTopColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
	},

	priceText: {
		marginTop: 5,
		marginBottom: 5,
		fontSize: 8,
		textAlign: 'center',
		color: '#ffffff',
		backgroundColor: 'transparent',
	},

	chartTitleTextHighlighted: {
		fontSize: 15,
		textAlign: 'center',
		color: '#70a5ff',
	},
	chartTitleText: {
		fontSize: 15,
		textAlign: 'center',
		color: '#7d7d7d'
	},

	subDetailRowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},

	sliderView: {
		paddingLeft: ROW_PADDING,
		paddingRight: ROW_PADDING,
	},
	slider: {
		marginLeft: Platform.OS === 'ios' ? ROW_PADDING : 0,
		marginRight: Platform.OS === 'ios' ? ROW_PADDING : 0,
		height: 40,
		//flex: 1,
	},
	sliderLeftText: {
		fontSize: 12,
		color: '#909090',
		textAlign: 'left',
		flex: 1,
		marginTop: -4,
		marginBottom: 6,
	},
	sliderRightText: {
		fontSize: 12,
		color: '#909090',
		textAlign: 'right',
		flex: 1,
		marginTop: -4,
		marginBottom: 6,
	},

	loadingTextView: {
		position: 'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

	headerCell: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
	headerText: {
		fontSize: 14,
		textAlign: 'center',
		color:'#576b95',
	},

	headerTextLeft: {
		fontSize: 14,
		textAlign: 'left',
		color:'#576b95',
	},

	dataStatus:{
		position:'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		width:width,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'transparent',

	},
	dataStatus2:{
		alignItems:'center',
		justifyContent:'center',
		width:width - 48,
		height:120,
	},
	textDataStatus:{
		color:'black',
		marginTop:5,
	},
	tipsLine:{
		fontSize:9,
		color:'#5b7eb9',
		marginRight:10,
		alignSelf:'flex-end',
	},
	statusLableContainer: {
		backgroundColor: '#999999',
		borderRadius: 2,
		paddingLeft: 1,
		paddingRight: 1,
		marginRight: 2,
	},
	statusLable:{
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},
	stopProfitLossInputBox:	{
		flexDirection:'row',
		alignSelf: "stretch",
		alignItems: 'center',
		justifyContent:'center',
		height: 31,
		borderWidth:1,
		borderRadius:10,
        marginLeft: 15,
        borderColor: ColorConstants.COLOR_MAIN_THEME_BLUE
	},
	stopProfitLossInputBoxText: {
		flex: 1,
		color: "#000000",
		textAlign:'center',
		padding: 0,
	},
	followIcon:{
		width:23,
		height:12,
	},
	statusIcon:{
		width:22,
		height:22,
		marginLeft:5
	}
});


module.exports = MyPositionTabHold;
