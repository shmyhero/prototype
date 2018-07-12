import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import LogicData from './js/LogicData';
import Orientation from 'react-native-orientation';
import ViewKeys from './js/ViewKeys';
import SplashScreen from './js/module/SplashScreenModule';
import SimpleAppNavigator from './js/navigation/SimpleAppNavigator';

var {height, width} = Dimensions.get('window');

require('./js/utils/dateUtils')
require('./js/utils/numberUtils')

var StorageModule = require('./js/module/StorageModule');
var WebSocketModule = require('./js/module/WebSocketModule');
var {EventCenter, EventConst} = require('./js/EventCenter');

var Locale = require('react-native-locale');

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }

  console.log("navigationState ", navigationState)
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  console.log("getCurrentRouteName")
  console.log(route)
  return route.routeName;
}

class App extends React.Component {
  logOutOutsideAppSubscription = null;
  componentWillMount(){
    Orientation.lockToPortrait();
    
    this.startupJobs()
  }

  startupJobs(){    
    StorageModule.loadLanguage().then((locale)=>{
      if(locale==undefined){
        var localConstants = Locale.constants();
        locale = localConstants.localeIdentifier;
        if(Platform.OS == "ios"){
          if(localConstants.preferredLanguages && localConstants.preferredLanguages.length){
            locale = localConstants.preferredLanguages[0];
          }
        }
        StorageModule.setLanguage(locale);
      }      
      LogicData.setLanguage(locale);
    })
    .finally(()=>{
      StorageModule.loadMeData().then((value)=>{
        if(value != undefined){
          var meData = JSON.parse(value);
          LogicData.setMeData(meData);
        }
      }).finally(()=>{
        StorageModule.loadUserData().then((data)=>{
          if(data!=undefined){
            var userData = JSON.parse(data)
            LogicData.setUserData(userData);
          }
        }).finally(()=>{
          LogicData.getRemovedRynamicRow();

          EventCenter.emitStartUpInitializeFinishedEvent();
        });
      })
    });
  
    WebSocketModule.start();
    
    const backAction = NavigationActions.back({});

    const navigateAction = NavigationActions.navigate({
      routeName: ViewKeys.SCREEN_LOGIN,
      params: {
        onLoginFinished: ()=>{
          this.appNavigator.dispatch(backAction);
        }
      }
    });

    this.logOutOutsideAppSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN_OUT_SIDE, () => {
      console.log("ACCOUNT_LOGIN_OUT_SIDE")
      LogicData.logout(()=>{          
        this.appNavigator.dispatch(navigateAction)
      });
    });
  }

  render() {
    if(Platform.OS == "android"){
      StatusBar.setBarStyle("light-content");
      StatusBar.setTranslucent(true);
    }
    return <SimpleAppNavigator 
      style={{height: height, width: width}}
      ref={(ref)=>this.appNavigator = ref}
      uriPrefix={prefix}
      onNavigationStateChange={(prevState, currentState) => {        
        StatusBar.setBarStyle("light-content");
        var routeName = getCurrentRouteName(currentState);
        console.log("routeName ", routeName)
        switch(routeName){
          case ViewKeys.TAB_MAIN:
            EventCenter.emitHomeTabPressEvent();
            break;
          case ViewKeys.TAB_MARKET:
            EventCenter.emitStockTabPressEvent();
            break;
          case ViewKeys.TAB_RANK:
            EventCenter.emitRankingTabPressEvent();
            break;
          case ViewKeys.TAB_POSITION:
            EventCenter.emitPositionTabPressEvent();
            break;
          case ViewKeys.TAB_ME:
            EventCenter.emitMeTabPressEvent();
            break;
          default:
            break;
        }     
      }}
    />;
  }
} 

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

export default App;