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
var PositionBlock = require('./component/personalPages/PositionBlock') 
var TradeStyleBlock = require('./component/personalPages/TradeStyleBlock')
var ProfitBlock = require('./component/personalPages/ProfitBlock')
var ProfitTrendCharts = require('./component/personalPages/ProfitTrendCharts')
var ProfitStatisticsBlock = require('./component/personalPages/ProfitStatisticsBlock')
var {height, width} = Dimensions.get('window');
export default class  MyPositionTabStatistics extends React.Component {
  static navigationOptions = {
    title: 'Home',
  } 


  refresh(){
    // this.refs['profitStatisticBlock'].refresh();
    console.log('onREFESH:'+this.refs['profitStatisticBlock'].refresh);
  }
  
  render() {
    return (
      <View style={styles.container}> 
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            {/* <View style={{backgroundColor:'white', height:220,width:width-40,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}> */}
              <ProfitStatisticsBlock ref={'profitStatisticBlock'}/>
            {/* </View> */}
            <View style={{backgroundColor:'white', marginTop:10,height:220,width:width-40,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
              <ProfitTrendCharts/>
            </View>
            <View style={{backgroundColor:'white', marginTop:10,height:250,width:width-40,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
              <ProfitBlock/>
            </View>
            <View style={{backgroundColor:'white', marginTop:10,marginBottom:20,height:200,width:width-40,borderRadius:10,borderWidth:1,borderColor:'#EEEEEE'}}>
              <TradeStyleBlock/>
            </View> 
          </ScrollView>  
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
    
   content:{
    marginLeft:10,
    marginRight:10,
    flex:1,
    width:width-20, 
    backgroundColor:'transparent'
   }
})


module.exports = MyPositionTabStatistics;

