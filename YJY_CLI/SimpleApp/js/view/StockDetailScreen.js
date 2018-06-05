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
import deepCopyUtil from '../utils/deepCopyUtil';

var {EventCenter, EventConst} = require('../EventCenter');
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
                            
                            stockInfo.priceData = responseJson;
                            this.setState({
                                dataStatus: DATA_STATUS_LOADED,
                                chartStatus: CHART_STATUS_LOADED,
                                stockInfo: stockInfo,
                            });

                            
                            WebSocketModule.registerInterestedStocks(""+this.state.stockCode)
                            
                            this.connectWebSocket();
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

                console.log("previousInterestedStocks", previousInterestedStocks)
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
					if (this.state.stockCode == realtimeStockInfo[i].id ) {
						if(this.state.stockInfo.last !== realtimeStockInfo[i].last) {
                            var stockInfo = deepCopyUtil(this.state.stockInfo);
                            stockInfo.last = realtimeStockInfo[i].last;
                            //'2018-05-11T05:22:01.051Z'
                            var lastPriceData = stockInfo.priceData[stockInfo.priceData.length-1];
                            var lastDate = new Date(lastPriceData.t);
                            var currentDate = new Date(realtimeStockInfo[i].time);
                            console.log("lastPriceData.t", lastPriceData.t);
                            console.log("realtimeStockInfo[i].time", realtimeStockInfo[i].time);
                            var newPriceData = { p: stockInfo.last, t: realtimeStockInfo[i].time};                            
                            if(lastDate.getFullYear() == currentDate.getFullYear()
                                && lastDate.getMonth() == currentDate.getMonth()
                                && lastDate.getDate() == currentDate.getDate()
                                && lastDate.getHours() == currentDate.getHours()
                                && lastDate.getMinutes() == currentDate.getMinutes()
                            ){                               
                                console.log("remove last");
                                stockInfo.priceData.splice(stockInfo.priceData.length-1, 1);
                                console.log("stockInfo.priceData last", stockInfo.priceData[stockInfo.priceData.length-1])
                            }else{
                                console.log("remove head");
                                stockInfo.priceData.splice(0, 1);
                            }
                            
                            stockInfo.priceData.push(newPriceData);
							this.setState({
                                stockInfo: stockInfo
							});
						}
						break;
					}
				};
			})
    }
    
    goToPositionPage(){
        this.refs["orderFinishedModal"].hide();
        
        //!!!!!!!!!!!!!!!!
        //BackKey should be the key of the view which is the second one in the view stack, since the 
        //key should be the key to goBack FROM.
        //!!!!!!!!!!!!!!!!
        var backKey = this.props.navigation.state.params.backFrom
        if(!backKey){
            backKey = this.props.navigation.state.key;
        }

        this.props.navigation.goBack(backKey);       
        const action2 = NavigationActions.navigate({ routeName: ViewKeys.TAB_POSITION});
        this.props.navigation.dispatch(action2);
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
                        this.refs["orderFinishedModal"].show(showData, ()=>{
                            this.setState({
                                Amount: undefined,
                                Multiplier: DEFAULT_MULTIPLIER,
                                Operation: undefined,
                            })
                        });
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
        var selectedTextColor = ""
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
                        {imageSource? <Image style={{marginLeft:20, height: 22, width: 22}} source={imageSource}/> : null}
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
        var imageSource;//LS.loadImage("stock_detail_option_up_unselected")
        var selectedImageSource;// = LS.loadImage("stock_detail_option_up_selected")
        if (value == 0){
            //Down
            label = LS.str("SHORT_OPERATION")
            imageSource = require('../../images/stock_detail_direction_down_enabled.png');
            selectedImageSource = require('../../images/stock_detail_direction_down_selected.png');
        }else{
            //Up
            label = LS.str("LONG_OPERATION")
            imageSource = require('../../images/stock_detail_direction_up_enabled.png');
            selectedImageSource = require('../../images/stock_detail_direction_up_selected.png');
        }
        backgroundImageSource = require('../../images/stock_detail_option_unselected.png');
        selectedBackgroundImageSource = require('../../images/stock_detail_option_selected.png');

        return this.renderButtonInGroup({
            value: value,
            label: label,
            groupName: "Operation",
            imageSource: imageSource,
            customTextViewStyle: styles.SelectedOperationButton,
            selectedImageSource: selectedImageSource,
            backgroundImageSource:backgroundImageSource,
            selectedBackgroundImageSource:selectedBackgroundImageSource,
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


        var buttonTextStyle = {color:'white', fontSize:22}
        if(this.isSubmitButtonEnabled()){
            source = require("../../images/stock_detail_button_enabled.png");
            buttonTextStyle.color = "#917202"
        }else{
            source = require("../../images/stock_detail_button_disabled.png");
        }
        return (
            <TouchableOpacity onPress={()=>this.onSubmitButtonPressed()}>
                <ImageBackground style={{width:120,height:120, alignItems:'center', justifyContent:'center'}} source={source}
                    resizeMode={"contain"}>
                    <Text style={buttonTextStyle}>{buttonLabel}</Text>
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
                    <Text style={styles.chartStatusText}>{LS.str("DATA_LOAD_FAILED")}</Text>
                </View>
            );
        }
        else if (this.state.dataStatus == DATA_STATUS_LOADING){
            return (
                <View style={styles.centerTextContainer}>
                    <Text style={styles.chartStatusText}>{LS.str("DATA_LOADING")}</Text>
                </View>
            );
        }
        return  (
            <PriceChartView style={{flex:1}}
                lineChartGradient={['#346aa2', '#1f4a77']}
                xAxisBackground={"#1c4570"}
                dataSetColor={"#577fa2"}
                textColor={"#62a5e0"}
                xAxisPosition="BOTTOM"
                leftAxisEnabled={false}
                rightAxisEnabled={true}
                drawBorders={false}
                borderColor={'transparent'}
                data={JSON.stringify(this.state.stockInfo)}
                paddingRightAxis={20}
                rightAxisDrawLabel={false}
                drawDataUnderYAxis={true}
                xAxisPaddingBottom={20}
                xAxisPaddingTop={20}
                lineWidth={6}
                />
        )
    }

    renderDetailRow(){
        console.log("this.state.stockInfo", this.state.stockInfo)
        var text = "--"
        if(this.state.stockInfo && this.state.stockInfo.last != undefined && this.state.stockInfo.open != undefined){
            var percent = (((this.state.stockInfo.last - this.state.stockInfo.open) / this.state.stockInfo.open * 100)).toFixed(2);
            if(percent > 0) percent = "+" + percent
            percent = percent + "%";   
            var text = "" + this.state.stockInfo.last + " " + percent;
        }

        //this.state.data + " " + this.props.currentPrice
        return (
            <View style={styles.detailTextRow}>
                <Text style={styles.detailText}>{text}</Text>
            </View>
        )
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.container}>
                <NavBar title={params ? params.stockName : LS.str("STOCK_DETAIL")}
                    navigation={this.props.navigation}/>
                {this.renderDetailRow()}
                <View style={styles.chartContainer}>
                    {this.renderPriceChart()}
                    {/* <Image style={{position:'absolute', bottom:0, right:0}} source={require('../../images/dot.gif')}/> */}
                </View>
                <View style={styles.actionsContainer}>
                    <ImageBackground style={[styles.buttonsContainer, styles.buttonsRowWrapper]}
                        source={require("../../images/stock_detail_amount_container.png")}>
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
    container: {
        flex: 1,
        alignSelf:'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailTextRow:{
        flexDirection: 'row',
    },
    detailText:{
        fontSize:10,
        color:ColorConstants.NAVBAR_TEXT_COLOR,
    },
    chartContainer:{
        flex:1, 
        alignSelf:'stretch', 
    },
    actionsContainer:{       
        justifyContent:'flex-start', 
        alignSelf:'stretch',
        paddingTop:10,
        backgroundColor:'white',
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
        color:'#1f4a77',
    },

    SelectedMultiplierButton:{
        color:'#2ab848',
    },

    SelectedOperationButton:{
        color:'#1f4a77',
        fontSize:18,
        textAlign:'center',
        marginRight:10
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

