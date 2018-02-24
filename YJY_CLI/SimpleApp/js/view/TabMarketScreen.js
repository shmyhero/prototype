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

var WebSocketModule = require('../module/WebSocketModule');
var AppStateModule = require('../module/AppStateModule');
var ColorConstants = require('../ColorConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');

import SortableListView from 'react-native-sortable-listview'

class RowComponent extends React.Component {
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
            console.log('rowData.isOpen = '+rowData.isOpen+' rowData.status = ' + rowData.status);
			if(rowData.isOpen || rowData.status == undefined){
				return null;
			}else{
				console.log('rowData.isOpen = '+rowData.isOpen+' rowData.status = ' + rowData.status);
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
export default class  TabMarketScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel:'行情',
        tabBarIcon: ({ focused,tintColor }) => (
            <Image
            source={focused?require('../../images/tab1_sel.png'):require('../../images/tab1_unsel.png')}
            style={[styles.icon]}
            />
        ),
    }

    constructor(props){
        super(props)

        this.state = {
            listData: {},
            listDataOrder: [],
            isLoading: true,
        };
    }

    loadStockList(){
        this.setState({
            isLoading: true,
        }, ()=>{
            console.log("loadStockList")
            NetworkModule.fetchTHUrl(
                NetConstants.CFD_API.GET_STOCK_LIST,
                {
                    method: 'GET',				
                },
                (responseJson) => {
                    var data = this.parseServerData(responseJson)
                    console.log("data: ")
                    console.log(data)
    
                    this.setState({
                        isLoading: false,
                        listData: data.listData,
                        listDataOrder: data.listDataOrder,
                    });
                },
                (result) => {
                    Alert.alert('提示', result.errorMessage);
                }
            )
        });
    }

    parseServerData(data){
        var listData = {};
        for(var i in data){
            listData[""+data[i].id] = data[i];
        }
        var listDataOrder = Object.keys(listData)
        return {listData: listData, listDataOrder: listDataOrder};
    }

    renderContent(){
        if(this.state.isLoading){
            return (<View style={{ flex: 1, justifyContent:'center'}}>
                <Text style={{textAlign:'center', color: 'white', fontSize:20}}> 数据读取中... </Text>
            </View>);
        }else{
            return (
                    <SortableListView
                        style={{ flex: 1,}}
                        data={this.state.listData}
                        order={this.state.listDataOrder}                    
                        onRowMoved={e => {
                            this.state.listDataOrder.splice(e.to, 0, this.state.listDataOrder.splice(e.from, 1)[0])
                            this.forceUpdate()
                        }}
                        sortRowStyle={{opacity:1}}
                        renderRow={row => <RowComponent data={row}
                            onPress={(row)=>{
                                this.jump2Next(row.id, row.name);
                            }}
                        />}
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

    startWebSocket(){
        // WebSocketModule.cleanRegisteredCallbacks()
        // var stockData = '34821,34847'//黄金，白银
        // WebSocketModule.registerInterestedStocks(stockData)

        // var isConnected = WebSocketModule.isConnected();
        // console.log("isConnected = " + isConnected)
    }

    componentWillMount(){
        this.loadStockList();
    }

    componentDidMount(){
        WebSocketModule.start();
        AppStateModule.registerTurnToActiveListener(()=>{console.log('SimpleApp registerTurnToActiveListener')});
    }

    componentWillUnmount(){
        AppStateModule.unregisterTurnToActiveListener(()=>{console.log('SimpleApp componentWillUnmount')});
        WebSocketModule.stop()
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
        marginTop: 8,
        marginRight: 15,
        marginLeft:15,
        marginBottom: 7,
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

module.exports = TabMarketScreen;

