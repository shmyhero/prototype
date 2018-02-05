import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  CheckBox,
  Dimensions,
} from 'react-native';

import PriceChartView from './component/PriceChartView';
//var PriceChart = require('./components/PriceChart');

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";

var NetworkModule = require("../module/NetworkModule");
var ColorConstants = require("../ColorConstants");
var StockOrderInfoModal = require("./StockOrderInfoModal");

var {height, width} = Dimensions.get('window')

var containerHorizontalPadding = 15;
var rowContainerWidth = width - containerHorizontalPadding * 2;
var rowContainerHeight = rowContainerWidth / 700 * 150;
var smallContainerWidth = (width - containerHorizontalPadding * 3) / 2;
var smallContainerHeight = smallContainerWidth / 350 * 330;
var buttonPadding = 10;
var rowButtonWidth = (rowContainerWidth - buttonPadding * 4)/4;
var rowButtonHeight =  rowButtonWidth / 144 * 99;

export default class  StockDetailScreen extends React.Component {
    static navigationOptions = {
        title: '详情',
        headerMode:'none',
        headerTintColor:'#b7e1f8',
    }

    constructor(props){
        super(props)

        var state = {
            chartType: "today",
            data: null,
            selectedAmount: null,
            selectedMultiplier: null,
            stockInfo: {},
        }
        //Parse Navigation Props
        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
            state.stockCode = params.stockCode;
        }

        this.state = state;
    }

    componentDidMount(){
        //this.loadStockInfo()
        var stockInfo = { lastOpen: '2018-01-29T22:05:00.476Z',
            lastClose: '2018-01-29T22:00:00.3Z',
            longPct: 0.73256338654671,
            minValueLong: 1237,
            minValueShort: 1237,
            minInvestUSD: 50,
            maxValueLong: 309145,
            maxValueShort: 309095,
            maxLeverage: 100,
            smd: 0.0005,
            gsmd: 0.003,
            ccy: 'USD',
            isPriceDown: true,
            levList: [ 1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 70, 100 ],
            dcmCount: 5,
            bid: 1.23638,
            ask: 1.23658,
            id: 34805,
            symbol: 'EURUSD',
            name: '欧元/美元',
            preClose: 1.23861,
            open: 1.23826,
            last: 1.23648,
            isOpen: true,
            status: 1 
        }

        var priceData = [{"p":1.23527,"time":"2018-01-29T14:40:56.988Z"},{"p":1.23561,"time":"2018-01-29T14:41:56.858Z"},{"p":1.23566,"time":"2018-01-29T14:42:56.764Z"},{"p":1.23578,"time":"2018-01-29T14:43:56.824Z"},{"p":1.23574,"time":"2018-01-29T14:44:57.149Z"},{"p":1.23553,"time":"2018-01-29T14:45:56.961Z"},{"p":1.23495,"time":"2018-01-29T14:46:57.32Z"},{"p":1.23479,"time":"2018-01-29T14:47:57.177Z"},{"p":1.23507,"time":"2018-01-29T14:48:57.085Z"},{"p":1.2354,"time":"2018-01-29T14:49:57.676Z"},{"p":1.23559,"time":"2018-01-29T14:50:57.404Z"},{"p":1.23596,"time":"2018-01-29T14:51:57.32Z"},{"p":1.23598,"time":"2018-01-29T14:52:57.31Z"},{"p":1.23593,"time":"2018-01-29T14:53:57.875Z"},{"p":1.2358,"time":"2018-01-29T14:54:57.781Z"},{"p":1.23596,"time":"2018-01-29T14:55:57.752Z"},{"p":1.23625,"time":"2018-01-29T14:56:57.643Z"},{"p":1.23608,"time":"2018-01-29T14:57:57.599Z"},{"p":1.23586,"time":"2018-01-29T14:58:57.929Z"},{"p":1.23537,"time":"2018-01-29T14:59:57.878Z"},{"p":1.23554,"time":"2018-01-29T15:00:58.113Z"},{"p":1.23417,"time":"2018-01-29T16:19:53.072Z"},{"p":1.23457,"time":"2018-01-29T16:20:53.117Z"},{"p":1.23465,"time":"2018-01-29T16:21:52.983Z"},{"p":1.23474,"time":"2018-01-29T16:22:52.799Z"},{"p":1.23442,"time":"2018-01-29T16:23:53.157Z"},{"p":1.23431,"time":"2018-01-29T16:24:53.459Z"},{"p":1.23402,"time":"2018-01-29T16:25:53.316Z"},{"p":1.23429,"time":"2018-01-29T16:26:53.239Z"},{"p":1.23407,"time":"2018-01-29T16:27:53.782Z"},{"p":1.23444,"time":"2018-01-29T16:28:53.427Z"},{"p":1.23448,"time":"2018-01-29T16:29:53.352Z"},{"p":1.23475,"time":"2018-01-29T16:30:53.405Z"},{"p":1.23475,"time":"2018-01-29T16:31:53.464Z"},{"p":1.23521,"time":"2018-01-29T16:32:53.824Z"},{"p":1.2351,"time":"2018-01-29T16:33:53.517Z"},{"p":1.23491,"time":"2018-01-29T16:34:53.944Z"},{"p":1.23462,"time":"2018-01-29T16:35:53.381Z"},{"p":1.23496,"time":"2018-01-29T16:36:53.889Z"},{"p":1.23509,"time":"2018-01-29T16:37:54.317Z"},{"p":1.23453,"time":"2018-01-29T16:38:53.931Z"},{"p":1.23438,"time":"2018-01-29T16:39:54.37Z"},{"p":1.23457,"time":"2018-01-29T16:40:54.016Z"},{"p":1.23465,"time":"2018-01-29T16:41:54.481Z"},{"p":1.2346,"time":"2018-01-29T16:42:54.472Z"},{"p":1.23864,"time":"2018-01-29T20:19:58.035Z"},{"p":1.23867,"time":"2018-01-29T20:20:57.904Z"},{"p":1.23864,"time":"2018-01-29T20:21:58.414Z"},{"p":1.23866,"time":"2018-01-29T20:22:57.918Z"},{"p":1.23864,"time":"2018-01-29T20:23:57.862Z"},{"p":1.23862,"time":"2018-01-29T20:24:58.135Z"},{"p":1.23867,"time":"2018-01-29T20:25:58.222Z"},{"p":1.23861,"time":"2018-01-29T20:26:58.546Z"},{"p":1.23864,"time":"2018-01-29T20:27:58.397Z"},{"p":1.23868,"time":"2018-01-29T20:28:58.219Z"},{"p":1.23864,"time":"2018-01-29T20:29:58.762Z"},{"p":1.23852,"time":"2018-01-29T20:30:58.192Z"},{"p":1.23846,"time":"2018-01-29T20:31:58.508Z"},{"p":1.23851,"time":"2018-01-29T20:32:58.628Z"},{"p":1.23852,"time":"2018-01-29T20:33:58.617Z"},{"p":1.23853,"time":"2018-01-29T20:34:59.071Z"},{"p":1.23843,"time":"2018-01-29T20:35:58.769Z"},{"p":1.23862,"time":"2018-01-29T20:36:58.644Z"},{"p":1.23878,"time":"2018-01-29T20:37:59.15Z"},{"p":1.23885,"time":"2018-01-29T20:38:58.922Z"},{"p":1.23876,"time":"2018-01-29T20:39:59.182Z"},{"p":1.23877,"time":"2018-01-29T20:40:59.104Z"},{"p":1.23883,"time":"2018-01-29T20:41:59.038Z"},{"p":1.23877,"time":"2018-01-29T20:42:59.611Z"},{"p":1.23814,"time":"2018-01-29T21:57:53.816Z"},{"p":1.2382,"time":"2018-01-29T21:58:54.103Z"},{"p":1.23826,"time":"2018-01-29T21:59:53.739Z"},{"p":1.23818,"time":"2018-01-29T22:05:54.336Z"},{"p":1.23819,"time":"2018-01-29T22:06:54.258Z"},{"p":1.23830,"time":"2018-01-29T22:07:54.488Z"},{"p":1.23826,"time":"2018-01-29T22:08:54.505Z"},{"p":1.23822,"time":"2018-01-29T22:09:54.119Z"},{"p":1.23824,"time":"2018-01-29T22:10:54.338Z"},{"p":1.23833,"time":"2018-01-29T22:11:54.568Z"},{"p":1.23836,"time":"2018-01-29T22:12:54.952Z"},{"p":1.23830,"time":"2018-01-29T22:13:54.306Z"},{"p":1.23833,"time":"2018-01-29T22:14:54.659Z"},{"p":1.23842,"time":"2018-01-29T22:15:55.114Z"},{"p":1.23837,"time":"2018-01-29T22:16:55.105Z"},{"p":1.23838,"time":"2018-01-29T22:17:54.878Z"},{"p":1.2384,"time":"2018-01-29T22:18:55.226Z"},{"p":1.23842,"time":"2018-01-29T22:19:55.173Z"},{"p":1.23839,"time":"2018-01-29T22:20:55.418Z"},{"p":1.23839,"time":"2018-01-29T22:21:54.896Z"},{"p":1.23841,"time":"2018-01-29T22:22:55.223Z"},{"p":1.23842,"time":"2018-01-29T22:23:55.667Z"},{"p":1.2384,"time":"2018-01-29T22:24:55.5Z"},{"p":1.23839,"time":"2018-01-29T22:25:55.313Z"},{"p":1.23822,"time":"2018-01-29T22:26:55.411Z"},{"p":1.23813,"time":"2018-01-29T22:27:55.506Z"},{"p":1.23808,"time":"2018-01-29T22:28:55.341Z"},{"p":1.23822,"time":"2018-01-29T22:29:55.686Z"},{"p":1.23809,"time":"2018-01-29T22:30:55.847Z"},{"p":1.23817,"time":"2018-01-29T22:31:55.664Z"},{"p":1.23812,"time":"2018-01-29T22:32:55.795Z"},{"p":1.23814,"time":"2018-01-29T22:33:56.229Z"},{"p":1.23805,"time":"2018-01-29T22:34:56.049Z"},{"p":1.23815,"time":"2018-01-29T22:35:55.673Z"},{"p":1.23814,"time":"2018-01-29T22:36:56.283Z"},{"p":1.23812,"time":"2018-01-29T22:37:56.508Z"},{"p":1.23813,"time":"2018-01-29T22:38:55.884Z"},{"p":1.23808,"time":"2018-01-29T22:39:56.367Z"},{"p":1.23809,"time":"2018-01-29T22:40:56.03Z"},{"p":1.23813,"time":"2018-01-29T22:41:56.668Z"},{"p":1.23811,"time":"2018-01-29T22:42:56.589Z"},{"p":1.23814,"time":"2018-01-29T22:43:55.02Z"},{"p":1.23812,"time":"2018-01-29T22:44:56.55Z"},{"p":1.2381,"time":"2018-01-29T22:45:57.013Z"},{"p":1.23807,"time":"2018-01-29T22:46:56.352Z"},{"p":1.23802,"time":"2018-01-29T22:47:56.794Z"},{"p":1.23797,"time":"2018-01-29T22:48:56.626Z"},{"p":1.23803,"time":"2018-01-29T22:49:56.515Z"},{"p":1.23803,"time":"2018-01-29T22:50:56.87Z"},{"p":1.23797,"time":"2018-01-29T22:51:56.821Z"},{"p":1.23785,"time":"2018-01-29T22:52:57.145Z"},{"p":1.23807,"time":"2018-01-29T22:53:56.834Z"},{"p":1.23814,"time":"2018-01-29T22:54:57.028Z"},{"p":1.23816,"time":"2018-01-29T22:55:57.47Z"},{"p":1.23814,"time":"2018-01-29T22:56:57.335Z"},{"p":1.23819,"time":"2018-01-29T22:57:57.257Z"},{"p":1.23806,"time":"2018-01-29T22:58:57.591Z"},{"p":1.23826,"time":"2018-01-29T22:59:57.5Z"},{"p":1.23833,"time":"2018-01-29T23:00:57.4Z"},{"p":1.23835,"time":"2018-01-29T23:01:57.254Z"},{"p":1.23832,"time":"2018-01-29T23:02:57.419Z"},{"p":1.23834,"time":"2018-01-29T23:03:57.875Z"},{"p":1.23838,"time":"2018-01-29T23:04:57.797Z"},{"p":1.23851,"time":"2018-01-29T23:05:57.68Z"},{"p":1.23648,"time":"2018-01-30T02:40:35.942Z"}];
        stockInfo.priceData = priceData;
        // setTimeout(()=>{
            this.setState({
                stockInfo: stockInfo,
            });
        //}, 1000);
    }

    loadStockInfo() {

        console.log('StockDetailPage loadStockInfo');
        loadStockInfoSuccess = false
        
        //TODO: Replace with real url
        var CFD_API_SERVER = 'https://api.typhoontechnology.hk';
        var url = CFD_API_SERVER + '/api/security/<stockCode>'
        url = url.replace(/<stockCode>/, this.state.stockCode)
        this.setState({
            dataStatus :2,
        })
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'GET',
                showLoading: true,
            },
            (responseJson) => {                
                loadStockInfoSuccess = true
                console.log("loadStockInfo: " + JSON.stringify(responseJson))
                console.log("responseJson.minInvestUSD: " + responseJson.minInvestUSD)
                var minInvestUSD = 50;
                if(responseJson.minInvestUSD > 0){
                    minInvestUSD = responseJson.minInvestUSD;
                }

                console.log("minInvestUSD: " + minInvestUSD);

                var newState = {
                    stockInfo: responseJson,
                    stockPriceBid: responseJson.bid,
                    stockPriceAsk: responseJson.ask,
                    stockLastPrice:responseJson.last,
                    stockPreclose:responseJson.preClose,
                    minInvestUSD:minInvestUSD,
                };

                if (responseJson.levList && responseJson.levList.length > 0 && !responseJson.levList.includes(this.state.leverage)){
                    newState.leverage = responseJson.levList[0];
                }

                // var MaxTradeableValueError = this.checkMaxTradeableValueError();
                // var tradeableError = MaxTradeableValueError.error;
                // var longable = MaxTradeableValueError.longable;
                // var shortable = MaxTradeableValueError.shortable;

                // newState.tradeableError = tradeableError;
                // newState.longable = longable;
                // newState.shortable = shortable;

                this.setState(newState)

                this.loadStockPriceToday(true, this.state.chartType, responseJson)         

                // if(!this.setInvestValue(this.state.money, true)){
                //     console.log("setInvestValue ")
                //     var leverageArray = this.getAvailableLeverage()
                //     var maxLeverage = leverageArray[leverageArray.length - 1];
                //         console.log("setLeverageValue " + maxLeverage)
                //     this.findAvailableInvestValue(maxLeverage);
                // }

            },
            (result) => {
                // Alert.alert('', result.errorMessage);
                this.setState({
                    dataStatus :1,
                })
            }
        )
    }

    loadStockPriceToday(showLoading, chartType, stockInfo) {  
        
        //TODO: Replace with real url
        var CFD_API_SERVER = 'https://api.typhoontechnology.hk';
		var url = CFD_API_SERVER + '/api/quote/<stockCode>/tick/<chartType>',		

		url = url.replace(/<chartType>/, chartType)
		url = url.replace(/<stockCode>/, this.state.stockCode)

		this.setState({
			dataStatus : 2
		})

		NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				showLoading: showLoading,
			},
			(responseJson) => {
                console.log("stockInfo: ")
                console.log(stockInfo)
                var tempStockInfo = stockInfo
                
				tempStockInfo.priceData = responseJson

				var maxPrice = undefined
				var minPrice = undefined
				var maxPercentage = undefined
				var minPercentage = undefined

				if (tempStockInfo.priceData != undefined && tempStockInfo.priceData.length > 0) {
					var lastClose = tempStockInfo.preClose

					maxPrice = Number.MIN_VALUE
					minPrice = Number.MAX_VALUE

					for (var i = 0; i < tempStockInfo.priceData.length; i ++) {
						var price = 0;
						if(chartType == NetConstants.PARAMETER_CHARTTYPE_5_MINUTE||
							chartType == NetConstants.PARAMETER_CHARTTYPE_DAY){
							price = tempStockInfo.priceData[i].close
						}else{
							price = tempStockInfo.priceData[i].p
						}
						if (price > maxPrice) {
							maxPrice = price
						}
						if (price < minPrice) {
							minPrice = price
						}
					}
					var maxPercentage = (maxPrice - lastClose) / lastClose * 100
					var minPercentage = (minPrice - lastClose) / lastClose * 100
					if(maxPercentage){
						maxPercentage = maxPercentage.toFixed(2)
					}
					if(minPercentage){
						minPercentage = minPercentage.toFixed(2)
					}
				}
                console.log(tempStockInfo.priceData)
				this.setState({
					stockInfo: tempStockInfo,
					maxPrice: maxPrice,
					minPrice: minPrice,
					maxPercentage: maxPercentage,
					minPercentage: minPercentage,
                    dataStatus :0,
				})

				// var previousInterestedStocks = WebSocketModule.getPreviousInterestedStocks()
				// var lastInterestedStocks = previousInterestedStocks;
				// if(previousInterestedStocks
				// 	&& previousInterestedStocks.includes //The method may be empty???
				// 	&&tempStockInfo.id){
				// 	if(!previousInterestedStocks.includes(tempStockInfo.id)){
				// 		previousInterestedStocks += ',' + tempStockInfo.id;
				// 	}
				// }else{
				// 	previousInterestedStocks = '' + tempStockInfo.id;
				// }

				// if(previousInterestedStocks != lastInterestedStocks){
				// 	WebSocketModule.registerInterestedStocks(previousInterestedStocks)
				// }
				// this.connectWebSocket();
			},
			(result) => {
				// Alert.alert('', result.errorMessage);

				this.setState({
					dataStatus :1,
				})
			},
			true
		)
	}

    onSubmitButtonPressed(){
        //TODO: Submit data
        //alert("下单啦 " + this.state.Amount + " x " + this.state.Multiplier + ", " + this.state.Operation)
        if(this.state.Amount != undefined
        && this.state.Multiplier != undefined
        && this.state.Operation != undefined){
            this.refs["orderFinishedModal"].show(
                {
                    stockName: 'Test Stock',
                    isCreate: true,
                    isLong: true,
                    invest: 0,
                    leverage: 0,
                    openPrice: 0,
                    settlePrice: 0,
                    time: new Date(),
                    titleColor: ColorConstants.TITLE_BLUE,
                    ccy: 'USD',
                    pl: 0,
                    plRate: 0,
                },
                ()=>{
                    
                });
        }
    }

    renderButtonInGroup(parameters){
        var value = parameters.value;
        var label = parameters.label ? parameters.label : value;
        var groupName = parameters.groupName;
        var additionalTextStyle = parameters.additionalTextStyle;
        var additionalContainerStyle = parameters.additionalContainerStyle;
        var customTextViewStyle = parameters.customTextViewStyle;
        // var selectedContainerStyle = parameters.selectedContainerStyle;
        var imageSource = parameters.imageSource;
        var selectedImageSource = parameters.selectedImageSource;
        var selected = this.state[groupName] == value;
        var containerStyleList = [styles.numberButton];
        var textViewStyleList = [styles.numberButtonLabel];
        var backgroundImageSource = parameters.backgroundImageSource ? parameters.backgroundImageSource : require("../../images/stock_detail_action_unselected.png")
        var selectedBackgroundImageSource = parameters.selectedBackgroundImageSource ? parameters.selectedBackgroundImageSource : require("../../images/stock_detail_action_selected_blue.png")
        if(selected){
            // if(selectedContainerStyle){
            //     containerStyleList.push(selectedContainerStyle)
            // }
            if(selectedImageSource){
                imageSource = selectedImageSource;
            }
            backgroundImageSource = selectedBackgroundImageSource;
        }
        
        if(customTextViewStyle){
            textViewStyleList.push(customTextViewStyle)
        }
        if (additionalContainerStyle){
            containerStyleList.push(additionalContainerStyle)
        }
        if (additionalTextStyle){
            textViewStyleList.push(additionalTextStyle)
        }

        var buttonWidth = parameters.buttonWidth ? parameters.buttonWidth : rowButtonWidth;
        var buttonHeight = parameters.buttonHeight ? parameters.buttonHeight : rowButtonHeight;

        return (
            <TouchableOpacity style={containerStyleList} onPress={()=>{
                var newState = {};
                newState[groupName] = value
                this.setState(newState);
            }}>
                <View style={{width: buttonWidth, height: buttonHeight, alignItems:'center', justifyContent:'center' }}>
                    <Image style={{
                            position:'absolute', 
                            width: buttonWidth, height: buttonHeight
                        }}
                        resizeMode={'contain'}
                        source={backgroundImageSource}/>
                    {this.renderImage(imageSource)}
                    <Text style={textViewStyleList}>{label}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderImage(imageSource){
        if(imageSource){
            return (
                <Image 
                    source={imageSource} style={{height:20, width:20, marginRight:10, marginLeft:10}}
                    resizeMode={"contain"}
                />)
        }
        return <View/>
    }

    renderSectionTitle(title){
        return (
            <View style={{position:'absolute', left:0, right: 0, top:0, height:30, 
                        justifyContent:'center',
                        alignItems:'center'}}>
                <Text style={{backgroundColor:'white', paddingLeft:20, paddingRight:20, textAlign:'center',
                                color:'#cccccc'}}>
                    {title}
                </Text>
            </View>
        )
    }

    updateIndex (value) {
        this.setState({selectedAmount: value})
    }

    renderAmountButton(value){
        return this.renderButtonInGroup({
            value: value, 
            groupName: "Amount", 
            customTextViewStyle: styles.SelectedAmountButton,
            backgroundImageSource: require("../../images/stock_detail_action_unselected.png"),
            selectedBackgroundImageSource: require("../../images/stock_detail_action_selected_blue.png")
        });            
    }

    renderMultiplierButton(value){
        return this.renderButtonInGroup({
            value: value, 
            groupName: "Multiplier", 
            customTextViewStyle: styles.SelectedMultiplierButton,
            backgroundImageSource: require("../../images/stock_detail_action_unselected.png"),
            selectedBackgroundImageSource: require("../../images/stock_detail_action_selected_green.png")});            
    }

    renderOperationButton(label, value, imageSource, selectedImageSource){
        return this.renderButtonInGroup({
            value: value, 
            label: label,
            groupName: "Operation",
            imageSource: imageSource,
            selectedImageSource: selectedImageSource,
            customTextViewStyle: styles.SelectedAmountButton,
        });            
    }

    renderSubmitButton(){
        var source = null;
        if(this.state.Amount != undefined && this.state.Multiplier != undefined && this.state.Operation != undefined){
            source = require("../../images/stock_detail_button_enabled.png");
        }else{
            source = require("../../images/stock_detail_button_disabled.png")
        }
        return (
            <TouchableOpacity onPress={()=>this.onSubmitButtonPressed()}>
                <Image style={{flex:1}} source={source}
                    resizeMode={"contain"}
                />
            </TouchableOpacity>
        )
    }

    renderOrderFinishedModal(){
        return (
            <StockOrderInfoModal ref='orderFinishedModal'/>
        );
    }

    renderPriceChart(){
        return  (<View style={styles.chartContainer}>
            <PriceChartView style={{flex:1}}
                lineChartGradient={['#33c1fc', '#20b2f7']}
                xAxisPosition="BOTTOM"
                leftAxisEnabled={false}
                rightAxisEnabled={true}
                dataSetColor={"#b7e1f8"}
                textColor={"#7abff0"}
                drawBorders={false}
                borderColor={'transparent'}
                data={JSON.stringify(this.state.stockInfo)}
                paddingRightAxis={20}
                drawDataUnderYAxis={true}
                xAxisBackground={"#1394e6"}
                xAxisPaddingBottom={20}
                xAxisPaddingTop={20}
                /> 
        </View>
        )

        /* <View style={[styles.chartContainer, {backgroundColor: 'white'}]}>
        <PriceChartView style={{flex:1, height:300}}
            chartType={"userHomePage"}
            lineChartGradient={['#dbf1fd', '#feffff']}
            dataSetColor={"#0f98eb"}
            textColor={"#9e9e9e"}
            borderColor={'#666666'}
            xAxisPosition="BOTTOM"
            leftAxisEnabled={false}
            rightAxisEnabled={true}
            rightAxisDrawLabel={true}
            rightAxisLabelCount={5}
            chartPaddingLeft={24}
            chartPaddingTop={20}
            xAxisPaddingBottom={5}
            xAxisPaddingTop={20}
            paddingRightAxis={10}
            drawBorders={true}
            data={JSON.stringify(this.state.stockInfo)}
            drawDataUnderYAxis={true}
        
            />
    </View> */
    }

    render() {
       

        return (
            <View style={styles.container}>
                {this.renderPriceChart()}
                <View style={styles.actionsContainer}>                      
                    <View style={[styles.buttonsContainer, styles.buttonsRowContainer,]}>
                        <Image style={styles.buttonsRowContainerBackground}
                            resizeMode={"contain"}
                            source={require('../../images/stock_detail_multiple_container.png')}/>
                        {this.renderAmountButton(50)}
                        {this.renderAmountButton(100)}
                        {this.renderAmountButton(200)}
                        {this.renderAmountButton(400)}
                    </View>

                    <View style={[styles.buttonsContainer, styles.buttonsRowContainer]}>
                        <Image style={styles.buttonsRowContainerBackground}
                            resizeMode={"contain"}
                            source={require('../../images/stock_detail_multiple_container.png')}/>
                        {this.renderMultiplierButton(10)}
                        {this.renderMultiplierButton(30)}
                        {this.renderMultiplierButton(50)}
                        {this.renderMultiplierButton(100)}
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <View style={[styles.buttonsContainer, styles.buttonsSmallContainer, {flex:1}]}>
                            <Image style={styles.buttonsSmallContainerBackground}
                                resizeMode={"contain"}
                                source={require('../../images/stock_detail_trading_container.png')}/>
                            {this.renderOperationButton("上升", 1, require("../../images/stock_detail_direction_up_disabled.png"), require("../../images/stock_detail_direction_up_enabled.png"))}
                            {this.renderOperationButton("下降", 0, require("../../images/stock_detail_direction_down_disabled.png"), require("../../images/stock_detail_direction_down_enabled.png"))}
                        </View>
                        <View style={[styles.buttonsContainer, styles.buttonsSmallContainer, 
                            {flex:1, justifyContent:'center', alignItems:'center', padding:15}]}>
                            <Image style={styles.buttonsSmallContainerBackground}
                                resizeMode={"contain"}
                                source={require('../../images/stock_detail_trading_container.png')}/>
                            {this.renderSubmitButton()}                            
                        </View>
                    </View>
                </View>
                {this.renderOrderFinishedModal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'black', 
    },
    
    container: {
        flex: 1,
        alignSelf:'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white',
    },

    chartContainer:{
        flex:1, 
        alignSelf:'stretch', 
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE
    },

    actionsContainer:{       
        justifyContent:'flex-start', 
        alignSelf:'stretch'
    },

    buttonsContainer:{
        marginLeft:containerHorizontalPadding,
        marginRight:containerHorizontalPadding,
        justifyContent: 'space-between',
        alignSelf:'center',
        padding: 5,
    },

    buttonsRowContainer:{
        alignSelf:'stretch',       
        flexDirection: 'row',
        width: rowContainerWidth, 
        height:rowContainerHeight,
    },

    buttonsSmallContainer:{
        alignSelf:'stretch',
        flexDirection: 'column',
        width: smallContainerWidth, 
        height: smallContainerHeight,
    },

    buttonsRowContainerBackground:{
        position:'absolute',
        width: rowContainerWidth,
        height:rowContainerHeight
    },

    buttonsSmallContainerBackground:{
        position:'absolute',
        width: smallContainerWidth,
        height: smallContainerHeight,
    },

    numberButton:{
        flex:1,
        marginTop:4,
        alignSelf:'center',
        justifyContent:'center',
        flexDirection:'row',
    },

    numberButtonLabel:{
        textAlign: 'center',
        fontSize:20,
    },

    SelectedAmountButton:{
        color:'#0f96ea',
    },

    SelectedMultiplierButton:{
        color:'#2ab848',
    },
})


module.exports = StockDetailScreen;

