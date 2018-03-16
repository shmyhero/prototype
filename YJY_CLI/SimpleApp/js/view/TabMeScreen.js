import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';

var {height,width} = Dimensions.get('window');
var BUTTON_WIDTH = width - 20;
var BUTTON_HEIGHT = BUTTON_WIDTH / 701 * 132;
var BIG_BUTTON_HEIGHT = BUTTON_WIDTH / 722 * 380;

import { ViewKeys } from '../../AppNavigatorConfiguration';
import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';

import LogicData from "../LogicData";
import LoginScreen from './LoginScreen';

var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule');
var ColorConstants = require('../ColorConstants');
var {EventCenter, EventConst} = require('../EventCenter')
var WebSocketModule = require('../module/WebSocketModule');

var layoutSizeChangedSubscription = null;
//Tab4:我的
class  TabMeScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = this.getInitialState()
  }

  getInitialState(){
    return {
      userLoggedin: false,
      nickname: "",
      picUrl:"",
    };
  }

  componentWillMount() {
    layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ME_TAB_PRESS_EVENT, () => {
      console.log("ME_TAB_PRESS_EVENT")
      WebSocketModule.cleanRegisteredCallbacks();
			this.refresh();
    });     
  } 

  componentWillUnmount(){
    layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove()
  }

  refresh(){
    var state = this.getInitialState();

    var meData = LogicData.getMeData();
    if(Object.keys(meData).length > 0){
      state.nickname = meData.nickname
    }
    console.log("refresh ", LogicData.isLoggedIn())
    if(!LogicData.isLoggedIn()){
      this.setState(state)
    }else{
      //TODO: the refresh jobs
      state.userLoggedin = true;
      this.setState(state, ()=>{
        this.fetchMeData();
      });
    }
  }

  fetchMeData(){
    var userData = LogicData.getUserData();
    NetworkModule.fetchTHUrl(
      NetConstants.CFD_API.ME_DATA,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        showLoading: true,
      }, (responseJson) => {					
        LogicData.setMeData(responseJson);
        this.setState({
          nickname: responseJson.nickname,
          picUrl:responseJson.picUrl,
        })
      });
  }

  onExitButtonPressed(){
    LogicData.logout(()=>{
      this.refresh();
    })
  }

  renderLogin(){
    return <LoginScreen 
              hideBackButton={true} 
              onLoginFinished={()=>{this.refresh()}}
              />;
  }

  renderExitButton(){
    return (
      <TouchableOpacity style={styles.smallButtonContainer} onPress={()=>this.onExitButtonPressed()}>
        <ImageBackground source={require('../../images/me_entry_button_gray.png')}
          resizeMode={'contain'}
          style={styles.buttonBackground}>
        <View style={styles.buttonTextContainer}>
          <Text style={{fontSize:15, color:'#999999'}}>退出登录</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>);
  }

  showHelp(){
    this.props.navigation.navigate(ViewKeys.SCREEN_HELP);
  }

  showAbout(){
    this.props.navigation.navigate(ViewKeys.SCREEN_ABOUT);
  }

  showWithdraw(){
    this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT);
  }

  showMessage(){
    this.props.navigation.navigate(ViewKeys.SCREEN_MESSAGE);
  }

  renderButton(title, icon, onPress){
    return (
      <TouchableOpacity style={styles.smallButtonContainer} onPress={()=>onPress()}>
        <ImageBackground source={require('../../images/me_entry_button.png')}
          resizeMode={'contain'}
          style={styles.buttonBackground}>
          <View style={styles.buttonTextContainerLeft}>
            <Image style={{marginLeft:10, height:30, width:30}} source={icon}></Image>
            <View style={{flexDirection:'column', justifyContent:'center', marginLeft: 10}}>
              <Text style={{fontSize:15, color:'#8c8d90'}}>{title}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>);
  }

  renderPortrait(){
    var picSource = require('../../images/head_portrait.png')
    if(this.state.picUrl.length>0){
      picSource = {uri:this.state.picUrl}
    }
    return(
      <View style={{justifyContent:'center'}}>

        <Image style={styles.headPortrait} source={picSource}></Image>
        <Text style={{textAlign:'center', marginTop:10, height:15, fontSize: 12, color: '#44c1fc'}}>{this.state.nickname}</Text>

      </View>
    )
  }

  renderBalance(){
    return (
      <View style={styles.bigButtonContainer}>        
        <ImageBackground source={require('../../images/me_balance_border.png')}
          resizeMode={'contain'}
          style={{
              width: '100%',
              height: '100%',
              justifyContent:'center',
              flexDirection:'column',
          }}>
          <View style={styles.buttonTextContainer}>
              <Text style={{fontSize:12, color:'#999999'}}>糖果数</Text>
              <Text style={{fontSize:34, color:'#999999', marginTop:10}}>0</Text>
              <TouchableOpacity onPress={()=>this.showWithdraw()}>
                <Image source={require('../../images/me_deposit_line.png')} 
                      style={{width:300, height:34, marginTop:10}} resizeMode="contain"/>
              </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderContent(){
    if(this.state.userLoggedin){
      return (
        <ScrollView style={styles.mainContainer}>
          <View style={styles.backgroundContainer}/>
          <NavBar title="" imageOnRight={require('../../images/me_messages.png')} 
                  rightPartOnClick={()=>this.showMessage()}/>
          {this.renderPortrait()}
          {this.renderBalance()}
          {this.renderButton("帮助中心", require("../../images/me_icon_help.png"), ()=>this.showHelp())}
          {this.renderButton("关于我们", require("../../images/me_icon_about.png"), ()=>this.showAbout())}
          {this.renderExitButton()}
          <View style={{height:10}}></View>
        </ScrollView>);
    }else{
      return this.renderLogin();
    }
  }

  render() {
      return this.renderContent();
  }
}

const styles = StyleSheet.create({
    mainContainer:{
      flex:1,
      flexDirection:'column',
      backgroundColor:ColorConstants.WHITE
    },
    backgroundContainer: {
      position:'absolute',
      top:0,
      left:0,
      width: width,
      height: height*2/5,
      backgroundColor:ColorConstants.BGBLUE
    },
    icon: {
      width: 26,
      height: 26,
    },
    smallButtonContainer:{
      height: BUTTON_HEIGHT,
      paddingLeft:10,
      paddingRight:10,
    },
    bigButtonContainer:{
      height: BIG_BUTTON_HEIGHT,
      paddingLeft:10,
      paddingRight:10,
    },
    buttonBackground: {
      width: '100%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
    },
    buttonTextContainer: {
      alignItems:'center',
      flexDirection:'column',
    },
    buttonTextContainerLeft: {
      flexDirection:'row',
    },
    headPortrait:{
      width:80,
      height:80,
      borderRadius:40,
      alignSelf:'center'
    },
})

export default TabMeScreen;

