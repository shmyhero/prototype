
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';


require('./js/utils/dateUtils')
require('./js/utils/numberUtils')

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';

var StorageModule = require('./js/module/StorageModule');
import LogicData from './js/LogicData';

import LoginScreen from './js/view/LoginScreen';
import HelpScreen from "./js/view/HelpScreen"
import AboutScreen from "./js/view/AboutScreen"
import StockDetailScreen from './js/view/StockDetailScreen';
import MessageScreen from './js/view/MessageScreen';

var MyHomeScreen = require('./js/view/MyHomeScreen');
var MyHomeScreen3 = require('./js/view/MyHome3Screen');
var TabMainScreen = require('./js/view/TabMainScreen');
import TabMarketScreen from './js/view/TabMarketScreen';
var TabRankScreen = require('./js/view/TabRankScreen');
import TabPositionScreen from './js/view/TabPositionScreen';
import TabMeScreen from './js/view/TabMeScreen';
var SplashScreen = require('./js/view/SplashScreen');
var UserProfileScreen = require('./js/view/UserProfileScreen');


// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  console.log("getCurrentRouteName")
  console.log(route)
  return route.routeName;
}

export default class App extends React.Component {
  componentWillMount(){
    this.loadDataOnStartup()
  }

  loadDataOnStartup(){
    StorageModule.loadUserData().then((data)=>{
      if(data!=undefined){
        var obj = JSON.parse(data)
        LogicData.setUserData(obj);
      }
    });
  }

  render() {
    if(Platform.OS == "android"){
      StatusBar.setBarStyle("light-content");
      StatusBar.setTranslucent(true);
    }
    return <SimpleApp uriPrefix={prefix}
      onNavigationStateChange={(prevState, currentState) => {        
        var routeName = getCurrentRouteName(currentState);
        if(routeName == "TabPosition"){
          StatusBar.setBarStyle("dark-content")
        }else{
          StatusBar.setBarStyle("light-content")
        }
      }}
    />;
  }
} 

export const MainScreenNavigator = TabNavigator({
    TabMain: {
      screen: TabMainScreen,
      title:'首页',
    },
    TabMarket: {
      screen: TabMarketScreen
    },
    TabRank: {
        screen: TabRankScreen
    },
    TabPosition: {
      screen: TabPositionScreen,      
    },
    TabMe: {
      screen: TabMeScreen
    },
  }, {
    lazy: true, //Only render tab content when it is active
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    backBehavior: 'none',
    tabBarOptions: {
      activeTintColor: '#1b9bec',
      inactiveTintColor:'grey',
      style:{
        backgroundColor: 'white',
      }, 
      labelStyle: {
        fontSize: 12, 
      },
      showIcon:true, 
      indicatorStyle:{height:0},//for android ,remove line on tab
    }, 
    navigationOptions: (navigation) => ({     
      headerStyle: {
        elevation: 0,
      },
      header: null,
    })
});

const SimpleApp = StackNavigator({
    SplashScreen:{ 
      screen: SplashScreen,
    },
    Home: {
      screen: MainScreenNavigator,
    }, 
    StockDetail:{
      screen:StockDetailScreen,      
    },
    LoginScreen:{
      screen: LoginScreen
    },
    UserProfileScreen:{
      screen:UserProfileScreen ,
    }, 
    HelpScreen:{
      screen: HelpScreen,
    },
    AboutScreen:{
      screen: AboutScreen,
    },
    MessageScreen: {
      screen: MessageScreen,
    }
},  
{
  cardStyle: {
    shadowColor: 'transparent',
  },
  navigationOptions: {
    headerStyle: {
      elevation: 0,
    },
    header: null,
  }
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }, 
  icon: {
    width: 26,
    height: 26,
  },
});

