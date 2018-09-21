import React, { Component } from 'react';
import {
  AppRegistry,
  StatusBar,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  InteractionManager
} from 'react-native';

import NavBar from './component/NavBar';
var ColorConstants = require('../ColorConstants');
var ScrollTabView = require('./component/ScrollTabView')
var MyPositionTabHold = require('./MyPositionTabHold')  
var MyPositionTabClosed = require('./MyPositionTabClosed')
//import TraingleShapeTabBarItem from './component/TriangleShapeTabBarItem';

var {height,width} = Dimensions.get('window');
var LS = require('../LS')
import LoginScreen from './LoginScreen';
import LogicData from "../LogicData";
var {EventCenter, EventConst} = require('../EventCenter');

var layoutSizeChangedSubscription = null;
//Tab3:仓位
class TabPositionScreen extends Component {
  constructor(props){
    super(props)

    this.state = {
      userLoggedin: false,
      currentSelectedTab: 0,
    }
  }

  componentDidMount() {
    layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.POSITON_TAB_PRESS_EVENT, () => {
      console.log("POSITON_TAB_PRESS_EVENT")
      this.refresh();
    });
  }

  componentWillUnmount(){
    layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove()
  }

  refresh(){
    if(!LogicData.isLoggedIn()){
      //StatusBar.setBarStyle("light-content");
      this.setState({
        userLoggedin: false,
      })
    }else{
      //StatusBar.setBarStyle("dark-content");
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
              navigation={this.props.navigation}
              />;
  }

  renderContent(){ 
    if(this.state.userLoggedin){
      var tabPages = [ 
        <MyPositionTabHold navigation={this.props.navigation} ref={'page0'}/>,
        <MyPositionTabClosed navigation={this.props.navigation} ref={'page1'}/>,
      ]
  
      var tabNameShow = [
        LS.str('OPEN'),
        LS.str('CLOSED'),
        //LS.str('STATISTICS')
      ]
  
      var viewPages = tabNameShow.map(
        (tabNameShow, i) =>
        <View style={{width:width}} key={i}>
          {tabPages[i]}
        </View>
      )

      // 
  
      return ( 
        <View style={styles.mainContainer}>
 
          <NavBar onlyShowStatusBar={true} backgroundColor={ColorConstants.COLOR_MAIN_THEME_BLUE}/>
          <View style={{flex: 1, marginTop:-5,backgroundColor:'transparent'}}> 
            <ScrollTabView 
              ref={"tabPages"} 
              tabNames={tabNameShow} 
              tabBgStyle={1}
              tabFontSize={17}
              // renderTabView={(tabName, isSelected)=><TraingleShapeTabBarItem 
              //   isSelected={isSelected}
              //   tabName={tabName}
              //   triangleColor={"white"} 
              //   bottomLineColor={"transparent"}
              // />}
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
        backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE
    },
    icon: {
      width: 26,
      height: 26,
    },
})

export default TabPositionScreen;

