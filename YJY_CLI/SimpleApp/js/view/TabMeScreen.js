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
import SubmitButton from './component/SubmitButton';

var ProfitStatisticsBlock = require('./component/personalPages/ProfitStatisticsBlock')
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
    // LogicData.logout(()=>{
    //   this.refresh();
    // })
  }

  goToUserConfig(){
    this.props.navigation.navigate(ViewKeys.SCREEN_USER_CONFIG);
  }

  goToHelp(){
    this.props.navigation.navigate(ViewKeys.SCREEN_HELP);
  }

  goToAbout(){
    this.props.navigation.navigate(ViewKeys.SCREEN_ABOUT);
  }

  goToMessage(){
    this.props.navigation.navigate(ViewKeys.SCREEN_MESSAGE);
  }

  goToSettings(){
    this.props.navigation.navigate(ViewKeys.SCREEN_SETTINGS);
  }

  onBalancePressed(){
    this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT_WITHDRAW);
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
        {this.renderSeparator()}
      </View>
      );
  }

  renderSeparator(){
    return <View style={styles.separator}></View>
  }

  renderPortrait(){
    return(
      <TouchableOpacity style={{justifyContent:'center'}}
        onPress={()=>this.goToUserConfig()}>
        <View>
          <Image style={styles.headPortrait} source={this.props.avatarSource}></Image>
          <Text style={{textAlign:'center', marginTop:10, height:15, fontSize: 12, color: '#44c1fc'}}>{this.props.nickname}</Text>
        </View>
      </TouchableOpacity>
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
            <View style={styles.balanceRow}>
              <View style={styles.balanceBlock}>
                <BalanceBlock style={styles.balanceValueText}/>
                <Text style={styles.balanceLabelText}>{LS.str("SUGAR_PROFIT")}</Text>
              </View>
              <View style={styles.balanceBlock}>
                <Text style={styles.balanceValueText}>{this.props.total.toFixed(2)}</Text>
                <Text style={styles.balanceLabelText}>{LS.str("SUGAR_AMOUNT")}</Text>
              </View>
              <View style={styles.balanceBlock}>
                <BalanceBlock style={styles.balanceValueText}/>
                <Text style={styles.balanceLabelText}>{LS.str("SUGAR_AVAILABLE")}</Text>
              </View>
            </View>     
            {this.renderSeparator()}        
            <View style={{flex:1, justifyContent:'center'}}>
              <SubmitButton
                style={{height:43, width:235}}
                text={LS.str("ME_DEPOSIT_WITHDRAW")} 
                onPress={()=>this.onBalancePressed()}/>
            </View>
          </View>
        </ImageBackground>
        <View>

        {/* <ProfitStatisticsBlock/> */}
        </View>
      </View>
    )
  }

  renderContent(){
    if(this.props.userLoggedin){
      return (
        <ScrollView style={styles.mainContainer}>         
          <View style={styles.backgroundContainer}>
            <Image
              style={styles.backgroundImage}
              source={require("../../images/me_top_background.jpg")}
              resizeMode={'contain'}/>
          </View>
          <NavBar 
            backgroundColor="transparent"
            title=""
            imageOnLeft={require('../../images/me_messages.png')}
            leftPartOnClick={()=>this.goToMessage()}
            imageOnRight={require('../../images/me_settings.png')}
            rightPartOnClick={()=>this.goToSettings()}/>
          
          {this.renderPortrait()}
          {this.renderBalance()}
          {/* {this.renderButton(LS.str("ME_DETAIL_TITLE"), require("../../images/me_icon_withdraw_deposit_details.png"), ()=>this.goToTokenDetail())}*/}
          {this.renderButton(LS.str("SETTINGS_CENTER_TITLE"), require("../../images/me_icon_help.png"), ()=>this.goToHelp())}
          {this.renderButton(LS.str("SETTINGS_ABOUT_TITLE"), require("../../images/me_icon_about.png"), ()=>this.goToAbout())}
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
      backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE
    },
    backgroundContainer: {
      position:'absolute',
      top:0,
      left:0,
    },
    backgroundImage:{
      width: width,
      height: width / 750 * 438,
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
      alignItems:'stretch',
      flexDirection:'column',
      flex:1,
      paddingBottom:20
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
    balanceRow:{
      flexDirection:'row',
      flex:1,
      marginLeft: 10,
      marginRight: 10,
    },
    balanceBlock:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      flex:1,
    },
    balanceValueText:{
      fontSize:20, 
      color:'black', 
      marginTop:10
    },
    balanceLabelText:{
      fontSize:12, 
      color:'#999999', 
    },
})

const mapStateToProps = state => {
  return {
      ...state.meData,
      ...state.balance
  };
};

const mapDispatchToProps = {
  fetchMeData
};

export default connect(mapStateToProps, mapDispatchToProps)(TabMeScreen);

