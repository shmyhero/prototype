import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  CheckBox,
  ImageBackground,
  Dimensions,
  ScrollView
} from 'react-native';

import CustomStyleText from './component/CustomStyleText';
import PriceChartView from './component/PriceChartView';
import NavBar from './component/NavBar';
import ViewKeys from '../ViewKeys';
import LogicData from "../LogicData";
import deepCopyUtil from '../utils/deepCopyUtil';
import { fetchBalanceData } from '../redux/actions'
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import StockOrderInfoModal from "./StockOrderInfoModal";


var NetConstants = require("../NetConstants");
var NetworkModule = require("../module/NetworkModule");
var ColorConstants = require("../ColorConstants");
var WebSocketModule = require("../module/WebSocketModule");
var LS = require('../LS'); 
var {height, width} = Dimensions.get('window')

var containerHorizontalPadding = 15;

var BORDER_WIDTH = 2;
var SMALL_BUTTON_ROW_CONTAINER_WIDTH = width - containerHorizontalPadding * 2;
var SMALL_BUTTON_ROW_SCROLLER_WIDTH = SMALL_BUTTON_ROW_CONTAINER_WIDTH - BORDER_WIDTH * 2;
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
            amountValueList: [50, 100, 200, 400, 700, 1000],
            leverageValueList: [10, 30, 50, 100, 150, 200],
        }
        
        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
            state.stockCode = params.stockCode;
        }

        this.state = state;
    }

    componentDidMount(){
        this.loadStockInfo()
        this.refresh()
    }

    refresh(){
        this.props.fetchBalanceData();
        if(this.props.balanceTypeSettings){
            this.updateAmountValueList(this.props.balanceType, this.props.balanceTypeSettings)
        }
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
                            if(stockInfo && stockInfo.priceData){
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
                        showData.showCoin = true
                        this.refs["orderFinishedModal"].show(showData, ()=>{
                            this.setState({
                                Amount: undefined,
                                Multiplier: DEFAULT_MULTIPLIER,
                                Operation: undefined,
                            })
                            this.refresh();
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
                        this.refresh();
                    }
                })
            }
        
        }
    }

    onOptionSelected(groupName, value, enable){
        if(enable){
            var newState = {};

            if(groupName == "Multiplier" && value == this.state[groupName]){
                newState[groupName] = DEFAULT_MULTIPLIER
            }else{
                newState[groupName] = value
            }
    
            this.setState(newState);
        }       
    }

    componentWillReceiveProps(newProps){
        if(newProps.balance < this.state.Amount){
            this.setState({
                Amount: undefined,
            })
        }
        
        if(newProps.balanceType != this.props.balanceType){
            this.updateAmountValueList(newProps.balanceType, this.props.balanceTypeSettings)
        }
    }

    updateAmountValueList(balanceType, balanceTypeSettings){
        if(balanceTypeSettings && balanceTypeSettings[balanceType]){
            this.setState({
                Amount: undefined,
                amountValueList: balanceTypeSettings[balanceType]
            })
        }
    }

    renderButtonInGroup(parameters){
        var value = parameters.value;
        var index = parameters.index ? parameters.index : parameters.value;
        var label = parameters.label;   
        var enable = parameters.enable == undefined ? true : parameters.enable;
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
        if (!enable){
            textViewStyleList.push({color:'#cccccc'});
        }

        return (
            <TouchableOpacity style={containerStyleList}
                key={index}
                onPress={()=>this.onOptionSelected(groupName, value, enable)}>
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
                        {imageSource? <Image style={{marginLeft:15, height: 22, width: 22}} source={imageSource}/> : null}
                        <CustomStyleText style={textViewStyleList}>{label}</CustomStyleText>                        
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
                <CustomStyleText style={{backgroundColor:'white', paddingLeft:20, paddingRight:20, textAlign:'center',
                                color:'#cccccc'}}>
                    {title}
                </CustomStyleText>
            </View>
        )
    }

    renderAmountButton(value, index, isLogin){
        return this.renderButtonInGroup({
            index: index,
            value: value,
            label: value,
            enable: !isLogin || value <= this.props.balance,
            groupName: "Amount", 
            additionalContainerStyle: styles.smallNumberButton,
            customTextViewStyle: styles.SelectedAmountButton,            
            backgroundImageSource: require("../../images/stock_detail_action_unselected.png"),
            selectedBackgroundImageSource: require("../../images/stock_detail_action_selected_blue.png")
        });
    }

    renderMultiplierButton(value, index){
        return this.renderButtonInGroup({
            index: index,
            value: value, 
            label: value,
            groupName: "Multiplier", 
            additionalContainerStyle: styles.smallNumberButton,
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
            containerStyleList: {flex:1},
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
                    <CustomStyleText style={buttonTextStyle}>{buttonLabel}</CustomStyleText>
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
                    <CustomStyleText style={styles.chartStatusText}>{LS.str("DATA_LOAD_FAILED")}</CustomStyleText>
                </View>
            );
        }
        else if (this.state.dataStatus == DATA_STATUS_LOADING){
            return (
                <View style={styles.centerTextContainer}>
                    <CustomStyleText style={styles.chartStatusText}>{LS.str("DATA_LOADING")}</CustomStyleText>
                </View>
            );
        }
        return  (
            <PriceChartView style={{flex:1}}
                lineChartGradient={['#346aa2', '#1f4a77']}
                xAxisBackground={"#1c4570"}
                dataSetColor={"#577fa2"}
                textColor={"#6c86a0"}
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

        return (
            <View style={styles.detailTextRow}>
                <CustomStyleText style={styles.detailText}>{text}</CustomStyleText>
            </View>
        )
    }

    render() {
        const { params } = this.props.navigation.state;

        var userData = LogicData.getUserData();
        var isUserLogin = Object.keys(userData).length !== 0
                
        console.log("render")
        var amountViews = this.state.amountValueList.map((value, index, array)=>{
            return this.renderAmountButton(value, index, isUserLogin);
        })

        var leverageViews = this.state.leverageValueList.map((value, index, array)=>{
            return this.renderMultiplierButton(value, index);
        })

        return (
            <View style={styles.container}>                
                <NavBar title={params ? params.stockName : LS.str("STOCK_DETAIL")}
                    navigation={this.props.navigation}/>
                <View style={{backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE, 
                    alignSelf:'stretch',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1}}>
                    {this.renderDetailRow()}
                    <View style={styles.chartContainer}>
                        {this.renderPriceChart()}
                        {/* <Image style={{position:'absolute', bottom:0, right:0}} source={require('../../images/dot.gif')}/> */}
                    </View>
                </View>
                <View style={styles.actionsContainer}>
                    <ImageBackground style={[styles.buttonsContainer, styles.buttonsRowWrapper]}
                        source={require("../../images/stock_detail_amount_container.png")}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            contentContainerStyle={styles.buttonsRowContainer}
                            style={styles.buttonsScroller}>                            
                            {amountViews}
                        </ScrollView>
                        <CustomStyleText style={{position:'absolute', top:0, left:0, right:0,
                            textAlign:'center', color:'#cccccc'}}>{LS.getBalanceTypeDisplayText()}</CustomStyleText>
                    </ImageBackground>
                    <ImageBackground style={[styles.buttonsContainer, styles.buttonsRowWrapper, {marginTop:10}]}
                        source={require("../../images/stock_detail_amount_container.png")}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            contentContainerStyle={styles.buttonsRowContainer}
                            style={styles.buttonsScroller}>    
                            {leverageViews}
                        </ScrollView>
                        <CustomStyleText style={{position:'absolute', top:0, left:0, right:0,
                            textAlign:'center', color:'#cccccc'}}>{LS.str('ORDER_MULTIPLE')}</CustomStyleText>
                    </ImageBackground>

                    <View style={[styles.buttonsContainer, styles.bigButtonsRowWrapper]}>
                        <ImageBackground style={{flex:1, marginRight: containerHorizontalPadding/2}}
                            source={require("../../images/stock_detail_trading_container.png")}>
                            <View style={[styles.buttonsContainer, styles.bigButtonsContainer,
                                {justifyContent:'center', alignItems:'center'}]}>
                                {this.renderOperationButton(1)}
                                {this.renderOperationButton(0)}
                            </View>
                            <CustomStyleText style={{position:'absolute', bottom:2, left:0, right:0,
                                textAlign:'center', color:'#cccccc'}}>{LS.str('ORDER_TYPE')}</CustomStyleText>
                        </ImageBackground>
                        <ImageBackground style={{flex:1, marginLeft: containerHorizontalPadding/2}}
                            source={require("../../images/stock_detail_trading_container.png")}>
                            <View style={[styles.buttonsContainer, styles.bigButtonsContainer, 
                                {justifyContent:'center', alignItems:'center'}]}>                               
                                {this.renderSubmitButton()}                            
                            </View>
                            <CustomStyleText style={{position:'absolute', bottom:2, left:0, right:0,
                                textAlign:'center', color:'#cccccc'}}>{LS.str('ORDER_TRADING')}</CustomStyleText>
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

    buttonsScroller:{
        width: SMALL_BUTTON_ROW_SCROLLER_WIDTH,
        marginLeft: BORDER_WIDTH,
        marginRight: BORDER_WIDTH
    },

    buttonsRowContainer:{
        paddingTop:5,
        paddingBottom:2,
        paddingLeft:10,
        paddingRight:10,
        alignSelf:'stretch',
        alignItems:'stretch',
        flexDirection: 'row',        
    },

    bigButtonsContainer:{
        alignSelf:'stretch',
        flexDirection: 'column',
        flex:1,
        paddingTop:10,
        paddingBottom:15,
    },

    numberButton:{
        //flex:1,
        alignSelf:'center',
        alignItems:'stretch',
        justifyContent:'center',
        flexDirection:'row',
        paddingBottom:3,
        marginRight:3,
        marginLeft:3,
    },

    smallNumberButton:{
        width: (SMALL_BUTTON_ROW_CONTAINER_WIDTH - BORDER_WIDTH * 2 - 40) / 4 //- 20
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

const mapStateToProps = state => {
    return {
        ...state.settings,
        ...state.balance,
    };
};

const mapDispatchToProps = {
    fetchBalanceData    
};

var exportStockDetailScreen = connect(mapStateToProps, mapDispatchToProps)(StockDetailScreen);
export default exportStockDetailScreen;
module.exports = exportStockDetailScreen;