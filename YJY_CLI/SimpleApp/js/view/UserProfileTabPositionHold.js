import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock') 
var {height, width} = Dimensions.get('window');
export default class  UserProfileTabPositionHold extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <View style={styles.content}>
          <PositionBlock/>
        </View>  
      </View> 
    );
  }
}

const styles = StyleSheet.create({
   container:{
      flex:1,
      backgroundColor:'white'
   },
   topHead:{
     backgroundColor:ColorConstants.BGBLUE,
     height:40,
   },
   content:{
    marginLeft:10,
    marginRight:10,
    flex:1,
    width:width-20,
    marginTop:-60,
    backgroundColor:'transparent'
   }
})


module.exports = UserProfileTabPositionHold;

