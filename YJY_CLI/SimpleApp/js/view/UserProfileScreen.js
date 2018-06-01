import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation"; 
import NavBar from "./component/NavBar"
import LogicData from '../LogicData';

var ScrollTabView = require('./component/ScrollTabView')
var UserProfileTabMain = require('./UserProfileTabMain')
var UserProfileTabDynamicState = require('./UserProfileTabDynamicState')
var UserProfileTabPositionHold = require('./UserProfileTabPositionHold')
var UserProfileTabPositionClosed = require('./UserProfileTabPositionClosed')
var ColorConstants = require('../ColorConstants');
var {height,width} = Dimensions.get('window') 
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var LS = require('../LS')
 

export default class  UserProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'UserProfileScreen',
  }

  constructor(props) {
    super(props); 
    staticData = this.props.navigation.state.params.userData; 
    this.state = {
      followTrade: null,
      isFollowing:false,
      picUrl:'',
      nickName:this.props.navigation.state.params.userData.nickName,
      userId:this.props.navigation.state.params.userData.userId,
      followTraderCount:'0',
      followerCount:'0',
    };  

  }

  onPageSelected(index) {
		this.setState({
      currentSelectedTab: index, 
		}) 
		if (this.refs['page' + index]) {
			this.refs['page' + index].tabPressed(index);
		}
  }
  
  componentDidMount(){ 
    this.loadUserInfo();
  }

  loadUserInfo(){ 
    var api = NetConstants.CFD_API.USER_INFO.replace('<id>',this.state.userId);
    // Alert.alert('api:'+api)
    if(LogicData.isLoggedIn()){
      var userData = LogicData.getUserData();
      this.setState({
          isDataLoading: true,
      }, ()=>{
          NetworkModule.fetchTHUrl(
              api,
              {
                  method: 'GET',
                  headers: {
                      'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                      'Content-Type': 'application/json; charset=utf-8',
                  },
                  showLoading: true,
              }, (responseJson) => {
                console.log("loadUserInfo responseJson.followTrade,", responseJson.followTrade)
                  this.setState({
                    isFollowing: responseJson.isFollowing,
                    followTrade: responseJson.followTrade,
                    picUrl:responseJson.picUrl, 
                    followerCount:responseJson.followerCount,
                    followTraderCount:responseJson.followTraderCount
                  });  
              },
              (exception) => {
                  alert(exception.errorMessage)
              }
          );
      })			
  }
}  

  
  renderContent(){ 
        var tabPages = [
          <UserProfileTabMain navigation={this.props.navigation} ref={'page0'} userId={staticData.userId} 
            followTrade={this.state.followTrade}/>,
          <UserProfileTabDynamicState navigation={this.props.navigation} ref={'page1'}  userId={staticData.userId}/>,
          <UserProfileTabPositionHold navigation={this.props.navigation} ref={'page2'}  userId={staticData.userId}/>,
          <UserProfileTabPositionClosed navigation={this.props.navigation} ref={'page3'}  userId={staticData.userId}/>,
        ]
    
        var tabNameShow = [LS.str("MAIN"),LS.str("DYNAMIC"),LS.str("OPEN"),LS.str("CLOSED")]
    
        var viewPages = tabNameShow.map(
          (tabNameShow, i) =>
          <View style={{width:width}} key={i}>
            {tabPages[i]}
          </View>
        ) 
    
        return ( 
          <View style={{flex: 1, marginTop:24,backgroundColor:'transparent'}}>
            <ScrollTabView 
              ref={"tabPages"} 
              tabNames={tabNameShow} 
              viewPages={viewPages} 
              tabBgStyle={0}
              removeClippedSubviews={true}
              onPageSelected={(index) => this.onPageSelected(index)}
              />
          </View>
        )
  }

  rightCustomContent(){
 
    var following = this.state.isFollowing?require('../../images/watched_no.png'):require('../../images/watched_yes.png');
    var widthBtn = this.state.isFollowing?80:80;
    if(LogicData.isUserSelf(this.state.userId)){
      return (null)
    } 
    //
    return(
      <TouchableOpacity style={{marginRight:10}}  onPress={()=>this.followUser()}>
        <Image style={{width:22,height:22}} source={following}></Image>
      </TouchableOpacity>
      ) 
  }

  followUser(){

    var api = NetConstants.CFD_API.USER_FOLLOW.replace('<id>',staticData.userId);
    if(this.state.isFollowing){
      api = NetConstants.CFD_API.USER_DEL_FOLLOW.replace('<id>',staticData.userId);
    } 
    
    if(LogicData.isLoggedIn()){
      var userData = LogicData.getUserData();

      if(this.state.isFollowing){
          this.setState({
            isDataLoading: true,
            }, ()=>{
            NetworkModule.fetchTHUrl(
                api,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    showLoading: true,
                }, (responseJson) => {  
                    this.setState({
                        isFollowing:false
                    });  
                },
                (exception) => {
                    // alert(exception.errorMessage)
                }
            );
        })		
      }else{
          this.setState({
            isDataLoading: true,
           }, ()=>{
            NetworkModule.fetchTHUrl(
                api,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    showLoading: true,
                }, (responseJson) => { 
                    
                    this.setState({
                      isFollowing:true,
                        
                    });  
                },
                (exception) => {
                    // alert(exception.errorMessage)
                }
            );
        })		
      } 
    }
  }

  render() {

    var picSource = require('../../images/head_portrait.png')
    if(this.state.picUrl.length > 0){
      picSource = {uri:this.state.picUrl}
    }
    return (
      <View style={styles.mainContainer}>
          <NavBar title={this.state.nickName} rightCustomContent={this.rightCustomContent.bind(this)} showBackButton={true} navigation={this.props.navigation}/>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.textNum}>{this.state.followerCount}</Text>
                <Text style={styles.textName}>{LS.str('WATCHS')}</Text>
              </View>
            <Image style={{width:80,height:80,alignSelf:'center',marginTop:20,borderRadius:40}} source={picSource}></Image>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.textNum}>{this.state.followTraderCount}</Text>
                <Text style={styles.textName}>{LS.str('COPYS')}</Text>
              </View>
          </View>  
          {this.renderContent()}
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  mainContainer:{
      flex:1,
      backgroundColor:ColorConstants.BGBLUE
  },
  textNum:{
    fontSize:32,
    color:'white'
  },
  textName:{
    fontSize:12,
    color:'#eeeeee'
  }
})

module.exports = UserProfileScreen;

