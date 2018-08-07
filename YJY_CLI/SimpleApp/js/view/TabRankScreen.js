import React, { Component } from 'react';
import {
  AppRegistry,
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
import CustomStyleText from './component/CustomStyleText';
import NavBar from './component/NavBar';
import LogicData from '../LogicData';
import LoginScreen from './LoginScreen';
var ScrollTabView = require('./component/ScrollTabView')
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
class  TabRankScreen extends React.Component {
  tabSwitchedSubscription = null;

  constructor(props){
    super(props);
    this.state = {
      contentLoaded: false,
      isRefreshing: true,
      rankType : RANKING_TYPE_0, 
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
    },this.refreshTabs()) 
  }

  refreshTabs(){
    if(this.state.isLoggedIn){
      this.refs['page' + 0].tabPressed();
      this.refs['page' + 1].tabPressed();
      this.refs['page' + 2].tabPressed();
    } 
  }

  // onPressedRankType(type){
  //   if(type==this.state.rankType)return;
  //   this.setState({
  //     rankType:type
  //   }) 
  // }
 

  // renderRankTypeButton(){
  //   var marginLeft = width/2-6
  //   marginLeft += (this.state.rankType - 1) * 100
  //   var textStyle0 = this.state.rankType==0?styles.textHeaderSeleted:styles.textHeader;
  //   var textStyle1 = this.state.rankType==1?styles.textHeaderSeleted:styles.textHeader;
  //   var textStyle2 = this.state.rankType==2?styles.textHeaderSeleted:styles.textHeader;
  //   if(LogicData.isLoggedIn()){
  //     return(
  //       <View>
  //        <View style={styles.headContainer}>
  //         <TouchableOpacity 
  //           onPress={()=>this.onPressedRankType(RANKING_TYPE_0)}
  //            style={{ 
  //            alignItems:'center',
  //            justifyContent:'center',  
  //            height:48,
  //            width:100, 
  //           }} >
  //           <Text style={textStyle0}>{LS.str("EXPERT")}</Text>
             
  //         </TouchableOpacity>
  //         <TouchableOpacity 
  //            onPress={()=>this.onPressedRankType(RANKING_TYPE_1)}
  //            style={{ 
  //            alignItems:'center',
  //            justifyContent:'center',  
  //            height:48,
  //            width:100, 
  //           }} 
  //           >
  //           <Text style={textStyle1}>{LS.str("CONCERN")} </Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity 
  //            onPress={()=>this.onPressedRankType(RANKING_TYPE_2)}
  //            style={{ 
  //            alignItems:'center',
  //            justifyContent:'center',  
  //            height:48,
  //            width:100, 
  //           }} 
  //           >
  //           <Text style={textStyle2}>{LS.str("COPY_TRADE")} </Text>
  //         </TouchableOpacity>
  //       </View> 
  //       <View>
  //           <Image style={{width:11.5,height:6.5,marginLeft:marginLeft}} source={require('../../images/icon_control.png')}/>
  //           <View style={{width:width,height:1,backgroundColor:'#26598e'}}></View>
  //           <View style={{width:width,height:10}}></View>
  //       </View>
  //     </View>   
  //     )
  //   }else{
  //     return( 
  //       <View style={{width:width,height:36,justifyContent:'center',alignItems:'center'}}>
  //         <Text style={{fontSize:18,color:'white'}}>达人</Text>
  //       </View>
       
  //     ) 
  //   }
    
  // }

  // renderRanks(){
  //   if(this.state.rankType == RANKING_TYPE_0){
  //     return(<RankHeroList ref={RANK_LIST} showMeBlock={this.state.isLoggedIn} navigation={this.props.navigation}>达人榜</RankHeroList>)
  //   }else if(this.state.rankType == RANKING_TYPE_1){
  //     if(this.state.isLoggedIn){
  //       return(<RankFollowList navigation={this.props.navigation}/>)
  //     }else{
  //       return (<LoginScreen hideBackButton={true}
  //         onLoginFinished={()=>{
  //           this.setState({
  //             isLoggedIn:true,
  //           })}
  //       }/>)
  //     }
  //   }else if(this.state.rankType == RANKING_TYPE_2){
  //     if(this.state.isLoggedIn){
  //       return(<RankTradeFollowList navigation={this.props.navigation}/>)
  //     }else{
  //       return (<LoginScreen hideBackButton={true}
  //         onLoginFinished={()=>{
  //           this.setState({
  //             isLoggedIn:true,
  //           })}
  //       }/>)
  //     }
  //   }
  // }

  render() {
    return (
    <View style={styles.mainContainer}>
        <NavBar onlyShowStatusBar={true}/>
        {/* {this.renderRankTypeButton()}
        {this.renderRanks()} */}
        {this.renderContent()}
    </View>
    );
  }

  onPageSelected(index) {
    var lastSelectedTabIndex = this.state.currentSelectedTab;
		this.setState({
      currentSelectedTab: index, 
		}) 
		if (this.refs['page' + index]) {
			this.refs['page' + index].tabPressed(index);
    }
    console.log("onPageSelected", index)
    console.log("onPageSelected lastSelectedTabIndex", lastSelectedTabIndex)

    if(lastSelectedTabIndex){
      this.refs['page' + lastSelectedTabIndex].outSideTab && this.refs['page' + lastSelectedTabIndex].outSideTab();
    }
  } 

  renderUnLoginedContent(){ 
      return(  
        <View style={{flex:1}}>
            <View style={{width:width,height:36,justifyContent:'center',alignItems:'center'}}>
              <CustomStyleText style={{fontSize:18,color:'white'}}>达人</CustomStyleText>
            </View>
            <RankHeroList ref={RANK_LIST} showMeBlock={this.state.isLoggedIn} navigation={this.props.navigation}/> 
        </View>  
         ) 
  }

  renderLoginedContent(){ 
    var tabPages = [
      <RankHeroList navigation={this.props.navigation} ref={'page0'}  showMeBlock={this.state.isLoggedIn}  />,
      <RankFollowList navigation={this.props.navigation} ref={'page1'}  />,
      <RankTradeFollowList navigation={this.props.navigation} ref={'page2'} /> 
    ]

    var tabNameShow = [LS.str("EXPERT"),LS.str("CONCERN"),LS.str("COPY_TRADE")]

    var viewPages = tabNameShow.map(
      (tabNameShow, i) =>
      <View style={{width:width}} key={i}>
        {tabPages[i]}
      </View>
    ) 

    return ( 
      <View style={{flex: 1, backgroundColor:'transparent'}}>
        <ScrollTabView 
          ref={"tabPages"} 
          tabNames={tabNameShow} 
          viewPages={viewPages} 
          tabBgStyle={0}
          tabFontSize={17}
          removeClippedSubviews={true}
          onPageSelected={(index) => this.onPageSelected(index)}
          />
      </View>
    )
  }

  renderContent(){
    if(this.state.isLoggedIn){
      return( 
         this.renderLoginedContent()
      ) 
    }else{
      return(
        this.renderUnLoginedContent()
      )
    }
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
      height:42,
      width:192,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center', 
      flexDirection:'row',  
    },
    textHeader:{
      color:'#ffffff',
      fontSize:17,
      opacity:0.6
    },
    textHeaderSeleted:{
      color:'#ffffff',
      fontSize:17,
      opacity:1
    },

})

export default TabRankScreen;

