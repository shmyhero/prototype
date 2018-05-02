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
  ImageBackground,
  Dimensions,
} from 'react-native';

import PriceChartView from './component/PriceChartView';
import NavBar from './component/NavBar';
import {ViewKeys} from '../../AppNavigatorConfiguration';

import { StackNavigator, TabNavigator } from 'react-navigation';
import LogicData from "../LogicData";

var NetConstants = require("../NetConstants");
var NetworkModule = require("../module/NetworkModule");
var ColorConstants = require("../ColorConstants");
var WebSocketModule = require("../module/WebSocketModule");
var LS = require('../LS');

import { NavigationActions } from 'react-navigation';
import StockOrderInfoModal from "./StockOrderInfoModal";

var {height, width} = Dimensions.get('window')

var containerHorizontalPadding = 15;

var SMALL_BUTTON_ROW_CONTAINER_WIDTH = width - containerHorizontalPadding * 2;
var SMALL_BUTTON_ROW_CONTAINER_HEIGHT = SMALL_BUTTON_ROW_CONTAINER_WIDTH / 700 * 150;

var BIG_BUTTON_ROW_CONTAINER_WIDTH = (width - containerHorizontalPadding * 3)/2;
var BIG_BUTTON_ROW_CONTAINER_HEIGHT = BIG_BUTTON_ROW_CONTAINER_WIDTH / 350 * 330;

var DATA_STATUS_FAILED = 0;
var DATA_STATUS_LOADED = 1;
var DATA_STATUS_LOADING = 2;
var CHART_STATUS_FAILED = 0;
var CHART_STATUS_LOADED = 1;
var CHART_STATUS_LOADING = 2;

const DEFAULT_MULTIPLIER = 1;

class StockDetailScreen extends Component {
    constructor(props){
        super(props)

        var state = {
            chartType: "stockDetailPage",
            data: null,
            Multiplier: DEFAULT_MULTIPLIER,
            isLoading: true,
            dataStatus: DATA_STATUS_LOADING,
            chartStatus: CHART_STATUS_LOADING,
            stockInfo: {},
        }
        
        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
            state.stockCode = params.stockCode;
        }

        this.state = state;
    }

    componentDidMount(){
        this.loadStockInfo()
    }

    loadStockInfo() {
        loadStockInfoSuccess = false;
        
        this.setState({
			dataStatus : DATA_STATUS_LOADING
		}, ()=>{
            var url = NetConstants.CFD_API.GET_STOCK_DETAIL.replace("<stockID>", this.state.stockCode);
            NetworkModule.fetchTHUrl(
                url,
                {
                    method: 'GET',
                    showLoading: true,
                }, (responseJson) => {
                    loadStockInfoSuccess = true;

                    var stockInfo = responseJson;
                    url = NetConstants.CFD_API.CHART_1M.replace("<stockID>", this.state.stockCode);
                    NetworkModule.fetchTHUrl(
                        url,
                        {
                            method: 'GET',
                            showLoading: true,
                        }, (responseJson) => {
                            console.log("this.state.stockInfo", stockInfo)
                            //var priceData = [{"p":1.23527,"time":"2018-01-29T14:40:56.988Z"},{"p":1.23561,"time":"2018-01-29T14:41:56.858Z"},{"p":1.23566,"time":"2018-01-29T14:42:56.764Z"},{"p":1.23578,"time":"2018-01-29T14:43:56.824Z"},{"p":1.23574,"time":"2018-01-29T14:44:57.149Z"},{"p":1.23553,"time":"2018-01-29T14:45:56.961Z"},{"p":1.23495,"time":"2018-01-29T14:46:57.32Z"},{"p":1.23479,"time":"2018-01-29T14:47:57.177Z"},{"p":1.23507,"time":"2018-01-29T14:48:57.085Z"},{"p":1.2354,"time":"2018-01-29T14:49:57.676Z"},{"p":1.23559,"time":"2018-01-29T14:50:57.404Z"},{"p":1.23596,"time":"2018-01-29T14:51:57.32Z"},{"p":1.23598,"time":"2018-01-29T14:52:57.31Z"},{"p":1.23593,"time":"2018-01-29T14:53:57.875Z"},{"p":1.2358,"time":"2018-01-29T14:54:57.781Z"},{"p":1.23596,"time":"2018-01-29T14:55:57.752Z"},{"p":1.23625,"time":"2018-01-29T14:56:57.643Z"},{"p":1.23608,"time":"2018-01-29T14:57:57.599Z"},{"p":1.23586,"time":"2018-01-29T14:58:57.929Z"},{"p":1.23537,"time":"2018-01-29T14:59:57.878Z"},{"p":1.23554,"time":"2018-01-29T15:00:58.113Z"},{"p":1.23417,"time":"2018-01-29T16:19:53.072Z"},{"p":1.23457,"time":"2018-01-29T16:20:53.117Z"},{"p":1.23465,"time":"2018-01-29T16:21:52.983Z"},{"p":1.23474,"time":"2018-01-29T16:22:52.799Z"},{"p":1.23442,"time":"2018-01-29T16:23:53.157Z"},{"p":1.23431,"time":"2018-01-29T16:24:53.459Z"},{"p":1.23402,"time":"2018-01-29T16:25:53.316Z"},{"p":1.23429,"time":"2018-01-29T16:26:53.239Z"},{"p":1.23407,"time":"2018-01-29T16:27:53.782Z"},{"p":1.23444,"time":"2018-01-29T16:28:53.427Z"},{"p":1.23448,"time":"2018-01-29T16:29:53.352Z"},{"p":1.23475,"time":"2018-01-29T16:30:53.405Z"},{"p":1.23475,"time":"2018-01-29T16:31:53.464Z"},{"p":1.23521,"time":"2018-01-29T16:32:53.824Z"},{"p":1.2351,"time":"2018-01-29T16:33:53.517Z"},{"p":1.23491,"time":"2018-01-29T16:34:53.944Z"},{"p":1.23462,"time":"2018-01-29T16:35:53.381Z"},{"p":1.23496,"time":"2018-01-29T16:36:53.889Z"},{"p":1.23509,"time":"2018-01-29T16:37:54.317Z"},{"p":1.23453,"time":"2018-01-29T16:38:53.931Z"},{"p":1.23438,"time":"2018-01-29T16:39:54.37Z"},{"p":1.23457,"time":"2018-01-29T16:40:54.016Z"},{"p":1.23465,"time":"2018-01-29T16:41:54.481Z"},{"p":1.2346,"time":"2018-01-29T16:42:54.472Z"},{"p":1.23864,"time":"2018-01-29T20:19:58.035Z"},{"p":1.23867,"time":"2018-01-29T20:20:57.904Z"},{"p":1.23864,"time":"2018-01-29T20:21:58.414Z"},{"p":1.23866,"time":"2018-01-29T20:22:57.918Z"},{"p":1.23864,"time":"2018-01-29T20:23:57.862Z"},{"p":1.23862,"time":"2018-01-29T20:24:58.135Z"},{"p":1.23867,"time":"2018-01-29T20:25:58.222Z"},{"p":1.23861,"time":"2018-01-29T20:26:58.546Z"},{"p":1.23864,"time":"2018-01-29T20:27:58.397Z"},{"p":1.23868,"time":"2018-01-29T20:28:58.219Z"},{"p":1.23864,"time":"2018-01-29T20:29:58.762Z"},{"p":1.23852,"time":"2018-01-29T20:30:58.192Z"},{"p":1.23846,"time":"2018-01-29T20:31:58.508Z"},{"p":1.23851,"time":"2018-01-29T20:32:58.628Z"},{"p":1.23852,"time":"2018-01-29T20:33:58.617Z"},{"p":1.23853,"time":"2018-01-29T20:34:59.071Z"},{"p":1.23843,"time":"2018-01-29T20:35:58.769Z"},{"p":1.23862,"time":"2018-01-29T20:36:58.644Z"},{"p":1.23878,"time":"2018-01-29T20:37:59.15Z"},{"p":1.23885,"time":"2018-01-29T20:38:58.922Z"},{"p":1.23876,"time":"2018-01-29T20:39:59.182Z"},{"p":1.23877,"time":"2018-01-29T20:40:59.104Z"},{"p":1.23883,"time":"2018-01-29T20:41:59.038Z"},{"p":1.23877,"time":"2018-01-29T20:42:59.611Z"},{"p":1.23814,"time":"2018-01-29T21:57:53.816Z"},{"p":1.2382,"time":"2018-01-29T21:58:54.103Z"},{"p":1.23826,"time":"2018-01-29T21:59:53.739Z"},{"p":1.23818,"time":"2018-01-29T22:05:54.336Z"},{"p":1.23819,"time":"2018-01-29T22:06:54.258Z"},{"p":1.23830,"time":"2018-01-29T22:07:54.488Z"},{"p":1.23826,"time":"2018-01-29T22:08:54.505Z"},{"p":1.23822,"time":"2018-01-29T22:09:54.119Z"},{"p":1.23824,"time":"2018-01-29T22:10:54.338Z"},{"p":1.23833,"time":"2018-01-29T22:11:54.568Z"},{"p":1.23836,"time":"2018-01-29T22:12:54.952Z"},{"p":1.23830,"time":"2018-01-29T22:13:54.306Z"},{"p":1.23833,"time":"2018-01-29T22:14:54.659Z"},{"p":1.23842,"time":"2018-01-29T22:15:55.114Z"},{"p":1.23837,"time":"2018-01-29T22:16:55.105Z"},{"p":1.23838,"time":"2018-01-29T22:17:54.878Z"},{"p":1.2384,"time":"2018-01-29T22:18:55.226Z"},{"p":1.23842,"time":"2018-01-29T22:19:55.173Z"},{"p":1.23839,"time":"2018-01-29T22:20:55.418Z"},{"p":1.23839,"time":"2018-01-29T22:21:54.896Z"},{"p":1.23841,"time":"2018-01-29T22:22:55.223Z"},{"p":1.23842,"time":"2018-01-29T22:23:55.667Z"},{"p":1.2384,"time":"2018-01-29T22:24:55.5Z"},{"p":1.23839,"time":"2018-01-29T22:25:55.313Z"},{"p":1.23822,"time":"2018-01-29T22:26:55.411Z"},{"p":1.23813,"time":"2018-01-29T22:27:55.506Z"},{"p":1.23808,"time":"2018-01-29T22:28:55.341Z"},{"p":1.23822,"time":"2018-01-29T22:29:55.686Z"},{"p":1.23809,"time":"2018-01-29T22:30:55.847Z"},{"p":1.23817,"time":"2018-01-29T22:31:55.664Z"},{"p":1.23812,"time":"2018-01-29T22:32:55.795Z"},{"p":1.23814,"time":"2018-01-29T22:33:56.229Z"},{"p":1.23805,"time":"2018-01-29T22:34:56.049Z"},{"p":1.23815,"time":"2018-01-29T22:35:55.673Z"},{"p":1.23814,"time":"2018-01-29T22:36:56.283Z"},{"p":1.23812,"time":"2018-01-29T22:37:56.508Z"},{"p":1.23813,"time":"2018-01-29T22:38:55.884Z"},{"p":1.23808,"time":"2018-01-29T22:39:56.367Z"},{"p":1.23809,"time":"2018-01-29T22:40:56.03Z"},{"p":1.23813,"time":"2018-01-29T22:41:56.668Z"},{"p":1.23811,"time":"2018-01-29T22:42:56.589Z"},{"p":1.23814,"time":"2018-01-29T22:43:55.02Z"},{"p":1.23812,"time":"2018-01-29T22:44:56.55Z"},{"p":1.2381,"time":"2018-01-29T22:45:57.013Z"},{"p":1.23807,"time":"2018-01-29T22:46:56.352Z"},{"p":1.23802,"time":"2018-01-29T22:47:56.794Z"},{"p":1.23797,"time":"2018-01-29T22:48:56.626Z"},{"p":1.23803,"time":"2018-01-29T22:49:56.515Z"},{"p":1.23803,"time":"2018-01-29T22:50:56.87Z"},{"p":1.23797,"time":"2018-01-29T22:51:56.821Z"},{"p":1.23785,"time":"2018-01-29T22:52:57.145Z"},{"p":1.23807,"time":"2018-01-29T22:53:56.834Z"},{"p":1.23814,"time":"2018-01-29T22:54:57.028Z"},{"p":1.23816,"time":"2018-01-29T22:55:57.47Z"},{"p":1.23814,"time":"2018-01-29T22:56:57.335Z"},{"p":1.23819,"time":"2018-01-29T22:57:57.257Z"},{"p":1.23806,"time":"2018-01-29T22:58:57.591Z"},{"p":1.23826,"time":"2018-01-29T22:59:57.5Z"},{"p":1.23833,"time":"2018-01-29T23:00:57.4Z"},{"p":1.23835,"time":"2018-01-29T23:01:57.254Z"},{"p":1.23832,"time":"2018-01-29T23:02:57.419Z"},{"p":1.23834,"time":"2018-01-29T23:03:57.875Z"},{"p":1.23838,"time":"2018-01-29T23:04:57.797Z"},{"p":1.23851,"time":"2018-01-29T23:05:57.68Z"},{"p":1.23648,"time":"2018-01-30T02:40:35.942Z"}];
                            stockInfo.priceData = responseJson;
                            this.setState({
                                dataStatus: DATA_STATUS_LOADED,
                                chartStatus: CHART_STATUS_LOADED,
                                stockInfo: stockInfo,
                            });
                        },
                        ()=>{
                            this.setState({
                                dataStatus: DATA_STATUS_LOADED,
                                chartStatus: CHART_STATUS_FAILED,
                            })
                        });
                },
                ()=>{
                    this.setState({
                        dataStatus: DATA_STATUS_FAILED,
                    })
                }
            )
        })
    }

    loadStockPriceToday(showLoading, chartType, stockInfo) {  
        
        //TODO: Replace with real url
        var CFD_API_SERVER = 'https://api.typhoontechnology.hk';
		var url = CFD_API_SERVER + '/api/quote/<stockCode>/tick/<chartType>',		

		url = url.replace(/<chartType>/, chartType)
		url = url.replace(/<stockCode>/, this.state.stockCode)


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
                    dataStatus : DATA_STATUS_LOADED,
				})

				var previousInterestedStocks = WebSocketModule.getPreviousInterestedStocks()
				var lastInterestedStocks = previousInterestedStocks;
				if(previousInterestedStocks
					&& previousInterestedStocks.includes //The method may be empty???
					&&tempStockInfo.id){
					if(!previousInterestedStocks.includes(tempStockInfo.id)){
						previousInterestedStocks += ',' + tempStockInfo.id;
					}
				}else{
					previousInterestedStocks = '' + tempStockInfo.id;
				}

				if(previousInterestedStocks != lastInterestedStocks){
					WebSocketModule.registerInterestedStocks(previousInterestedStocks)
				}
				this.connectWebSocket();
			},
			(result) => {
				this.setState({
					dataStatus: DATA_STATUS_FAILED,
				})
			},
			true
		)
    }
    
    connectWebSocket() {
		WebSocketModule.registerInterestedStocksCallbacks(
			(realtimeStockInfo) => {
				for (var i = 0; i < realtimeStockInfo.length; i++) {
					if (this.props.stockCode == realtimeStockInfo[i].id ) {
						if(this.state.stockPrice !== realtimeStockInfo[i].last) {
							this.setState({
								stockPrice: realtimeStockInfo[i].last,
								stockLastPrice:realtimeStockInfo[i].last,
							})
						}
						break;
					}
				};
			})
    }
    
    goToPositionPage(){
        this.refs["orderFinishedModal"].hide();
        //this.props.navigation.navigate(ViewKeys.TAB_POSITION);
        //this.props.navigation.goBack(ViewKeys.TAB_POSITION);
    
        const action = NavigationActions.navigate({ routeName: ViewKeys.TAB_POSITION});

        // const action = NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: ViewKeys.SCREEN_HOME })],
        // });
        this.props.navigation.dispatch(action);
    }

    isSubmitButtonEnabled(){
        return this.state.stockInfo.isOpen && this.state.Amount != undefined && this.state.Multiplier != undefined && this.state.Operation != undefined;
    }

    onSubmitButtonPressed(){
        //TODO: Submit data
        //alert("下单啦 " + this.state.Amount + " x " + this.state.Multiplier + ", " + this.state.Operation)        

        if(this.isSubmitButtonEnabled()){
            var body = {
                "securityId": this.state.stockCode,
                "isLong" : this.state.Operation == 1,
                "invest": this.state.Amount,
                "leverage": this.state.Multiplier
            };

            if(LogicData.isLoggedIn()){
                var userData = LogicData.getUserData();  
               
                NetworkModule.fetchTHUrl(
                    NetConstants.CFD_API.OPEN_POSITION,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                            'Content-Type': 'application/json; charset=utf-8',
                        },
                        showLoading: true,
                        body: JSON.stringify(body),
                    }, (responseJson) => {
                        var showData = responseJson;
                        const { params } = this.props.navigation.state;
                        showData.stockName = params.stockName;
                        showData.isCreate = true;
                        showData.time = new Date(responseJson.createAt);
                        this.refs["orderFinishedModal"].show(showData);
                    },
                    (exception) => {
                        alert(exception.errorMessage)
                    }
                );
            }else{
                this.props.navigation.navigate(ViewKeys.SCREEN_LOGIN, {
                    onLoginFinished: ()=>{
                        this.props.navigation.goBack(null);
                    }
                })
            }
        
        }
    }

    onOptionSelected(groupName, value){
        var newState = {};

        if(groupName == "Multiplier" && value == this.state[groupName]){
            newState[groupName] = DEFAULT_MULTIPLIER
        }else{
            newState[groupName] = value
        }

        this.setState(newState);
    }

    renderButtonInGroup(parameters){
        var value = parameters.value;
        var label = parameters.label;       
        var groupName = parameters.groupName;
        var additionalTextStyle = parameters.additionalTextStyle;
        var additionalContainerStyle = parameters.additionalContainerStyle;
        var customTextViewStyle = parameters.customTextViewStyle;
        var imageSource = parameters.imageSource;
        var selectedImageSource = parameters.selectedImageSource;
        var selected = this.state[groupName] == value;
        var containerStyleList = [styles.numberButton];
        var textViewStyleList = [styles.numberButtonLabel];
        var backgroundImageSource = parameters.backgroundImageSource ? parameters.backgroundImageSource : require("../../images/stock_detail_action_unselected.png");
        var selectedBackgroundImageSource = parameters.selectedBackgroundImageSource ? parameters.selectedBackgroundImageSource : require("../../images/stock_detail_action_selected_blue.png");
       
        if(selected){
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

        return (
            <TouchableOpacity style={containerStyleList}
                onPress={()=>this.onOptionSelected(groupName, value)}>
                <ImageBackground source={backgroundImageSource}
                    resizeMode={'contain'}
                    style={{
                        width: '100%',
                        height: '100%',
                        alignItems:'center',
                        justifyContent:'center',
                        flexDirection:'column',
                    }}>
                    <View style={{
                        flex:1,
                        alignItems:'center',
                        flexDirection:'row',
                        }}>
                        <Text style={textViewStyleList}>{label}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
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

    renderAmountButton(value){
        return this.renderButtonInGroup({
            value: value,
            label: value,
            groupName: "Amount", 
            customTextViewStyle: styles.SelectedAmountButton,
            backgroundImageSource: require("../../images/stock_detail_action_unselected.png"),
            selectedBackgroundImageSource: require("../../images/stock_detail_action_selected_blue.png")
        });            
    }

    renderMultiplierButton(value){
        return this.renderButtonInGroup({
            value: value, 
            label: value,
            groupName: "Multiplier", 
            customTextViewStyle: styles.SelectedMultiplierButton,
            backgroundImageSource: require("../../images/stock_detail_action_unselected.png"),
            selectedBackgroundImageSource: require("../../images/stock_detail_action_selected_green.png")});            
    }

    renderOperationButton(value){
        var imageSource = LS.loadImage("stock_detail_option_up_unselected")
        var selectedImageSource = LS.loadImage("stock_detail_option_up_selected")
        if (value == 0){
            //Down
            imageSource = LS.loadImage("stock_detail_option_down_unselected")
            selectedImageSource = LS.loadImage("stock_detail_option_down_selected")
        }else{
            //Up
            imageSource = LS.loadImage("stock_detail_option_up_unselected")
            selectedImageSource = LS.loadImage("stock_detail_option_up_selected")
        }

        return this.renderButtonInGroup({
            value: value,
            groupName: "Operation",
            backgroundImageSource:imageSource,
            selectedBackgroundImageSource:selectedImageSource,
        });            
    }

    renderSubmitButton(){
        var source = null;
        var buttonLabel;
        if(this.state.stockInfo.isOpen == true || this.state.stockInfo.isOpen == undefined){
            buttonLabel = LS.str("BUY")
        }else{
            buttonLabel = this.state.stockInfo.status == 2 ? LS.str("STOCK_MARKET_STOP") : LS.str("STOCK_MARKET_CLOSED");
        }

        if(this.isSubmitButtonEnabled()){
            source = require("../../images/stock_detail_button_enabled.png");
        }else{
            source = require("../../images/stock_detail_button_disabled.png");
        }
        return (
            <TouchableOpacity onPress={()=>this.onSubmitButtonPressed()}>
                <ImageBackground style={{width:120,height:120, alignItems:'center', justifyContent:'center'}} source={source}
                    resizeMode={"contain"}>
                    <Text style={{color:'white'}}>{buttonLabel}</Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    renderOrderFinishedModal(){
        return (
            <StockOrderInfoModal ref='orderFinishedModal'
                onContainerPress={()=>this.goToPositionPage()}/>
        );
    }

    renderPriceChart(){
        if (this.state.dataStatus == DATA_STATUS_FAILED){
            return (
                <View style={styles.centerTextContainer}>
                    <Text style={styles.chartStatusText}>数据读取失败...</Text>
                </View>
            );
        }
        else if (this.state.dataStatus == DATA_STATUS_LOADING){
            return (
                <View style={styles.centerTextContainer}>
                    <Text style={styles.chartStatusText}>数据读取中...</Text>
                </View>
            );
        }
        return  (
            <PriceChartView style={{flex:1}}
                lineChartGradient={['#32c0fb', '#1b9beb']}
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
        )
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavBar title={params ? params.stockName : '详情'}
                    navigation={this.props.navigation}/>
                <View style={styles.chartContainer}>
                    {this.renderPriceChart()}
                </View>
                <View style={styles.actionsContainer}>
                    <ImageBackground style={[styles.buttonsContainer, styles.buttonsRowWrapper]}
                        source={require("../../images/en-us/stock_detail_amount_container.png")}>
                        <View style={[styles.buttonsRowContainer]}>                               
                            {this.renderAmountButton(50)}
                            {this.renderAmountButton(100)}
                            {this.renderAmountButton(200)}
                            {this.renderAmountButton(400)}
                        </View>
                    </ImageBackground>
                    <ImageBackground style={[styles.buttonsContainer, styles.buttonsRowWrapper]}
                        source={LS.loadImage('stock_detail_multiple_container')}>
                        <View style={[styles.buttonsRowContainer]}>
                            {this.renderMultiplierButton(10)}
                            {this.renderMultiplierButton(30)}
                            {this.renderMultiplierButton(50)}
                            {this.renderMultiplierButton(100)}
                        </View>
                    </ImageBackground>

                    <View style={[styles.buttonsContainer, styles.bigButtonsRowWrapper]}>
                        <ImageBackground style={{flex:1, marginRight: containerHorizontalPadding/2}}
                            source={LS.loadImage('stock_detail_direction_container')}>
                            <View style={[styles.buttonsContainer, styles.bigButtonsContainer,
                                {justifyContent:'center', alignItems:'center'}]}>
                                {this.renderOperationButton(1)}
                                {this.renderOperationButton(0)}
                            </View>
                        </ImageBackground>
                        <ImageBackground style={{flex:1, marginLeft: containerHorizontalPadding/2}}
                            source={LS.loadImage("stock_detail_trading_container")}>
                            <View style={[styles.buttonsContainer, styles.bigButtonsContainer, 
                                {justifyContent:'center', alignItems:'center'}]}>                               
                                {this.renderSubmitButton()}                            
                            </View>
                        </ImageBackground>
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
        alignSelf:'stretch',
        marginTop:10,
    },

    buttonsContainer:{
        justifyContent: 'space-between',
        alignSelf:'center', 
        marginLeft:containerHorizontalPadding,
        marginRight:containerHorizontalPadding,
    },

    bigButtonsRowWrapper:{
        marginTop: 5,
        marginBottom:5,
        flexDirection:'row',
        width:SMALL_BUTTON_ROW_CONTAINER_WIDTH,
        height:BIG_BUTTON_ROW_CONTAINER_HEIGHT,
    },

    buttonsRowWrapper:{
        paddingTop: 5,      
        width:SMALL_BUTTON_ROW_CONTAINER_WIDTH,
        height:SMALL_BUTTON_ROW_CONTAINER_HEIGHT,
    },

    buttonsRowContainer:{
        alignSelf:'stretch',
        alignItems:'stretch',
        flexDirection: 'row',
        flex:1,
        paddingTop:5,
        paddingBottom:2,
        paddingLeft:10,
        paddingRight:10,
    },

    bigButtonsContainer:{
        alignSelf:'stretch',
        flexDirection: 'column',
        flex:1,
        paddingTop:10,
        paddingBottom:15,
    },

    numberButton:{
        flex:1,
        alignSelf:'center',
        alignItems:'stretch',
        justifyContent:'center',
        flexDirection:'row',
        paddingBottom:3,
    },

    numberButtonLabel:{
        textAlign: 'center',
        fontSize:20,
        flex:1,
    },

    SelectedAmountButton:{
        color:'#0f96ea',
    },

    SelectedMultiplierButton:{
        color:'#2ab848',
    },

    centerTextContainer: {
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row', 
        flex:1,
    },

    chartStatusText:{
        textAlign:'center',
        color:'#b7e1f8',
    },
})

export default StockDetailScreen;

