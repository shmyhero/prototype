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
var ScrollTabView = require('./component/ScrollTabView')
var UserProfileTabMain = require('./UserProfileTabMain')
var UserProfileTabDynamicState = require('./UserProfileTabDynamicState')
var UserProfileTabPositionHold = require('./UserProfileTabPositionHold')
var UserProfileTabPositionClosed = require('./UserProfileTabPositionClosed')
var ColorConstants = require('../ColorConstants');
var {height,width} = Dimensions.get('window')


export default class  UserProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'UserProfileScreen',
  }

  onPageSelected(index) {
		this.setState({
			currentSelectedTab: index,
		}) 
		// if (this.refs['page' + index]) {
		// 	this.refs['page' + index].tabPressed()
		// } 
	}
  
  renderContent(){ 
 
        var tabPages = [
          <UserProfileTabMain navigation={this.props.navigation} ref={'page0'}/>,
          <UserProfileTabDynamicState navigation={this.props.navigation} ref={'page1'}/>,
          <UserProfileTabPositionHold navigation={this.props.navigation} ref={'page2'}/>,
          <UserProfileTabPositionClosed navigation={this.props.navigation} ref={'page3'}/>,
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
    var text = '+关注' 
    // text = '取消关注'
    return(
      <TouchableOpacity>
      <Text style={{backgroundColor:'#43b9f9', textAlign:'center', fontSize:12,width:72, color:'white',borderWidth:1,paddingLeft:10,paddingRight:10,paddingTop:2,paddingBottom:2,marginRight:10,borderColor:'#c2e5f9'}}>{text}</Text>
      </TouchableOpacity>
      )
    
    return(null)
  }

  render() {
    return (
      <View style={styles.mainContainer}>
          <NavBar title={'盈利8888'} rightCustomContent={this.rightCustomContent} showBackButton={true} navigation={this.props.navigation}/>
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

