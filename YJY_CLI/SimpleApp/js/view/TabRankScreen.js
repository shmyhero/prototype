import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';
import LogicData from '../LogicData';
import LoginScreen from './LoginScreen';
var {EventCenter, EventConst} = require('../EventCenter');
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var WebSocketModule = require('../module/WebSocketModule');
var ColorConstants = require('../ColorConstants');
var RankHeroList = require('./RankHeroList');
var RankFollowList = require('./RankFollowList');
var RankTradeFollowList = require('./RankTradeFollowList');
var {height, width} = Dimensions.get('window');
var RANKING_TYPE_0 = 0;//达人
var RANKING_TYPE_1 = 1;//关注
var RANKING_TYPE_2 = 2;//跟随
var LS = require('../LS')

const RANK_LIST = 'rankList'
//Tab2:榜单
export default class  TabRankScreen extends React.Component {
  tabSwitchedSubscription = null;

  constructor(props){
    super(props);
    this.state = {
      contentLoaded: false,
      isRefreshing: true,
      rankType: RANKING_TYPE_0, 
      isLoggedIn: LogicData.isLoggedIn()
    } 
  }
  
  componentWillMount(){
    this.tabSwitchedSubscription = EventCenter.getEventEmitter().addListener(EventConst.RANKING_TAB_PRESS_EVENT, () => {
      console.log("RANKING_TAB_PRESS_EVENT")
      WebSocketModule.cleanRegisteredCallbacks();
      this.refresh();
    });
  }

  componentWillUnmount(){
    this.tabSwitchedSubscription && this.tabSwitchedSubscription.remove();
  }

  refresh(){
    this.setState({
      isLoggedIn: LogicData.isLoggedIn()
    }) 
    // this.onPressedRankType(RANKING_TYPE_0)
    if(this.refs[RANK_LIST]){
      this.refs[RANK_LIST].onRefresh()
    }
  }

  onPressedRankType(type){
    if(type==this.state.rankType)return;
    this.setState({
      rankType:type
    }) 
  }
 

  renderRankTypeButton(){
    var marginLeft = width/2-6
    marginLeft += (this.state.rankType - 1) * 100

    return( 
      <View>
         <View style={styles.headContainer}>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_0)}
             style={{ 
             alignItems:'center',
             justifyContent:'center',  
             height:48,
             width:100, 
            }} >
            <Text style={{color:'white'}}>{LS.str("EXPERT")}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             onPress={()=>this.onPressedRankType(RANKING_TYPE_1)}
             style={{ 
             alignItems:'center',
             justifyContent:'center',  
             height:48,
             width:100, 
            }} 
            >
            <Text style={{color:'white'}}>{LS.str("CONCERN")} </Text>
          </TouchableOpacity>
          <TouchableOpacity 
             onPress={()=>this.onPressedRankType(RANKING_TYPE_2)}
             style={{ 
             alignItems:'center',
             justifyContent:'center',  
             height:48,
             width:100, 
            }} 
            >
            <Text style={{color:'white'}}>{LS.str("COPY_TRADE")} </Text>
          </TouchableOpacity>
        </View> 
        <View>
            <Image style={{width:11.5,height:6.5,marginLeft:marginLeft}} source={require('../../images/icon_control.png')}/>
            <View style={{width:width,height:2,backgroundColor:'#30adf2'}}></View>
            <View style={{width:width,height:10}}></View>
        </View>
      </View>  
       
       
    ) 
  }

  renderRanks(){
    if(this.state.rankType == RANKING_TYPE_0){
      return(<RankHeroList ref={RANK_LIST} showMeBlock={this.state.isLoggedIn} navigation={this.props.navigation}>达人榜</RankHeroList>)
    }else if(this.state.rankType == RANKING_TYPE_1){
      if(this.state.isLoggedIn){
        return(<RankFollowList navigation={this.props.navigation}/>)
      }else{
        return (<LoginScreen hideBackButton={true}
          onLoginFinished={()=>{
            this.setState({
              isLoggedIn:true,
            })}
        }/>)
      }
    }else if(this.state.rankType == RANKING_TYPE_2){
      if(this.state.isLoggedIn){
        return(<RankTradeFollowList navigation={this.props.navigation}/>)
      }else{
        return (<LoginScreen hideBackButton={true}
          onLoginFinished={()=>{
            this.setState({
              isLoggedIn:true,
            })}
        }/>)
      }
    }
  }

  render() {
    return (
    <View style={styles.mainContainer}>
        <NavBar onlyShowStatusBar={true}/>
        {this.renderRankTypeButton()}
        {this.renderRanks()}
    </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.BGBLUE
    },
    icon: {
      width: 26,
      height: 26,
    },
    headContainer:{
      marginBottom:0,
      height:32,
      width:192,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center', 
      flexDirection:'row',  
    }
})

module.exports = TabRankScreen;

