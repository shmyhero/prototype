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
var bgWidth = width-20; 
import { ViewKeys } from '../../AppNavigatorConfiguration';
import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import NavBar from './component/NavBar';
import BalanceBlock from './component/BalanceBlock';

var ProfitTrendCharts = require('./component/personalPages/ProfitTrendCharts')
var TradeStyleBlock = require('./component/personalPages/TradeStyleBlock')
var TradeStyleCircleBlock = require('./component/personalPages/TradeStyleCircleBlock')
import LogicData from "../LogicData";
import LoginScreen from './LoginScreen';

import { fetchMeData, updateUnread } from '../redux/actions'
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

  userChanged = false

  refresh(){
    console.log("Mepage refresh")
    this.props.fetchMeData();
    this.props.updateUnread();
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

  renderSeparator(){
    return <View style={styles.separator}></View>
  }

  renderPortrait(){
    return(
      <TouchableOpacity style={{justifyContent:'center'}}
        onPress={()=>this.goToUserConfig()}>
        <View>
          <Image style={styles.headPortrait} source={this.props.avatarSource}></Image>
          <Text style={styles.nickName}>{this.props.nickname}</Text>
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

  renderChart(){
    return (
      <View style={styles.TradeStyleCycleContainer}> 
        <ImageBackground style={{height:"100%", width:"100%", justifyContent:'center'}}
          resizeMode='stretch' source={require('../../images/bg_block.png')}>
            <ProfitTrendCharts 
              ref={(ref)=>this.tradeStyleCicleBlock = ref}
              userId={this.props.userId}
              viewHeight={180}
              isPrivate={false}/>          
        </ImageBackground> 
      </View>
    );
  }

  renderTradeStyleCicleBlock(){
    return (
      <View style={styles.TradeStyleCycleContainer}> 
        <ImageBackground style={{height:"100%", width:"100%", justifyContent:'center'}}
          resizeMode='stretch' source={require('../../images/bg_block.png')}>
           
            <TradeStyleCircleBlock 
              ref={(ref)=>this.tradeStyleCicleBlock = ref}
              userId={this.props.userId}
              viewHeight={180}
              isPrivate={false}/>
           
        </ImageBackground> 
      </View>
    );
  }

  renderTradeStyleBlock(){
    console.log("this.props.userId", this.props.userId )
    return (
      <View style={styles.TradeStyleContainer}>
        <ImageBackground style={{height:"100%", width:"100%", justifyContent:'center'}} resizeMode='stretch' source={require('../../images/bg_block.png')}> 
          <TradeStyleBlock
            ref={(ref)=>this.tradeStyleBlock = ref}
            userId={this.props.userId}
            isPrivate={false} />
        </ImageBackground>
      </View>
    );
  }

  renderMessageView(){
    var view = null;
    if(this.props.unread > 0){
      var unreadCount = this.props.unread > 9 ? "9+" : this.props.unread;
      view = (<View style={styles.unreadMessageCount}>
        <Text style={{textAlign:'center', fontSize:8, color:'white'}}>{unreadCount}</Text>
      </View>);
    }
    return (
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <Image style={styles.messageImage} source={require('../../images/me_messages.png')}/>
        {view}
    </View>);
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
            viewOnLeft={this.renderMessageView()}
            leftPartOnClick={()=>this.goToMessage()}
            imageOnRight={require('../../images/me_settings.png')}
            rightPartOnClick={()=>this.goToSettings()}/>
          
          {this.renderPortrait()}
          {this.renderBalance()}
          {this.renderChart()}
          {this.renderTradeStyleCicleBlock()}
          {this.renderTradeStyleBlock()}
          
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
      marginLeft:10,
      marginRight:10,
    },
    TradeStyleCycleContainer:{
      height:280,
      marginLeft:15,
      marginRight:15,
      justifyContent:'center',
      alignContent:'center',
      //backgroundColor:'white'
    },
    TradeStyleContainer:{
      height:180,
      marginTop:10,
      marginBottom:10,
      marginLeft:15,
      marginRight:15,
      justifyContent:'center',
      alignContent:'center',
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
      width:101,
      height:101,
      borderWidth:3,
      borderColor:ColorConstants.BORDER_LIGHT_BLUE,
      borderRadius:50,
      alignSelf:'center'
    },
    nickName: {
      textAlign:'center',
      marginTop:10,
      height:30, 
      fontSize: 19,
      color: ColorConstants.BORDER_LIGHT_BLUE
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
    messageImage: {
      width: 21,
      height: 21,
      marginLeft: 20,
      resizeMode: Image.resizeMode.contain,
      marginRight: 8
    },
    unreadMessageCount: {
      backgroundColor:'red', 
      width:18,
      height:12, 
      borderRadius:5,
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
      top:-5,
      right:0
    }
})

const mapStateToProps = state => {
  return {
      ...state.meData,
      ...state.balance,
      ...state.settings,
      ...state.message
  };
};

const mapDispatchToProps = {
  fetchMeData,
  updateUnread
};

export default connect(mapStateToProps, mapDispatchToProps)(TabMeScreen);

