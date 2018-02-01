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
  Dimensions
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var NavBar = require('./component/NavBar')
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


  render() {
    return (
      <View style={styles.mainContainer}>
          <NavBar title={'盈利8888'} showBackButton={true} navigation={this.props.navigation}/>
          <Image style={{width:72,height:72,alignSelf:'center',marginTop:24}} source={require('../../images/head_portrait.png')}></Image>

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

