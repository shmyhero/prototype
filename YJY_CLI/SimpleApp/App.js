
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';
var MyHomeScreen = require('./js/view/MyHomeScreen');
var StockDetailScreen = require('./js/view/StockDetailScreen');
var MyHomeScreen3 = require('./js/view/MyHome3Screen');
var TabMainScreen = require('./js/view/TabMainScreen');
var TabMarketScreen = require('./js/view/TabMarketScreen');
var TabRankScreen = require('./js/view/TabRankScreen');
var TabPositionScreen = require('./js/view/TabPositionScreen');
var TabMeScreen = require('./js/view/TabMeScreen');
var SplashScreen = require('./js/view/SplashScreen');

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

export default class App extends React.Component {
  render() {
    return <SimpleApp uriPrefix={prefix}/>;
  }
} 

export const MainScreenNavigator = TabNavigator({
    TabMain: {
        screen: TabMainScreen,
        title:'首页'
    },
    TabMarket: {
        screen: TabMarketScreen
    },
    TabRank: {
        screen: TabRankScreen
    },
    TabPosition: {
      screen: TabPositionScreen
    },
    TabMe: {
      screen: TabMeScreen
    },
}, {
   tabBarPosition: 'bottom',
   animationEnabled: false,
   tabBarOptions: {
     activeTintColor: '#1b9bec',
     style:{
         backgroundColor: 'black',
     },
     showIcon:true,
     indicatorStyle:{height:0},//for android ,remove line on tab
   },
});

const SimpleApp = StackNavigator({
    SplashScreen:{ 
      screen: SplashScreen,
      navigationOptions:{
        header:null,
      }
    },
    Home: {
      screen: MainScreenNavigator,
      navigationOptions: {
        // title: '首页',
        header: null, 
      }, 
    }, 
    StockDetail:{ screen: StockDetailScreen},
    

});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }, 
});