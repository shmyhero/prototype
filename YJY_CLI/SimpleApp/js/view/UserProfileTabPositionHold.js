import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock');
var UIConstants = require("../UIConstants");
var {height, width} = Dimensions.get('window');
export default class  UserProfileTabPositionHold extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  tabPressed(index){
    this.refs['positionBlock'].refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <View style={styles.content}>
          <PositionBlock ref={'positionBlock'} userId={this.props.userId} type={'open'} isPrivate={false}/>
        </View>  
      </View> 
    );
  }
}

const styles = StyleSheet.create({
   container:{
      flex:1,
      // backgroundColor:ColorConstants.BGBLUE,
      marginTop:10,
   },
   topHead:{
    //  backgroundColor:ColorConstants.BGBLUE,
     height:40,
   },
   content:{
    marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
    marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
    flex:1,
    width:width-UIConstants.ITEM_ROW_MARGIN_HORIZONTAL*2,
    marginTop:-60,
    backgroundColor:'transparent'
   }
})


module.exports = UserProfileTabPositionHold;

