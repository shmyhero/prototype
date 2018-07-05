'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Image,
	Text,
	TouchableHighlight,
	Platform,
	TextInput,
	Dimensions,
	FlatList,
	Alert,
	TouchableOpacity,
} from 'react-native';
import LogicData from '../LogicData';
import ViewKeys from '../../AppNavigatorConfiguration';
import SortableListView from 'react-native-sortable-listview';
import NavBar from './component/NavBar';
import StockRowComponent from './component/StockRowComponent';

var LS = require("../LS");
var LayoutAnimation = require('LayoutAnimation')
var ColorConstants = require('../ColorConstants')
var NetConstants = require('../NetConstants')
var StorageModule = require('../module/StorageModule')
var NetworkModule = require('../module/NetworkModule')

// create a component
class StockSearchScreen extends Component {
	constructor(props){
        super(props)


        var state = {
			listData: {},
            listDataOrder: [],
            isLoading: true,
        };

        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
			state.onGetItem = params.onGetItem;
        }
        
        this.state = state;
    }

    componentWillMount(){
        this.loadStockList();
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
                        });
                    }); 
                },
                (result) => {
                    Alert.alert(LS.str("HINT"), result.errorMessage);
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
        if(this.state.isLoading){
            return (<View style={{ flex: 1, justifyContent:'center'}}>
                <Text style={{textAlign:'center', color: 'white', fontSize:20}}>{LS.str("DATA_LOADING")}</Text>
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
                <NavBar title={LS.str("SELECT_PRODUCT")} navigation={this.props.navigation}/>
                {this.renderContent()}
            </View>
        )
    }   

    jump2Next(stockId, stockName){
		this.props.navigation.goBack(null);
		
		if(this.state.onGetItem){
			this.state.onGetItem({id: stockId, name: stockName});
		}
    }
}

var styles = StyleSheet.create({
	mainContainer:{
        flex:1,
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
});

export default StockSearchScreen;
module.exports = StockSearchScreen;
