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
  InteractionManager
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';
var ColorConstants = require('../ColorConstants');
var ScrollTabView = require('./component/ScrollTabView')
var MyPositionTabHold = require('./MyPositionTabHold')  
var MyPositionTabClosed = require('./MyPositionTabClosed')  
var MyPositionTabStatistics = require('./MyPositionTabStatistics')  
var {height,width} = Dimensions.get('window')

import LoginScreen from './LoginScreen';
import LogicData from "../LogicData";
var {EventCenter, EventConst} = require('../EventCenter');

var layoutSizeChangedSubscription = null;
//Tab3:仓位
class  TabPositionScreen extends Component {

  static navigationOptions = (navigation) => ({
    tabBarOnPress: (scene, jumpToIndex) => {
      jumpToIndex(scene.index);
      EventCenter.emitPositionTabPressEvent();
    },
    tabBarLabel:'仓位',
    tabBarIcon: ({ focused,tintColor }) => (
      <Image
        source={focused?require('../../images/tab3_sel.png'):require('../../images/tab3_unsel.png')}
        style={[styles.icon ]}
      />
    )
  })

  constructor(props){
    super(props)

    this.state = {
      userLoggedin: false,
      currentSelectedTab: 0,
    }
  }

  componentWillMount() {
    layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.POSITON_TAB_PRESS_EVENT, () => {
      console.log("POSITON_TAB_PRESS_EVENT")
      this.refresh();
    });
    
    this.refresh();
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
        this.updateSubPage();
      });
    }
  }

  onPageSelected(index) {
		this.setState({
			currentSelectedTab: index,
		}, ()=>{
      this.updateSubPage();
    })
  }
  
  updateSubPage(){
    if(this.refs["page"+this.state.currentSelectedTab] && this.refs["page"+this.state.currentSelectedTab].refresh){
      this.refs["page"+this.state.currentSelectedTab].refresh();
    }
  }
  
  renderLogin(){
    return <LoginScreen 
              hideBackButton={true}
              onLoginFinished={()=>{this.refresh()}}
              />;
  }

  renderContent(){ 
    if(this.state.userLoggedin){
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
        <View style={styles.mainContainer}>
          <NavBar onlyShowStatusBar={true}/>
          <View style={{flex: 1, marginTop:0,backgroundColor:'transparent'}}>
            <ScrollTabView 
              ref={"tabPages"} 
              tabNames={tabNameShow} 
              viewPages={viewPages} 
              removeClippedSubviews={true}
              onPageSelected={(index) => this.onPageSelected(index)}
              />
          </View>
        </View>
      )
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
        backgroundColor:ColorConstants.WHITE
    },
    icon: {
      width: 26,
      height: 26,
    },
})

export default TabPositionScreen;

