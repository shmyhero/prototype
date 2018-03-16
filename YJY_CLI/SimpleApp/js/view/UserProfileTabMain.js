import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  ImageBackground
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


  tabPressed(index){
    console.log('UserProfileTabMain tabPressed')
  }

  refresh(){
    this.refs['profitTrendCharts'].refresh();
  }

  render() {

    var bgWidth = width-20; 

    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>  
          <ImageBackground style={{height:240,width:bgWidth,padding:5}} resizeMode='stretch'  source={require('../../images/bg_block.png')}>  
            <ProfitTrendCharts ref={'profitTrendCharts'} userId={this.props.userId}/>
          </ImageBackground>
          <ImageBackground style={{marginTop:10,height:240,width:bgWidth}} resizeMode='stretch' source={require('../../images/bg_block.png')}>  
            <ProfitBlock userId={this.props.userId} isPrivate={false}/>
          </ImageBackground>
          <ImageBackground style={{marginTop:10,marginBottom:10,height:180,width:bgWidth}} resizeMode='stretch' source={require('../../images/bg_block.png')}> 
            <TradeStyleBlock userId={this.props.userId} isPrivate={false}/>
          </ImageBackground>
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

