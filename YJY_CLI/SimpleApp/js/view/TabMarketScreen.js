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

import { StackNavigator } from 'react-navigation';
import PropTypes from "prop-types";
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';
import LogicData from '../LogicData';

var WebSocketModule = require('../module/WebSocketModule');
var AppStateModule = require('../module/AppStateModule');
var ColorConstants = require('../ColorConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var {EventCenter,EventConst} = require('../EventCenter');

import SortableListView from 'react-native-sortable-listview'

var tabSwitchedSubscription = null;

class RowComponent extends Component {
    static propTypes = {
        onPress: PropTypes.func,
    }

    static defaultProps = {
        onPress: ()=>{},
    }

    renderStockStatus(rowData){
		var strBS = "闭市";
		var strZT = "暂停";
		if(rowData!==undefined){
			if(rowData.isOpen || rowData.status == undefined){
				return null;
			}else{
                var statusTxt = rowData.status == 2 ? strZT:strBS;

                return(
					<View style={styles.statusLableContainer}>
						<Text style={styles.statusLable}>{statusTxt}</Text>
					</View>
				)
            }
        }
    }

    render() {
        var pl = ((this.props.data.last - this.props.data.open ) / this.props.data.open * 100).toFixed(2)
        var plStyleList = [styles.plStyle];
        var plStr = "" + pl + "%";
        if(pl > 0){
            plStyleList.push(styles.UpPLStyle);
            plStr = "+" + plStr;
        }
        else if(pl < 0){
            plStyleList.push(styles.DownPLStyle);
        }
        else if(pl == 0){
            plStyleList.push(styles.SamePLStyle);
        }

        return (
            <TouchableOpacity
                underlayColor={'#eee'}
                style={styles.stockTouchableContainerStyle}
                onPress={()=>this.props.onPress(this.props.data)}
                activeOpacity={0.7}
                {...this.props.sortHandlers}>
                <View style={styles.stockRowContainer}>
                    <View style={styles.titleContainerStyle}>
                        <Text style={styles.titleStyle}>{this.props.data.name}</Text>
                        <View style={{flexDirection:'row'}}>
                            {this.renderStockStatus(this.props.data)}
                            <Text style={styles.symbolStyle}>{this.props.data.symbol}</Text>
                        </View>
                    </View>
                    <Text style={styles.priceStyle}>{this.props.data.last}</Text>
                    <Text style={plStyleList}>{plStr}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

//Tab1:行情
class TabMarketScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            listData: {},
            listDataOrder: [],
            isLoading: true,
        };
    }

    componentWillMount(){
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
                    Alert.alert('提示', result.errorMessage);
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
                    retData.listDataOrder = localData;

                    var listDataOrder = this.updateStockDataOrder(localData, retData.listData)        

                    resolve(retData)
                }).catch(()=>{
                    //No data stored yet.
                    //First time run this piece of code. Save it into the database.
                    for(var i in responseData){
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
        if(this.state.isLoading){
            return (<View style={{ flex: 1, justifyContent:'center'}}>
                <Text style={{textAlign:'center', color: 'white', fontSize:20}}> 数据读取中... </Text>
            </View>);
        }else{
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
                        return <RowComponent data={row}
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
        this.props.navigation.navigate('StockDetail',{stockCode: stockId, stockName: stockName})
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
    icon: {
        width: 26,
        height: 26,
    },

    stockRowContainer:{
        margin:15,
        flexDirection:'row',
        flex:1
    },

    stockTouchableContainerStyle:{
        borderRadius: 10,
        backgroundColor: "white",
        marginTop: 5,
        marginRight: 15,
        marginLeft:15,
        marginBottom: 5,
        height:70,
    },

    titleContainerStyle:{
        flex:2,
        
    },

    priceStyle:{
        flex:1,
        textAlign:'right',
        alignSelf: 'center',
        fontSize: 17
    },

    plStyle:{
        flex:1,
        textAlign:'right',
        alignSelf: 'center',
        fontSize: 17
    },

    titleStyle:{
        color:'#000000',
        fontSize: 15,
    },

    symbolStyle:{
        color:'#666666',
        fontSize: 15,
    },

    UpPLStyle:{
        color: ColorConstants.STOCK_RISE_RED,
    },

    DownPLStyle: {
        color: ColorConstants.STOCK_DOWN_GREEN,
    },
    
    SamePLStyle: {
        color: ColorConstants.STOCK_UNCHANGED_GRAY,
    },

    statusLableContainer: {
		backgroundColor: '#999999',
		borderRadius: 2,
		paddingLeft: 1,
		paddingRight: 1,
        marginRight: 2,
        alignSelf:'center',
        alignItems: 'center',
    },
    
	statusLable:{
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},
})

export default TabMarketScreen;

