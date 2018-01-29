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
import { TabNavigator } from "react-navigation";
var WebSocketModule = require('../module/WebSocketModule');
var AppStateModule = require('../module/AppStateModule');
var ColorConstants = require('../ColorConstants');


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
        tabBarOnPress: (scene,jumpToIndex) => {
                 console.log(scene)
                 jumpToIndex(scene.index)
        },
  }

  render() {
    return (
    <View style={styles.mainContainer}>
        <TouchableOpacity onPress={()=>{this.startWebSocket()}}>
        <Text style={{color:'black'}}>行情</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this.jump2Next()}}>
                <Text style={{color:'black'}}>跳转</Text>
            </TouchableOpacity>
        </View>
    );
  }

  jump2Next(){
    this.props.navigation.navigate('StockDetail',{name:'Lucy'})
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
  }
}



const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.WHITE
    },
    icon: {
      width: 26,
      height: 26,
    },
})

module.exports = TabMarketScreen;

