import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
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
	ListView
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock') 
var {height, width} = Dimensions.get('window');

var DEFAULT_PERCENT = -1
var stopProfitPercent = DEFAULT_PERCENT
var MAX_LOSS_PERCENT = -90
var stopLossPercent = MAX_LOSS_PERCENT
var stopProfitUpdated = false
var stopLossUpdated = false
var isWaiting = false

var stockNameFontSize = Math.round(17*width/375.0)

const ROW_PADDING = 15;
const ROW_SIMPLE_CONTENT_PADDING = 10;
const ROW_SIMPLE_CONTENT_HEIGHT = 40 + ROW_SIMPLE_CONTENT_PADDING * 2;
const SIMPLE_ROW_HEIGHT = ROW_SIMPLE_CONTENT_HEIGHT + ROW_PADDING + 2;
const STOP_PROFIT_LOSS_SMALL_HEIGHT = 100;

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

	constructor(props){
        super(props)

        this.state = {			
			stockInfoRowData: [],
			selectedRow: -1,
			selectedSubItem: 0,
			stockDetailInfo: [],
			showExchangeDoubleCheck: false,
			stopProfitSwitchIsOn: false,
			stopLossSwitchIsOn: false,
			profitLossUpdated: false,
			profitLossConfirmed: false,
			isClear:false,
			contentLoaded: false,
			isRefreshing: false,
			dataStatus:0,//0正常 1等待刷新 2加载中
			// height: UIConstants.getVisibleHeight(),
			totalCount:0,
			isFocused: false,
		};
    }

	componentDidMount() {
		this.loadOpenPositionInfo();
	}

	clearViews(){
		this.setState({
			isClear:true,
			stockInfoRowData: [],
			selectedRow: -1,
			selectedSubItem: 0,
			stockDetailInfo: [],
			showExchangeDoubleCheck: false,
			stopProfitSwitchIsOn: false,
			stopLossSwitchIsOn: false,
			profitLossUpdated: false,
			profitLossConfirmed: false,
			contentLoaded: false,
			isRefreshing: false,
        });
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

				//Only use the fxdata for non-usd
				
                if (rowData.fxData && rowData.fxData.ask) {
                    profitAmount = this.calculateProfitWithOutright(profitAmount, rowData.fxData)
                }	else if(rowData.fxOutright && rowData.fxOutright.ask){
                    profitAmount = this.calculateProfitWithOutright(profitAmount, rowData.fxOutright)
                } else {
                    profitAmount = rowData.upl
                }
				
			}
			totalCount += profitAmount;

		};

		this.setState({
			totalCount:totalCount
		})
	}

	loadOpenPositionInfo() {
		var stockInfo = [{ id: '143179255888',
            security: 
            { lastOpen: '2018-02-05T23:00:00.405Z',
            lastClose: '2018-02-05T22:00:00.252Z',
            minInvestUSD: 50,
            maxLeverage: 50,
            smd: 0.001,
            gsmd: 0.006,
            ccy: 'USD',
            isPriceDown: false,
            assetClass: 'Commodities',
            dcmCount: 1,
            bid: 1343.9,
            ask: 1344.7,
            id: 34821,
            symbol: 'GOLDS',
            name: '黄金',
            preClose: 1333.4,
            open: 1339.6,
            last: 1344.3,
            isOpen: true,
            status: 1 },
            invest: 99.99999761866664,
            isLong: true,
            leverage: 15,
            settlePrice: 1277.8,
            quantity: 0.11738926,
            upl: 77.59430086000035,
            createAt: '2017-11-16T06:46:15.975Z',
            stopPx: 1192.7,
            stopOID: '143179255889',
            financingSum: -11.875,
            score: 0 },
        { id: '142489407298',
            security: 
            { lastOpen: '2018-02-05T22:05:00.461Z',
            lastClose: '2018-02-05T22:00:00.234Z',
            minInvestUSD: 50,
            maxLeverage: 100,
            smd: 0.0005,
            gsmd: 0.003,
            ccy: 'USD',
            isPriceDown: false,
            assetClass: 'Currencies',
            dcmCount: 5,
            bid: 1.39607,
            ask: 1.39637,
            id: 34817,
            symbol: 'GBPUSD',
            name: '英镑/美元',
            preClose: 1.40014,
            open: 1.396,
            last: 1.39622,
            isOpen: true,
            status: 1 },
            invest: 99.99999963332,
            isLong: true,
            leverage: 100,
            settlePrice: 1.29578,
            quantity: 0.77173594,
            upl: 773.973974226,
            createAt: '2017-09-04T06:13:35.868Z',
            stopPx: 1.28283,
            stopOID: '142489407299',
            financingSum: -138.2558,
            score: 0 },
        { id: '142431927313',
            security: 
            { lastOpen: '2018-02-05T23:00:00.417Z',
            lastClose: '2018-02-05T22:00:00.261Z',
            minInvestUSD: 50,
            maxLeverage: 100,
            smd: 0.0005,
            gsmd: 0.003,
            ccy: 'USD',
            isPriceDown: false,
            assetClass: 'Stock Indices',
            dcmCount: 2,
            bid: 2559,
            ask: 2559.75,
            id: 34857,
            symbol: 'SPX',
            name: '华尔街',
            preClose: 2639.93,
            open: 2618.68,
            last: 2559.38,
            isOpen: true,
            status: 1 },
            invest: 99.9999991781,
            isLong: true,
            leverage: 100,
            settlePrice: 2433.95,
            quantity: 0.41085478,
            upl: 513.77390239,
            createAt: '2017-08-29T06:25:23.342Z',
            stopPx: 2409.62,
            stopOID: '142431927314',
            financingSum: -174.4583,
            dividendSum: 65.3438,
            score: 0 },
        { id: '142431927304',
            security: 
            { lastOpen: '2018-02-05T23:00:00.417Z',
            lastClose: '2018-02-05T22:00:00.261Z',
            minInvestUSD: 50,
            maxLeverage: 100,
            smd: 0.0005,
            gsmd: 0.003,
            ccy: 'USD',
            isPriceDown: false,
            assetClass: 'Stock Indices',
            dcmCount: 2,
            bid: 2559,
            ask: 2559.75,
            id: 34857,
            symbol: 'SPX',
            name: '华尔街',
            preClose: 2639.93,
            open: 2618.68,
            last: 2559.38,
            isOpen: true,
            status: 1 },
            invest: 99.9999982236,
            isLong: true,
            leverage: 100,
            settlePrice: 2434.2,
            quantity: 0.41081258,
            upl: 512.69409984,
            createAt: '2017-08-29T06:25:17.42Z',
            stopPx: 2409.86,
            stopOID: '142431927305',
            financingSum: -174.4398,
            dividendSum: 65.3373,
            score: 0 },
        { id: '142241411873',
            security: 
            { lastOpen: '2018-02-05T23:00:00.405Z',
            lastClose: '2018-02-05T22:00:00.252Z',
            minInvestUSD: 50,
            maxLeverage: 50,
            smd: 0.001,
            gsmd: 0.006,
            ccy: 'USD',
            isPriceDown: false,
            assetClass: 'Commodities',
            dcmCount: 1,
            bid: 1343.9,
            ask: 1344.7,
            id: 34821,
            symbol: 'GOLDS',
            name: '黄金',
            preClose: 1333.4,
            open: 1339.6,
            last: 1344.3,
            isOpen: true,
            status: 1 },
            invest: 49.999997803333336,
            isLong: true,
            leverage: 30,
            settlePrice: 1265.5,
            quantity: 0.11853022,
            upl: 92.92769248,
            createAt: '2017-08-09T02:59:30.605Z',
            stopPx: 1223.4,
            stopOID: '142241411874',
            financingSum: -27.3291,
            score: 0 },
        { id: '142070468047',
            security: 
            { lastOpen: '2018-02-06T01:30:00.221Z',
            lastClose: '2018-02-05T07:59:00.513Z',
            minInvestUSD: 50,
            maxLeverage: 4,
            smd: 0.0125,
            gsmd: 0.25,
            ccy: 'HKD',
            isPriceDown: false,
            assetClass: 'Single Stocks',
            dcmCount: 2,
            bid: 38.58,
            ask: 38.87,
            id: 38241,
            symbol: '2601 HK',
            name: 'China Pacific Insurance Group Co',
            tag: 'HK',
            preClose: 41.03,
            open: 41.03,
            last: 38.73,
            isOpen: true,
            status: 1 },
            invest: 3902.999999976,
            isLong: true,
            leverage: 1,
            settlePrice: 34.65,
            quantity: 112.64069264,
            upl: 56.32751267021249,
            createAt: '2017-07-24T05:42:01.995Z',
            stopPx: 0.000001,
            stopOID: '142070468048',
            takePx: 63.21954518508912,
            takeOID: '143076673694',
            financingSum: 0,
            fxOutright: { bid: 7.781, ask: 7.859, id: 29528, symbol: 'USDHKD' },
            score: 0 },
        { id: '142070468010',
            security: 
            { lastOpen: '2018-02-06T01:30:00.237Z',
            lastClose: '2018-02-05T07:59:00.518Z',
            minInvestUSD: 50,
            maxLeverage: 4,
            smd: 0.0125,
            gsmd: 0.25,
            ccy: 'HKD',
            isPriceDown: true,
            assetClass: 'Single Stocks',
            dcmCount: 4,
            bid: 23.4295,
            ask: 23.6207,
            id: 38263,
            symbol: '3333 HK',
            name: 'Evergrande Real Estate Group',
            tag: 'HK',
            preClose: 25.3251,
            open: 25.3251,
            last: 23.5251,
            isOpen: true,
            status: 1 },
            invest: 3902.99999995546,
            isLong: true,
            leverage: 1,
            settlePrice: 17.5124,
            quantity: 222.87065165,
            upl: 167.80098395192962,
            createAt: '2017-07-24T05:37:09.038Z',
            stopPx: 0.000001,
            stopOID: '142070468011',
            financingSum: 0,
            fxOutright: { bid: 7.781, ask: 7.859, id: 29528, symbol: 'USDHKD' },
            score: 0 },
        { id: '142070409327',
            security: 
            { lastOpen: '2018-02-06T01:30:00.237Z',
            lastClose: '2018-02-05T07:59:00.518Z',
            minInvestUSD: 50,
            maxLeverage: 4,
            smd: 0.0125,
            gsmd: 0.25,
            ccy: 'HKD',
            isPriceDown: true,
            assetClass: 'Single Stocks',
            dcmCount: 4,
            bid: 23.4295,
            ask: 23.6207,
            id: 38263,
            symbol: '3333 HK',
            name: 'Evergrande Real Estate Group',
            tag: 'HK',
            preClose: 25.3251,
            open: 25.3251,
            last: 23.5251,
            isOpen: true,
            status: 1 },
            invest: 3902.999999871637,
            isLong: true,
            leverage: 1,
            settlePrice: 17.4923,
            quantity: 223.12674719,
            upl: 168.56446410694338,
            createAt: '2017-07-24T05:28:15.668Z',
            stopPx: 0.000001,
            stopOID: '142070409328',
            financingSum: 0,
            fxOutright: { bid: 7.781, ask: 7.859, id: 29528, symbol: 'USDHKD' },
            score: 0 },
        { id: '142070387950',
            security: 
            { lastOpen: '2018-02-06T01:30:00.221Z',
            lastClose: '2018-02-05T07:59:00.513Z',
            minInvestUSD: 50,
            maxLeverage: 4,
            smd: 0.0125,
            gsmd: 0.25,
            ccy: 'HKD',
            isPriceDown: false,
            assetClass: 'Single Stocks',
            dcmCount: 2,
            bid: 38.58,
            ask: 38.87,
            id: 38241,
            symbol: '2601 HK',
            name: 'China Pacific Insurance Group Co',
            tag: 'HK',
            preClose: 41.03,
            open: 41.03,
            last: 38.73,
            isOpen: true,
            status: 1 },
            invest: 3902.99999996775,
            isLong: true,
            leverage: 2,
            settlePrice: 34.55,
            quantity: 225.93342981,
            upl: 115.85592596186538,
            createAt: '2017-07-24T05:17:03.997Z',
            stopPx: 17.28,
            stopOID: '142070387951',
            financingSum: -13.3639,
            fxOutright: { bid: 7.781, ask: 7.859, id: 29528, symbol: 'USDHKD' },
            score: 0 },
        { id: '140369135160',
            security: 
            { lastOpen: '2018-02-05T23:00:00.444Z',
            lastClose: '2018-02-05T22:00:00.275Z',
            minInvestUSD: 50,
            maxLeverage: 100,
            smd: 0.0005,
            gsmd: 0.003,
            ccy: 'EUR',
            isPriceDown: false,
            assetClass: 'Stock Indices',
            dcmCount: 1,
            bid: 11851.2,
            ask: 11853.2,
            id: 34820,
            symbol: 'DAX',
            name: 'Germany 30 Rolling (1 EUR Contract)',
            preClose: 12691.5,
            open: 12174.5,
            last: 11852.2,
            isOpen: true,
            status: 1 },
            invest: 92.83758039713,
            isLong: true,
            leverage: 100,
            settlePrice: 11044.1,
            quantity: 0.84060793,
            upl: 835.4558532437172,
            createAt: '2016-12-08T02:57:42.505Z',
            stopPx: 10933.7,
            stopOID: '140369135161',
            financingSum: -325.0635,
            fxOutright: { bid: 1.23141, ask: 1.24382, id: 10876, symbol: 'EURUSD' },
            score: 0 }
		];
		
		stockInfo = stockInfo.concat(stockInfo)
        
        this.setState({
            stockInfoRowData: stockInfo,
        });
	}

	handleStockInfo(realtimeStockInfo) {
		var hasUpdate = false
		// var hasUpdateDetail = false
		var sdi = this.state.stockDetailInfo
		for (var i = 0; i < this.state.stockInfoRowData.length; i++) {
			for (var j = 0; j < realtimeStockInfo.length; j++) {
				if (this.state.stockInfoRowData[i].security.id == realtimeStockInfo[j].id &&
							this.state.stockInfoRowData[i].security.last !== realtimeStockInfo[j].last) {

					this.state.stockInfoRowData[i].security.ask = realtimeStockInfo[j].ask
					this.state.stockInfoRowData[i].security.bid = realtimeStockInfo[j].bid
					this.state.stockInfoRowData[i].security.last = (realtimeStockInfo[j].ask + realtimeStockInfo[j].bid) / 2;
					hasUpdate = true;

					if(this.stopProfitLossStockId == this.state.stockInfoRowData[i].security.id ){
						this.updateStopProfitLossMinMaxValue(this.state.stockInfoRowData[i])
					}
				}
				if (this.state.stockInfoRowData[i].fxData) {
					var fxData = this.state.stockInfoRowData[i].fxData
					if (fxData.id == realtimeStockInfo[j].id &&
								fxData.last !== realtimeStockInfo[j].last) {
						fxData.last = realtimeStockInfo[j].last
						fxData.ask = realtimeStockInfo[j].ask// * 1.005	//Server has already calculated with 0.005, no need to calculate it again!
						fxData.bid = realtimeStockInfo[j].bid// * 0.995
						hasUpdate = true;
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

						this.dataToStore[i].security.ask = realtimeStockInfo[j].ask
						this.dataToStore[i].security.bid = realtimeStockInfo[j].bid
						this.dataToStore[i].security.last = (realtimeStockInfo[j].ask + realtimeStockInfo[j].bid) / 2;
						needToUpdateCache = true;
					}
				}
			}
		}
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
				selectedSubItem: 0,
				stockInfoRowData: newData,
			};
			this.setState(state)	
		} else {
			isWaiting = false
			if (this.state.selectedRow >=0) {
				newData[this.state.selectedRow].hasSelected = false
			}
			newData[rowID].hasSelected = true

			var stopProfit = rowData.takePx !== undefined
			// var stopLoss = rowData.stopPx !== undefined
			var stopLoss = this.priceToPercentWithRow(rowData.stopPx, rowData, 2) >= MAX_LOSS_PERCENT

			stopProfitPercent = DEFAULT_PERCENT
			stopLossPercent = MAX_LOSS_PERCENT
			stopProfitUpdated = false
			stopLossUpdated = false

			state = {
				selectedRow: rowID,
				selectedSubItem: 0,
				stockInfoRowData: newData,
				stopProfitSwitchIsOn: stopProfit,
				stopLossSwitchIsOn: stopLoss,
				profitLossUpdated: false,
				profitLossConfirmed: false,
			};
			this.setState(state, ()=>{
				console.log("scrollToIndex: " + rowID)
				this.scrollToCurrentSelectedItem(rowID, 0);
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
			selectedSubItem: 2,
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

		if (isWaiting) {
			return
		}
		isWaiting = true

		alert("OKPress")
		
		this.setState ({
			selectedRow: -1,
			selectedSubItem: 0,
		})
	}

	onSwitchPressed(type, value) {
		var state = {};
		if (type===1) {
			state.stopProfitSwitchIsOn = value;
			stopProfitUpdated = true
		} else{
			state.stopLossSwitchIsOn = value;
			stopLossUpdated = true
		};

		state.profitLossUpdated = true;
		this.setState(state,()=>{
			this.scrollToCurrentSelectedItem(this.state.selectedRow, 1);
		});
	}

	switchConfrim(rowData) {
		alert("switch confirm")
	}

	sendStopLossRequest(rowData, lastSelectedRow, stopLossSwitchIsOn, stopLossPercent, stopLossUpdated){
		alert("sendStopLossRequest")
	}

	sendStopProfitRequest(rowData, lastSelectedRow, resolveData, stopProfitSwitchIsOn, stopProfitPercent, stopProfitUpdated){
		alert("sendStopProfitRequest")
	}

	getLastPrice(rowData) {
		var lastPrice = rowData.isLong ? rowData.security.bid : rowData.security.ask
		// console.log(rowData.security.bid, rowData.security.ask)
		return lastPrice === undefined ? rowData.security.last : lastPrice
	}

	renderHeaderBar() {
		var strCP = "CP"
		var strYK = "YK"
		var strSYL = "SYL"

			return (
				<View style={styles.headerBar}>
					<View style={[styles.rowLeftPart, {	paddingTop: 5,}]}>
						<Text style={styles.headerTextLeft}>{strCP}</Text>
					</View>
					<View style={[styles.rowCenterPart, {	paddingRight: 10,}]}>
						<Text style={[styles.headerTextLeft, {paddingRight: 0,}]}>{strYK}</Text>
					</View>
					<View style={styles.rowRightPart}>
						<Text style={styles.headerTextLeft}>{strSYL}</Text>
					</View>
				</View>
			);
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return null
		// if(rowID == this.state.selectedRow - 1) {
		// 	return null
		// }
		// return (
		// 	<View style={styles.line} key={rowID}>
		// 		<View style={styles.separator}/>
		// 	</View>
		// );
	}

	renderStockStatus(rowData){
		if(rowData.security!==undefined){
			if(rowData.security.isOpen){
				return null;
			}else{
				// console.log('rowData.security.status = ' + rowData.security.status);
				var statusTxt = rowData.security.status == 2 ? "ZT":"BS"
				return(
					<View style={styles.statusLableContainer}>
						<Text style={styles.statusLable}>{statusTxt}</Text>
					</View>
				)
			}
		}
	}

	renderProfit(percentChange, endMark) {
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange), fontSize:textSize}]}>
				 {startMark}{percentChange} {endMark}
			</Text>
		);
	}

	renderStockMaxPriceInfo(maxPrice, maxPercentage, isTop) {
		if (maxPrice && maxPercentage)
		{
			return (
				<View style={{flexDirection: 'row'}}>
					<View style={{flex: 1, alignItems: 'flex-start', marginLeft: 20}}>
						<Text style={[styles.priceText, isTop && {color:'black'}]}>
							{maxPrice}
						</Text>
					</View>

					<View style={{flex: 1, alignItems: 'flex-end', marginRight: 20}}>
						<Text style={[styles.priceText, isTop && {color:'black'}]}>
							{maxPercentage} %
						</Text>
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
		// console.log('Rambo:stopLossPercent' + value)
		if (type === 1) {
			stopProfitPercent = value
			stopProfitUpdated = true
		}
		else {
			stopLossPercent = value
			stopLossUpdated = true
		}
		this.useNativePropsToUpdate(type, value, rowData)
	}

	percentToPrice(percent, basePrice, leverage, type, isLong) {
		//if (type === 1) {
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
		//if (type === 1) {
			return (price-basePrice)/basePrice*100*leverage * (isLong?1:-1)
		//}
		//else {
		//	return (basePrice-price)/basePrice*100*leverage * (isLong?1:-1)
		//}
	}

	priceToPercentWithRow(price, rowData, type) {
		var leverage = rowData.leverage === 0 ? 1 : rowData.leverage
		return this.priceToPercent(price, rowData.settlePrice, leverage, type, rowData.isLong)
	}

	calculateProfitWithOutright(profitAmount, fxData) {
		if (profitAmount > 0) {//want to sell XXX and buy USD
			var fxPrice
			//if (fxData.symbol.substring(UIConstants.USD_CURRENCY.length) != UIConstants.USD_CURRENCY) {//USD/XXX
				fxPrice = 1 / fxData.ask
			// } else {// XXX/USD
			// 	fxPrice = fxData.bid
			// }
			profitAmount *= fxPrice
		} else {// Want to buy XXX and sell USD
			var fxPrice
			//if (fxData.symbol.substring(UIConstants.USD_CURRENCY.length) != UIConstants.USD_CURRENCY) { // USD/XXX
				fxPrice = 1 / fxData.bid
			// } else { // XXX/USD
			// 	fxPrice = fxData.ask
			// }
			console.log("fxData" + JSON.stringify(fxData))
			profitAmount *= fxPrice
		}
		return profitAmount
	}

	renderSlider(rowData, type, startPercent, endPercent, percent) {
		//1, stop profit
		//2, stop loss
		var disabled = false
		if (type === 2) {
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
					<Text style={styles.sliderLeftText}>{startPercent.toFixed(2)}%</Text>
					<Text style={styles.sliderRightText}>{endPercent.toFixed(2)}%</Text>
				</View>
			</View>
			)
	}

	useNativePropsToUpdate(type, value, rowData){
		var price = this.percentToPriceWithRow(value, rowData, type)
		if (type === 1){
			this._text1.setNativeProps({text: value.toFixed(2)+'%'});
			this._text3.setNativeProps({text: price.toFixed(rowData.security.dcmCount)})
		}
		else if (type === 2) {
			var props = {text: value.toFixed(2)+'%'};
			if(Platform.OS === "ios"){
				props.color = value >= 0
				 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN;
			}else{
				props.style = {color: value >= 0 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN};
			}
			this._text2.setNativeProps(props);
			this._text4.setNativeProps({text: price.toFixed(rowData.security.dcmCount)})
		}
	}

	bindRef(type, component, mode){
		if (mode === 1) {
			if (type === 1){
				this._text1 = component
			}
			else if (type === 2) {
				this._text2 = component
			}
		}
		else {
			if (type === 1){
				this._text3 = component
			}
			else if (type === 2) {
				this._text4 = component
			}
		}
	}

	bindSliderRef(type, component){
		if (type === 1){
			this._slider1 = component
		}
		else if (type === 2) {
			this._slider2 = component
		}
	}

	renderStopProfitLoss(rowData, type) {

		var titleText = type===1 ?  "止盈":"止损"
		var switchIsOn = type===1 ? this.state.stopProfitSwitchIsOn : this.state.stopLossSwitchIsOn
		var price = rowData.settlePrice
		var percent = type===1 ? stopProfitPercent : stopLossPercent
		var startPercent = 0
		var endPercent = MAX_LOSS_PERCENT

		if (type === 1) {
			// stop profit
			startPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use gsmd to make sure this order is guaranteed.
			startPercent += rowData.security.smd*100*rowData.leverage

			if (startPercent < 0)
				startPercent = 0
			endPercent = startPercent + 100
			if (percent === DEFAULT_PERCENT) {
				percent = rowData.takePx === undefined ? startPercent
					: this.priceToPercentWithRow(rowData.takePx, rowData, type)
				stopProfitPercent = percent
			}
		} else{
			// stop loss
			startPercent = MAX_LOSS_PERCENT
			endPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use smd to make sure this order is guaranteed.
			endPercent -= rowData.security.gsmd*100*rowData.leverage

			if(endPercent - startPercent > 100){
				startPercent = endPercent - 100
			}

			if (!stopLossUpdated){//percent === MAX_LOSS_PERCENT) {

				percent = this.priceToPercentWithRow(rowData.stopPx, rowData, type)
				if (percent < startPercent) {
					percent = startPercent
				}
				stopLossPercent = percent
			}
		};

		var color = type===1 ? ColorConstants.STOCK_RISE_RED : ( percent >= 0 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN);

		var disabled = false
		if (type === 2) {
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
					<Text style={styles.extendLeft}>{titleText}</Text>
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
									//this.setState({isFocused: true});
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
			return 'ZYWZ' +" "+ minValue.toString()+" " + "D" +" "+ maxValue.toString()+" "+   "ZJ_";
		}else if (type == 2){
			return "ZSWZ" +" "+ minValue.toString()+" " + "D"+" " + maxValue.toString() +" "+ "ZJ_";
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
		var percent = type===1 ? stopProfitPercent : stopLossPercent
		var startPercent = 0
		var endPercent = MAX_LOSS_PERCENT

		if (type === 1) {
			// stop profit
			startPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use gsmd to make sure this order is guaranteed.
			startPercent += rowData.security.smd*100*rowData.leverage

			if (startPercent < 0)
				startPercent = 0
			endPercent = startPercent + 100
			if (percent === DEFAULT_PERCENT) {
				percent = rowData.takePx === undefined ? startPercent
					: this.priceToPercentWithRow(rowData.takePx, rowData, type)
				stopProfitPercent = percent
			}
		} else{
			// stop loss
			startPercent = MAX_LOSS_PERCENT
			endPercent = this.priceToPercentWithRow(rowData.security.last, rowData, type)
			// use smd to make sure this order is guaranteed.
			endPercent -= rowData.security.gsmd*100*rowData.leverage

			if(endPercent - startPercent > 100){
				startPercent = endPercent - 100
			}

			if (!stopLossUpdated){//percent === MAX_LOSS_PERCENT) {

				percent = this.priceToPercentWithRow(rowData.stopPx, rowData, type)
				if (percent < startPercent) {
					percent = startPercent
				}
				stopLossPercent = percent
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

		if(type === 1){
			this.stopProfitMinValue = minValue
			this.stopProfitMaxValue = maxValue
		}else if (type === 2){
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

        if(type === 1){
            previousMinValue = this.stopProfitMinValue;
            previousMaxValue = this.stopProfitMaxValue;
        }else if (type === 2){
            previousMinValue = this.stopLossMinValue;
            previousMaxValue = this.stopLossMaxValue;
        }

        console.log("updateStopProfitLossMinMaxValue 3")
        this.updateCurrentStopLossProfitMinMaxValue(rowData, type);
        if(type === 1){
            minValue = this.stopProfitMinValue;
            maxValue = this.stopProfitMaxValue;
        }else if (type === 2){
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
				{this.renderStopProfitLoss(rowData, 1)}
				{this.renderStopProfitLoss(rowData, 2)}
			</View>
		);
	}

	renderOKView(rowData) {
		var showNetIncome = false

		var profitAmount = rowData.upl
		if (rowData.settlePrice !== 0) {
			var lastPrice = this.getLastPrice(rowData)
			var profitPercentage = (lastPrice - rowData.settlePrice) / rowData.settlePrice * rowData.leverage

			profitPercentage *= (rowData.isLong ? 1 : -1)
			profitAmount = profitPercentage * rowData.invest

			profitAmount = rowData.upl;
		}

		var buttonText = (profitAmount < 0 ? "亏损":"获利") + ': $' + profitAmount.toFixed(2)
		if (this.state.showExchangeDoubleCheck) {
			buttonText = "确认"+':' + profitAmount.toFixed(2)
		}

		var separatorStyle = styles.darkSeparator;
        var buttonStyle = [styles.okView];
		var buttonTextStyle = [styles.okButton];
		if(this.state.selectedSubItem === 2){
			var buttonText = "确认"
			if (!this.state.profitLossUpdated && this.state.profitLossConfirmed) {
				buttonText = "已设置"
			}
			//separatorStyle = {backgroundColor: 'pink'};
			buttonStyle = [styles.okView]
			buttonTextStyle = [styles.okButton];
			if(rowData.isSettingProfitLoss){
				buttonText = "请稍后"
				buttonStyle = [styles.okView];
				buttonTextStyle = [styles.okButton];
			}
		}
		return(
			<View>
				<View style={separatorStyle}/>
				{showNetIncome ? <Text style={styles.netIncomeText}>净收益:9.26</Text> : null}

				<TouchableOpacity
					onPress={()=>this.state.selectedSubItem === 2 ? this.switchConfrim(rowData) : this.okPress(rowData)}
					style={buttonStyle}
					>
                    <ImageBackground source={require("../../images/position_confirm_button.png")}
                        style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                        <Text style={buttonTextStyle}>
                            {buttonText}
                        </Text>
                    </ImageBackground>
				</TouchableOpacity>
			</View>)
	}

	renderDetailInfo(rowData) {
		var tradeImage = rowData.isLong ? require('../../images/stock_detail_direction_up_enabled.png') : require('../../images/stock_detail_direction_down_enabled.png')
        var lastPrice = this.getLastPrice(rowData)
        
		// console.log('RAMBO rowData.id = ' + rowData.security.id)
		var stopLossImage = require('../../images/position_stop_profit_loss.png')
		var stopLoss = this.priceToPercentWithRow(rowData.stopPx, rowData, 2) >= MAX_LOSS_PERCENT
		var stopProfit = rowData.takePx !== undefined

		var currentPriceLabel = rowData.isLong ? "当前卖价" : "当前买价"
		var openDate = new Date(rowData.createAt)
		
		var financing_dividend_sum = 0;
		if(rowData.financingSum){
			financing_dividend_sum += rowData.financingSum;
		}
		if(rowData.dividendSum){
			financing_dividend_sum += rowData.dividendSum;
		}

		return (
			<View style={[styles.extendWrapper]} >
				<View style={[styles.darkSeparator, styles.firstSeparator]} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>{"类型"}</Text>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>{"糖果"}</Text>
						<Text style={styles.extendTextBottom}>{rowData.invest.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{"倍数"}</Text>
						<Text style={styles.extendTextBottom}>{rowData.leverage}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>{"开仓价格"}</Text>
						<Text style={styles.extendTextBottom}>{rowData.settlePrice.maxDecimal(5)}</Text>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>{currentPriceLabel}</Text>
						<Text style={styles.extendTextBottom}>{lastPrice.maxDecimal(5)}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</Text>
					</View>
				</View>
                <View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={[styles.extendLeft, this.state.selectedSubItem==2 && styles.bottomBorder]}/>
					<TouchableOpacity onPress={()=>this.subItemPress(rowData)}
						style={[styles.extendMiddle, (this.state.selectedSubItem===1)&&styles.bottomBorder,
								(this.state.selectedSubItem===2)&&styles.leftTopRightBorder,
								{borderTopColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderBottomColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderLeftColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
								{borderRightColor:ColorConstants.COLOR_MAIN_THEME_BLUE},
							]}>
						<Text style={styles.extendTextTop}>止盈/止损</Text>
						<Image style={styles.extendImageBottom} source={stopLossImage}/>
					</TouchableOpacity>

					<View style={[styles.extendRight, this.state.selectedSubItem==2 && styles.bottomBorder, ]}/>
				</View>

				{this.state.selectedSubItem !== 0 ? this.renderSubDetail(rowData): null}

				{this.renderOKView(rowData)}
			</View>
		);
	}

	getItemLayout(data, index){
		var smallItemHeight = SIMPLE_ROW_HEIGHT;
		var bigItemHeight = 277 + ROW_PADDING;
		var itemHeight = smallItemHeight;
		if(this.state.selectedSubItem === 2){
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
		console.log("index " + index + ", height: " + itemHeight);
		return {
			length: itemHeight, 
			offset: offset - 4,
			index: index};
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
        		
		return (
			<View style={styles.rowContainer}>
				<TouchableOpacity style={styles.rowTouchable} activeOpacity={1} onPress={() => this.stockPressed(rowData, rowID)}>
					<View style={[styles.rowWrapper]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{topLine}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{/* {this.renderCountyFlag(rowData)} */}
								{this.renderStockStatus(rowData)}
								<Text style={styles.stockSymbolText}>
									{bottomLine}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(profitAmount, null)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(profitPercentage * 100, "%")}
						</View>
					</View>
				</TouchableOpacity>
				{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	}

	renderLoadingText() {
		var strZWCCJL = "暂无持仓记录"
		if(this.state.stockInfoRowData.length === 0) {
			return (
				<View style={styles.loadingTextView}>
					<Text style={styles.loadingText}>{strZWCCJL}</Text>
				</View>
				)
		}
	}

	renderOrClear(){
		if(this.state.isClear){
			return(<View style={{height:10000}}></View>)
		}
	}

	renderContent(){
		// if(!this.state.contentLoaded){
		// 	return (
		// 		<NetworkErrorIndicator onRefresh={()=>this.loadOpenPositionInfo()} refreshing={this.state.isRefreshing}/>
		// 	)
		// }else{
			return(
				<View style={{flex:1}}>
					{this.renderOrClear()}
					{this.renderLoadingText()}
					<FlatList
						style={styles.list}
						ref={(ref) => { this.flatListRef = ref; }}
						data={this.state.stockInfoRowData}
						getItemLayout={(data, index) => this.getItemLayout(data, index)}
						keyExtractor={(item, index) => index}
						renderItem={(data)=>this.renderItem(data)}
					/>
					{/* <StockTransactionInfoModal ref='confirmPage'/> */}
				</View>
			)
		//}
	}

	render() {
		// var viewStyle = Platform.OS === 'android' ?
		// 	{	width: width,
		// 		height: this.state.height
		// 		- UIConstants.HEADER_HEIGHT
		// 		- UIConstants.SCROLL_TAB_HEIGHT
		// 		- UIConstants.TAB_BAR_HEIGHT,
		// 	}:
		// 	{width: width, flex: 1}
		return (
			// <View style={viewStyle}>
				this.renderContent()
			// </View>
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

	line: {
		height: 0.5,
		backgroundColor: 'white',
	},

	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

    rowContainer: {
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:10,      
        margin:ROW_PADDING,
        marginTop: 5,
		marginBottom: ROW_PADDING-5,
	},
	
	rowTouchable: {
		paddingTop:ROW_SIMPLE_CONTENT_PADDING,
		paddingBottom:ROW_SIMPLE_CONTENT_PADDING,
		height: ROW_SIMPLE_CONTENT_HEIGHT,
	},

	rowWrapper: {
		flexDirection: 'row',
		alignSelf: 'stretch',
        alignItems: 'center',
        paddingLeft: ROW_PADDING,
		paddingRight: ROW_PADDING,
	},

	stockCountryFlagText: {
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},

	rowLeftPart: {
		flex: 3,
		alignItems: 'flex-start',
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
		fontSize: stockNameFontSize,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
		color: '#505050',
	},

	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
	},

	stockPercentText: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'normal',
	},

    firstSeparator: {
        marginLeft: ROW_PADDING,
        marginRight: ROW_PADDING, 
        marginTop:0
    },

	darkSeparator: {
		marginLeft: ROW_PADDING,
		height: 0.5,
		backgroundColor: '#dfdfdf',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		height: 51,
	},

	extendLeft: {
		flex: 1,
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

	okView: {
		width: 332,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'center',
	},
    
	okButton: {
		color: 'white',
		textAlign: 'center',
		fontSize: 17,
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
		alignItems: 'center',
		paddingTop: 180,
		backgroundColor: 'transparent'
	},
	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#d9e6f3',
		height: UIConstants.LIST_HEADER_BAR_HEIGHT,
		paddingLeft: ROW_PADDING,
		paddingRight: ROW_PADDING,
		paddingTop:2,
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
	textDataStatusRefresh:{
		color:'black',
		paddingLeft:ROW_PADDING,
		paddingRight:ROW_PADDING,
		marginTop:10,
		paddingTop:5,
		paddingBottom:5,
		borderColor:'black',
		borderRadius:4,
		borderWidth:1,
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
		backgroundColor:'white',
        marginLeft: 15,
        borderColor: ColorConstants.COLOR_MAIN_THEME_BLUE
	},
	stopProfitLossInputBoxText: {
		flex: 1,
		color: "#000000",
		textAlign:'center',
		padding: 0,
	},
});


module.exports = MyPositionTabHold;
