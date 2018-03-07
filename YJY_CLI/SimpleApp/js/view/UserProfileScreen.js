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

 

export default class  UserProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'UserProfileScreen',

  }

  constructor(props) {
    super(props); 
    staticData = this.props.navigation.state.params.userData; 
    this.state = {
      isFollowing:false,
      nickName:this.props.navigation.state.params.userData.nickName,
      userId:this.props.navigation.state.params.userData.userId,
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
                   
                  this.setState({
                    isFollowing: responseJson.isFollowing,
                      
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
          <UserProfileTabMain navigation={this.props.navigation} ref={'page0'} userId={staticData.userId}/>,
          <UserProfileTabDynamicState navigation={this.props.navigation} ref={'page1'}  userId={staticData.userId}/>,
          <UserProfileTabPositionHold navigation={this.props.navigation} ref={'page2'}  userId={staticData.userId}/>,
          <UserProfileTabPositionClosed navigation={this.props.navigation} ref={'page3'}  userId={staticData.userId}/>,
        ]
    
        var tabNameShow = ['首页','动态','持仓','平仓']
    
        var viewPages = tabNameShow.map(
          (tabNameShow, i) =>
          <View style={{width:width}} key={i}>
            {tabPages[i]}
          </View>
        )

        // 
    
        return ( 
          <View style={{flex: 1, marginTop:24,backgroundColor:'transparent'}}>
            <ScrollTabView 
              ref={"tabPages"} 
              tabNames={tabNameShow} 
              viewPages={viewPages} 
              removeClippedSubviews={true}
              onPageSelected={(index) => this.onPageSelected(index)}
              />
          </View>
        )
  }

  rightCustomContent(){
 
    var text = this.state.isFollowing?'取消关注':'+关注';
    var widthBtn = this.state.isFollowing?72:58;
    if(LogicData.isUserSelf(this.state.userId)){
      return (null)
    } 

    return(
      <TouchableOpacity onPress={()=>this.followUser()}>
       <Text style={{borderRadius:12,backgroundColor:'#43b9f9', textAlign:'center', fontSize:12,width:widthBtn, color:'white',borderWidth:1,paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,marginRight:10,borderColor:'#c2e5f9'}}>{text}</Text>
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
    return (
      <View style={styles.mainContainer}>
          <NavBar title={this.state.nickName} rightCustomContent={this.rightCustomContent.bind(this)} showBackButton={true} navigation={this.props.navigation}/>
          <Image style={{width:80,height:80,alignSelf:'center',marginTop:20}} source={require('../../images/head_portrait.png')}></Image>

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
})

module.exports = UserProfileScreen;

