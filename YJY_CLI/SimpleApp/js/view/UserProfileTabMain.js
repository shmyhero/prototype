import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import FollowScreen from './FollowScreen';
import FollowBlock from './component/FollowBlock';
var ColorConstants = require('../ColorConstants');
var TradeStyleBlock = require('./component/personalPages/TradeStyleBlock')
var ProfitBlock = require('./component/personalPages/ProfitBlock')
var ProfitTrendCharts = require('./component/personalPages/ProfitTrendCharts')
var TradeStyleCircleBlock = require('./component/personalPages/TradeStyleCircleBlock')
var {height, width} = Dimensions.get('window');
var LS = require('../LS')

import LogicData from '../LogicData';

export default class  UserProfileTabMain extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  static propTypes = {
    followTrade: PropTypes.object,
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

  renderFollowModal(){
    var userData = LogicData.getUserData();
    if(this.props.userId == userData.userId){
      return null;
    }
    return (<FollowScreen ref={(ref)=> this.followScreen = ref}/>);
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
          <ImageBackground style={{marginTop:10,height:280,width:bgWidth,justifyContent:'center',alignContent:'center'}} resizeMode='stretch' source={require('../../images/bg_block.png')}>  
            {/* <ProfitBlock userId={this.props.userId} isPrivate={false}/> */}
             <TradeStyleCircleBlock userId={this.props.userId}  viewHeight={180} isPrivate={false}/>
          </ImageBackground>
          <View style={styles.TradeStyleContainer}>
          <ImageBackground style={{marginTop:10,height:'100%', width:"100%", justifyContent:'center'}} resizeMode='stretch' source={require('../../images/bg_block.png')}> 
            <TradeStyleBlock userId={this.props.userId} isPrivate={false} />
          </ImageBackground>
          <View style={{height:20}}></View>
          </View>
        </ScrollView>
        <FollowBlock 
          currentFollowTrade={this.props.followTrade}
          currentUserId={this.props.userId}/>
        {this.renderFollowModal()}
      </View> 
    );
  }
}

const styles = StyleSheet.create({
   container:{
      flex:1,
      backgroundColor:ColorConstants.BGBLUE,
      marginTop:10,
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
   },
   TradeStyleContainer:{
    height:140,
    marginTop:15,
    justifyContent:'center',
    alignContent:'center',
  },
})


module.exports = UserProfileTabMain;

