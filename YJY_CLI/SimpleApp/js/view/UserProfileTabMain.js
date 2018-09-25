import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
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
var UIConstants = require('../UIConstants');
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
    var bgWidth = width-UIConstants.ITEM_ROW_MARGIN_HORIZONTAL * 2; 
    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>  
          <View style={{height:240,width:bgWidth,padding:5, paddingTop:0, marginTop:5, backgroundColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG,borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS}} resizeMode='stretch'  >  
            <ProfitTrendCharts ref={'profitTrendCharts'} userId={this.props.userId}/>
          </View>
          <View style={{marginTop:UIConstants.ITEM_ROW_MARGIN_VERTICAL, height:280,width:bgWidth,justifyContent:'center',alignContent:'center',backgroundColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG,borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS}} resizeMode='stretch' >  
            {/* <ProfitBlock userId={this.props.userId} isPrivate={false}/> */}
             <TradeStyleCircleBlock userId={this.props.userId}  viewHeight={180} isPrivate={false}/>
          </View>
          <View style={styles.TradeStyleContainer}>
            <View style={{
                flex:1,
                //width:"100%", 
                justifyContent:'center',
                backgroundColor:UIConstants.COLOR_LIST_VIEW_ITEM_BG,
                borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS
              }} resizeMode='stretch' > 
              <TradeStyleBlock userId={this.props.userId} isPrivate={false} />
            </View>
          </View>
          <View style={{height:UIConstants.ITEM_ROW_MARGIN_VERTICAL}}></View> 
        </ScrollView>
        {/* <FollowBlock 
          currentFollowTrade={this.props.followTrade}
          currentUserId={this.props.userId}/> */}
        {/* {this.renderFollowModal()} */}
      </View> 
    );
  }
}

const styles = StyleSheet.create({
   container:{
      flex:1,
      backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE,
      marginTop:10,
   },
   topHead:{
     backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE,
     height:40,
   },
   content:{
    marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
    marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
    flex:1,
    width:width-UIConstants.ITEM_ROW_MARGIN_HORIZONTAL*2,
    marginTop:-40,
    backgroundColor:'transparent'
   },
   TradeStyleContainer:{
    height:140,
    marginTop:UIConstants.ITEM_ROW_MARGIN_VERTICAL,
    justifyContent:'center',
    alignContent:'center',
  },
})


module.exports = UserProfileTabMain;

