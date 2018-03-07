import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var TradeStyleBlock = require('./component/personalPages/TradeStyleBlock')
var ProfitBlock = require('./component/personalPages/ProfitBlock')
var ProfitTrendCharts = require('./component/personalPages/ProfitTrendCharts')
var {height, width} = Dimensions.get('window');
export default class  UserProfileTabMain extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  componentDidMount(){
    this.refresh();
  }  

  refresh(){
    this.refs['profitTrendCharts'].refresh();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={{backgroundColor:'white', height:220,width:width-20,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
          <ProfitTrendCharts ref={'profitTrendCharts'}/>
        </View>
        <View style={{backgroundColor:'white', marginTop:10,height:250,width:width-20,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
          <ProfitBlock/>
        </View>
        <View style={{backgroundColor:'white', marginTop:10,marginBottom:20,height:200,width:width-20,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
          <TradeStyleBlock/>
        </View> 
        </ScrollView>  
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
    marginTop:-40,
    backgroundColor:'transparent'
   }
})


module.exports = UserProfileTabMain;

