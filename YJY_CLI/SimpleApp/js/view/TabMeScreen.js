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
import BalanceBlock from './component/BalanceBlock';

import LogicData from "../LogicData";
import LoginScreen from './LoginScreen';

import { fetchMeData } from '../redux/actions'
import { connect } from 'react-redux';

var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule');
var ColorConstants = require('../ColorConstants');
var {EventCenter, EventConst} = require('../EventCenter')
var WebSocketModule = require('../module/WebSocketModule');
var LS = require('../LS');

var layoutSizeChangedSubscription = null;
//Tab4:我的
class  TabMeScreen extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
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
    this.props.fetchMeData();
  }

  onLogOutButtonPressed(){
    LogicData.logout(()=>{
      this.refresh();
    })
  }

  goToTokenDetail(){
    this.props.navigation.navigate(ViewKeys.SCREEN_TOKEN_DETAIL);
  }

  goToHelp(){
    this.props.navigation.navigate(ViewKeys.SCREEN_HELP);
  }

  goToAbout(){
    this.props.navigation.navigate(ViewKeys.SCREEN_ABOUT);
  }

  goToDeposit(){
    var meData = LogicData.getMeData()
    if(meData.thtAddress){
      this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT);
    }else{
       this.props.navigation.navigate(ViewKeys.SCREEN_BIND_PURSE);
    }
  }

  goToWithdraw(){
    this.props.navigation.navigate(ViewKeys.SCREEN_WITHDRAW);
  }

  goToMessage(){
    this.props.navigation.navigate(ViewKeys.SCREEN_MESSAGE);
  }

  renderLogin(){
    return <LoginScreen 
              hideBackButton={true} 
              onLoginFinished={()=>{this.refresh()}}
              />;
  }  

  renderExitButton(){
    return (
      <TouchableOpacity
        style={styles.okView}
        onPress={()=>this.onLogOutButtonPressed()}>
        <ImageBackground source={require("../../images/position_confirm_button_disabled.png")}
          resizeMode={'contain'}
          style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
          <Text style={styles.okButton}>{LS.str("LOG_OUT")}</Text>
      </ImageBackground>
    </TouchableOpacity>  
    );
  }

  renderButton(title, icon, onPress){
    return (
      <View>
        <TouchableOpacity style={styles.smallButtonContainer} onPress={()=>onPress()}>
          <View style={styles.rowContainer}>
            <View style={styles.rowLeftTextContainer}>
              <Image style={{marginLeft:10, height:30, width:30}} source={icon}></Image>
              <View style={{flexDirection:'column', justifyContent:'center', marginLeft: 10}}>
                <Text style={{fontSize:15, color:'#8c8d90'}}>{title}</Text>
              </View>
            </View>
           
            <Image source={require("../../images/icon_arrow_right.png")} 
                  style={styles.arrowIcon}/>
          </View>
        </TouchableOpacity>
        <View style={styles.separator}></View>
      </View>
      );
  }

  renderPortrait(){
    return(
      <View style={{justifyContent:'center'}}>

        <Image style={styles.headPortrait} source={this.props.avatarSource}></Image>
        <Text style={{textAlign:'center', marginTop:10, height:15, fontSize: 12, color: '#44c1fc'}}>{this.props.nickname}</Text>

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
          <View style={styles.topBlockContainer}>
              <Text style={{fontSize:12, color:'#999999'}}>{LS.str("SUGAR_AMOUNT")}</Text>
              <BalanceBlock style={{fontSize:34, color:'#999999', marginTop:10}}/>
              <View style={{flexDirection:'row', alignSelf:'stretch', justifyContent:'space-around'}}>
                <TouchableOpacity onPress={()=>this.goToDeposit()}>
                  <ImageBackground source={require('../../images/bg_btn_blue.png')}
                      resizeMode={'stretch'}
                      style={{
                          width: 80,
                          height: 44,
                          justifyContent:'center',
                          flexDirection:'column',
                      }}>
                    <Text style={{textAlign:'center', color:'#ffffff'}}>{LS.str("ME_DEPOSIT_TITLE")}</Text>
                  </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.goToWithdraw()}>
                  <ImageBackground source={require('../../images/bg_btn_blue.png')}
                    resizeMode={'stretch'}
                    style={{
                        width: 80,
                        height: 44,
                        justifyContent:'center',
                        flexDirection:'column',
                    }}>
                    <Text style={{textAlign:'center', color:'#ffffff'}}>{LS.str("ME_WITHDRAW_TITLE")}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
          </View>
        </ImageBackground>
      </View>
    )
  }

  renderContent(){
    if(this.props.userLoggedin){
      return (
        <ScrollView style={styles.mainContainer}>
          <View style={styles.backgroundContainer}/>
          <NavBar title="" imageOnRight={require('../../images/me_messages.png')} 
                  rightPartOnClick={()=>this.goToMessage()}/>
          {this.renderPortrait()}
          {this.renderBalance()}
          {this.renderButton(LS.str("ME_DETAIL_TITLE"), require("../../images/me_icon_withdraw_deposit_details.png"), ()=>this.goToTokenDetail())}          
          {this.renderButton(LS.str("ME_HELP_CENTER_TITLE"), require("../../images/me_icon_help.png"), ()=>this.goToHelp())}
          {this.renderButton(LS.str("ME_ABOUT_TITLE"), require("../../images/me_icon_about.png"), ()=>this.goToAbout())}
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
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'center',
    },
    separator: {
      height: 0.5,
      backgroundColor: '#f0f0f0',
      marginLeft:20,
      marginRight:20,
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
    topBlockContainer: {
      alignItems:'center',
      flexDirection:'column',
    },
    rowContainer: {
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      alignSelf:'stretch',
      flex:1,
    },
    rowLeftTextContainer:{
      flexDirection:'row',
    },
    headPortrait:{
      width:80,
      height:80,
      borderRadius:40,
      alignSelf:'center'
    },
    okView: {
      width: 332,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop:15,
    },
    okButton: {
      color: 'white',
      textAlign: 'center',
      fontSize: 17,
      position:'absolute',
      top:17
    },
    arrowIcon:{
      height:15,
      width:15,
      marginRight:20,
      alignSelf:'center',
    },
})

const mapStateToProps = state => {
  return {
      ...state.meData,
  };
};

const mapDispatchToProps = {
  fetchMeData
};

export default connect(mapStateToProps, mapDispatchToProps)(TabMeScreen);

