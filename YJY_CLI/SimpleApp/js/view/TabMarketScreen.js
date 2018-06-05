import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    Button,
    View,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert
} from 'react-native';

import PropTypes from "prop-types";
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';
import LogicData from '../LogicData';
import StockRowComponent from './component/StockRowComponent';
import {ViewKeys} from '../../AppNavigatorConfiguration';

var WebSocketModule = require('../module/WebSocketModule');
var AppStateModule = require('../module/AppStateModule');
var ColorConstants = require('../ColorConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var {EventCenter,EventConst} = require('../EventCenter');
var LS = require('../LS');
import NetworkErrorIndicator from './component/NetworkErrorIndicator'
import SortableListView from 'react-native-sortable-listview'

var tabSwitchedSubscription = null;


//Tab1:行情
class TabMarketScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            listData: [],
            listDataOrder: [],
            isLoading: true,
        };
    }

    componentDidMount(){
        tabSwitchedSubscription = EventCenter.getEventEmitter().addListener(EventConst.STOCK_TAB_PRESS_EVENT, () => {
            console.log("STOCK_TAB_PRESS_EVENT")
            this.loadStockList();
        });
    }

    componentWillUnmount(){
        tabSwitchedSubscription && tabSwitchedSubscription.remove();
    }

    loadStockList(){
        this.setState({
            isLoading: true,
        }, ()=>{
            NetworkModule.fetchTHUrl(
                NetConstants.CFD_API.GET_STOCK_LIST,
                {
                    method: 'GET',				
                },
                (responseJson) => {                    
                    //Currently the order is stored in app locally.
                    this.generateDataAndOrder(responseJson).then((data)=>{
                        this.setState({
                            listDataOrder: data.listDataOrder,
                            listData: data.listData,
                            isLoading: false,
                        }, ()=>{
                            this.webSocketRegisterInsterestedStocks();
                        });
                    }); 
                },
                (result) => {
                    Alert.alert(LS.str('HINT'), result.errorMessage);
                }
            )
        });
    }

    deepCopy(obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var out = [], i = 0, len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            var out = {}, i;
            for ( i in obj ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    }

    webSocketRegisterInsterestedStocks(){
        var result = ''
		for (var i = 0; i < this.state.listDataOrder.length; i++) {
			result += ( this.state.listDataOrder[i] + ',')
		};

        result = result.substring(0, result.length - 1);
        WebSocketModule.registerInterestedStocks(result)
        WebSocketModule.registerInterestedStocksCallbacks(
			(realtimeStockInfo) => {
                var updated = false;
				for (var i = 0; i < realtimeStockInfo.length; i++) {
                    var stockID = ""+realtimeStockInfo[i].id;                   
                    if (stockID in this.state.listData){
                        this.state.listData[stockID].last = realtimeStockInfo[i].last
                        updated = true;
					}
                }
             
                if(updated){
                    this.setState({
                        //only a new object will trigger the list view update.
                        listData: this.deepCopy(this.state.listData)
                    })
                }
			})
    }

    updateStockDataOrder(localData, responseData){
        var changes = false;
        var listDataOrder = [];
        for(var index in localData){
            var id = localData[index]
            if(id in responseData && listDataOrder.indexOf(id) < 0){
                listDataOrder.push(id);
            }else{
                changes = true;
            }
        }
        for(var id in responseData){
            if(listDataOrder.indexOf(id) < 0){
                listDataOrder.push(id);
                changes = true;
            }
        }

        if(changes){
            LogicData.setMarketListOrder(listDataOrder);
        }
        return listDataOrder;
    }

    generateDataAndOrder(responseData){                
        return new Promise((resolve)=>{
            var retData = {
                listData: {},
                listDataOrder: [],
            };
            for(var i in responseData){
                var id = ""+responseData[i].id;
                retData.listData[id] = responseData[i];
            }
            
            if(this.state.listDataOrder == undefined || this.state.listDataOrder.length == 0){
                LogicData.loadMarketListOrder().then((localData)=>{
                    //There's local order data. Read it instead of use the online one.
                    retData.listDataOrder = localData;

                    var listDataOrder = this.updateStockDataOrder(localData, retData.listData)        

                    resolve(retData)
                }).catch(()=>{
                    //No data stored yet.
                    //First time run this piece of code. Save it into the database.
                    for(var i in responseData){
                        var id = ""+responseData[i].id;
                        retData.listDataOrder.push(id)
                    }
                    LogicData.setMarketListOrder(retData.listDataOrder).then(()=>{
                        resolve(retData)
                    })
                });
            }else{
                retData.listDataOrder = this.updateStockDataOrder(this.state.listDataOrder, retData.listData);
                resolve(retData)
            }
        });
    }

    renderContent(){
        if((this.state.listData == undefined || this.state.listData.length == 0)){
            return (<View style={{flex: 1, justifyContent:'center'}}>
                <NetworkErrorIndicator onRefresh={()=>this.loadStockList()} refreshing={this.state.isLoading}/>
            </View>)
        }
        else{
            return (
                <SortableListView 
                    ref="sortableListView"
                    style={{ flex: 1,}}
                    data={this.state.listData}
                    order={this.state.listDataOrder}                    
                    onRowMoved={e => {
                        this.state.listDataOrder.splice(e.to, 0, this.state.listDataOrder.splice(e.from, 1)[0]);
                        LogicData.setMarketListOrder(this.state.listDataOrder);
                        this.setState({
                            listDataOrder: this.state.listDataOrder
                        }, ()=>{
                            this.forceUpdate()
                        })
                    }}
                    sortRowStyle={{opacity:1}}
                    renderRow={row => {
                        return <StockRowComponent data={row}
                            onPress={(row)=>{
                                this.jump2Next(row.id, row.name);
                            }}
                        />}}
                    renderFooter={()=> (<View style={{height:5}}></View>)}
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <NavBar onlyShowStatusBar={true}/>
                {this.renderContent()}
            </View>
        )
        
    }   

    jump2Next(stockId, stockName){
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL,{stockCode: stockId, stockName: stockName})
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
})

export default TabMarketScreen;

