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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var ScrollTabView = require('./component/ScrollTabView')
var MyPositionTabHold = require('./MyPositionTabHold')  
var MyPositionTabClosed = require('./MyPositionTabClosed')  
var MyPositionTabStatistics = require('./MyPositionTabStatistics')  
var {height,width} = Dimensions.get('window')

//Tab3:仓位
export default class  TabPositionScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel:'仓位',
    tabBarIcon: ({ focused,tintColor }) => (
          <Image
          source={focused?require('../../images/tab3_sel.png'):require('../../images/tab3_unsel.png')}
            style={[styles.icon ]}
          />
        ),
    tabBarOnPress: (scene,jumpToIndex) => {
                         console.log(scene)
                         jumpToIndex(scene.index)
                },
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
          <MyPositionTabHold navigation={this.props.navigation} ref={'page0'}/>,
          <MyPositionTabClosed navigation={this.props.navigation} ref={'page1'}/>,
          <MyPositionTabStatistics navigation={this.props.navigation} ref={'page2'}/>,
        ]
    
        var tabNameShow = ['持仓','平仓','统计']
    
        var viewPages = tabNameShow.map(
          (tabNameShow, i) =>
          <View style={{width:width}} key={i}>
            {tabPages[i]}
          </View>
        )

        // 
    
        return ( 
          <View style={{flex: 1, marginTop:0,backgroundColor:'transparent'}}>
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
       {this.renderContent()}
    </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.WHITE
    },
    icon: {
      width: 26,
      height: 26,
    },
})

module.exports = TabPositionScreen;

