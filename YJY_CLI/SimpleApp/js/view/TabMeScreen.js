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
} from 'react-native';

var {height,width} = Dimensions.get('window');
var BUTTON_WIDTH = width - 20;
var BUTTON_HEIGHT = BUTTON_WIDTH / 701 * 132;
var BIG_BUTTON_HEIGHT = BUTTON_WIDTH / 722 * 380;

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';

var LogicData = require('../LogicData');
var LoginScreen = require('./LoginScreen')
var ColorConstants = require('../ColorConstants');
var {EventCenter, EventConst} = require('../EventCenter')

var layoutSizeChangedSubscription = null;
//Tab4:我的
export default class  TabMeScreen extends React.Component {
  static navigationOptions = (navigation) => ({
    tabBarOnPress: (scene, jumpToIndex) => {
      jumpToIndex(scene.index);
      EventCenter.emitMeTabPressEvent();
    },
    tabBarLabel:'我的',
    tabBarIcon: ({ focused,tintColor }) => (
      <Image
      source={focused?require('../../images/tab4_sel.png'):require('../../images/tab4_unsel.png')}
        style={[styles.icon]}
      />     
  )});

  constructor(props){
    super(props)

    this.state = {
      userLoggedin: false,
    }
  }

  componentWillMount() {
    layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ME_TAB_PRESS_EVENT, () => {
      console.log("ME_TAB_PRESS_EVENT")
			this.refresh();
		});
  } 

  componentWillUnmount(){
    layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove()
  }

  refresh(){
    if(!LogicData.isLoggedIn()){
      this.setState({
        userLoggedin: false,
      })
    }else{
      //TODO: the refresh jobs
      this.setState({
        userLoggedin: true,
      }, ()=>{
       
      });
    }
  }

  // showLogin(){
  //   this.props.navigation.navigate('MeLoginScreen',{      
  //     hideBackButton: true,
  //     onLoginFinished: ()=>{
  //       this.props.navigation.goBack(null);
  //     }
  //   });
  // }

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

  renderButton(title, icon){
    return (
      <TouchableOpacity style={styles.smallButtonContainer}>
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
    return(
      <View style={{justifyContent:'center'}}>
        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
        <Text style={{textAlign:'center', marginTop:10, fontSize: 12, color: '#44c1fc'}}>一位不知姓名的用户</Text>
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
              <TouchableOpacity >
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
      return (<View style={styles.mainContainer}>
        <View style={styles.backgroundContainer}/>
        <NavBar title="" imageOnRight={require('../../images/me_messages.png')}/>
        {this.renderPortrait()}
        {this.renderBalance()}
        {this.renderButton("帮助中心", require("../../images/me_icon_help.png"))}
        {this.renderButton("关于我们", require("../../images/me_icon_about.png"))}
        {this.renderExitButton()}
      </View>);
    }else{
      return this.renderLogin();
    }
  }

  render() {
      return this.renderContent();
  }
}


// const TAB_ME = "TabMe";
// const LOGIN_PAGE = "MeLoginScreen";

// const routeConfigMap = {}
// routeConfigMap[TAB_ME] = { screen: TabMeScreenView }
// routeConfigMap[LOGIN_PAGE] = { screen: LoginScreen }

// const TabMeScreen = StackNavigator(routeConfigMap,
//   {
//     navigationOptions: (navigation) => ({
//       tabBarOnPress: (scene, jumpToIndex) => {
//         jumpToIndex(scene.index);
//         if(navigation.navigation.state.routeName == TAB_ME){
//           EventCenter.emitMeTabPressEvent();
//         }else if(navigation.navigation.state.routeName == LOGIN_PAGE){
//           if(LogicData.isLoggedIn()){
//             navigation.navigation.goBack(null);
//           }
//         }
//       },
//       tabBarLabel:'我的',
//       tabBarIcon: ({ focused,tintColor }) => (
//         <Image
//         source={focused?require('../../images/tab4_sel.png'):require('../../images/tab4_unsel.png')}
//           style={[styles.icon]}
//         />     
//     )})
// });

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
      alignSelf:'center'
    },
})

module.exports = TabMeScreen;

