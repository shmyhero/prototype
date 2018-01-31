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
    Alert
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import PropTypes from "prop-types";
import { TabNavigator } from "react-navigation";
var WebSocketModule = require('../module/WebSocketModule');
var AppStateModule = require('../module/AppStateModule');
var ColorConstants = require('../ColorConstants');

import SortableListView from 'react-native-sortable-listview'

class RowComponent extends React.Component {
    static propTypes = {
        onPress: PropTypes.func,
    }

    static defaultProps = {
        onPress: ()=>{},
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
                    <View style={styles.titleContainerStyle }>
                        <Text style={styles.titleStyle}>{this.props.data.name}</Text>
                        <Text style={styles.symbolStyle}>{this.props.data.symbol}</Text>
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
        tabBarIcon: ({ tintColor }) => (
            <Image
            source={require('../../images/tab1_sel.png')}
            style={[styles.icon, {tintColor: tintColor}]}
            />
        ),
        tabBarOnPress: (scene, jumpToIndex) => {
            console.log(scene)
            jumpToIndex(scene.index)
        },
    }

    constructor(props){
        super(props)

        var sampledata = [ { id: 34811,
            symbol: 'CAC',
            name: '法国40',
            preClose: 5482.8,
            open: 5470.5,
            last: 5480.4,
            isOpen: true,
            status: 1 },
          { id: 34820,
            symbol: 'DAX',
            name: '德国30',
            preClose: 13210,
            open: 13196.4,
            last: 13224,
            isOpen: true,
            status: 1 },
          { id: 34864,
            symbol: 'INDU',
            name: '华尔街',
            preClose: 26108,
            open: 26067,
            last: 26107,
            isOpen: true,
            status: 1 },
          { id: 34858,
            symbol: 'NDX',
            name: '美国科技股100',
            preClose: 6940.5,
            open: 6931.13,
            last: 6940.5,
            isOpen: true,
            status: 1 },
          { id: 34857,
            symbol: 'SPX',
            name: '美国标准500',
            preClose: 2826.43,
            open: 2821.93,
            last: 2826.18,
            isOpen: true,
            status: 1 },
          { id: 34801,
            symbol: 'SX5E',
            name: '欧洲50',
            preClose: 3613,
            open: 3604,
            last: 3613,
            isOpen: true,
            status: 1 },
          { id: 34854,
            symbol: 'UKX',
            name: '英国100',
            preClose: 7596.1,
            open: 7574,
            last: 7582.5,
            isOpen: true,
            status: 1 } ];
        
        var data = this.parseServerData(sampledata)
        this.state = {
            listData: data.listData,
            listDataOrder: data.listDataOrder,
        };
    }

    parseServerData(data){
        var listData = {};
        for(var i in data){
            listData[""+data[i].id] = data[i];
        }
        var listDataOrder = Object.keys(listData)
        return {listData: listData, listDataOrder: listDataOrder};
    }

    componentWillMount(){

    }
        
    render() {        
        return (
            <View style={styles.mainContainer}>                             
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
                            this.jump2Next(row.id);
                        }}
                    />}
                />
            </View>
        );
    }   

    jump2Next(stockId){
        this.props.navigation.navigate('StockDetail',{stockCode:stockId})
    }

    startWebSocket(){
        // WebSocketModule.cleanRegisteredCallbacks()
        // var stockData = '34821,34847'//黄金，白银
        // WebSocketModule.registerInterestedStocks(stockData)

        // var isConnected = WebSocketModule.isConnected();
        // console.log("isConnected = " + isConnected)
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

    DownPLStyle:{
        color: ColorConstants.STOCK_DOWN_GREEN,
    },
    
    SamePLStyle:{
        color: ColorConstants.STOCK_UNCHANGED_GRAY,
    }
})

module.exports = TabMarketScreen;

