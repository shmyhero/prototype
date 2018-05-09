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

    var leftbg = this.state.rankType == RANKING_TYPE_0 ? '#41bafc':'#1b9beb';
    var leftbd = this.state.rankType == RANKING_TYPE_0 ? '#41bafc':'#41bafc';
    var middlebg = this.state.rankType == RANKING_TYPE_1 ? '#41bafc':'#1b9beb';
    var middlebd = this.state.rankType == RANKING_TYPE_1 ? '#41bafc':'#41bafc';
    var rightbg = this.state.rankType == RANKING_TYPE_2 ? '#41bafc':'#1b9beb';
    var rightbd = this.state.rankType == RANKING_TYPE_2 ? '#41bafc':'#41bafc';

    var leftTextColor = this.state.rankType == RANKING_TYPE_0 ? 'white':'#41bafc';
    var middleTextColor = this.state.rankType == RANKING_TYPE_1 ? 'white':'#41bafc';
    var rightTextColor = this.state.rankType == RANKING_TYPE_2 ? 'white':'#41bafc';

    return(
        <View style={styles.headContainer}>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_0)}
            style={{flex:1,height:32, 
            alignItems:'center',
            justifyContent:'center',
            borderTopLeftRadius:16,
            borderBottomLeftRadius:16,
            backgroundColor:leftbg,
            borderColor:leftbd,
            borderWidth:1,
            }}>
            <Text style={{color:leftTextColor}}>{LS.str("EXPERT")}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_1)}
            style={{flex:1,height:32, 
            alignItems:'center',
            justifyContent:'center', 
            backgroundColor:middlebg,
            borderColor:middlebd,
            borderWidth:1,
            }}>
            <Text style={{color:middleTextColor}}>{LS.str("CONCERN")} </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_2)}
            style={{flex:1,height:32, 
            alignItems:'center',
            justifyContent:'center',
            marginLeft:-1,
            borderTopRightRadius:16,
            borderBottomRightRadius:16,
            backgroundColor:rightbg,
            borderColor:rightbd,
            borderWidth:1,}}>
            <Text style={{color:rightTextColor}}>{LS.str("COPY_TRADE")} </Text>
          </TouchableOpacity>
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
      marginBottom:5,
      height:32,
      width:192,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center', 
      flexDirection:'row', 
    }
})

module.exports = TabRankScreen;

