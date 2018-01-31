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
  TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var RankHeroList = require('./RankHeroList');
var {height, width} = Dimensions.get('window');
var RANKING_TYPE_0 = 0;
var RANKING_TYPE_1 = 1;
//Tab2:榜单
export default class  TabRankScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel:'榜单',
    tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('../../images/tab2_sel.png')}
            style={[styles.icon, {tintColor: tintColor}]}
          />
        ),
    tabBarOnPress: (scene,jumpToIndex) => {
                     console.log(scene)
                     jumpToIndex(scene.index)
            },
  }

  constructor(props){
    super(props);
    this.state = {
        contentLoaded: false,
        isRefreshing: true,
        rankType: RANKING_TYPE_0, 
       
    } 

  
  }

onPressedRankType(type){
  if(type==this.state.rankType)return;
  this.setState({
    rankType:this.state.rankType===RANKING_TYPE_0?RANKING_TYPE_1:RANKING_TYPE_0
  }) 
}

  renderRankTypeButton(){
    var isLeftSelected = this.state.rankType == RANKING_TYPE_0;
    var leftbg = isLeftSelected ? '#1b9beb':'#41bafc';
    var leftbd = isLeftSelected ? '#41bafc':'#41bafc';
    var rightbg = isLeftSelected ? '#41bafc':'#1b9beb';
    var rightbd = isLeftSelected ? '#41bafc':'#41bafc'
    var leftTextColor = isLeftSelected ? 'white':'#1b9beb';
    var rightTextColor = isLeftSelected ? '#1b9beb':'white';
    return(
        <View style={styles.headContainer}>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_0)}
            style={{flex:1,height:32, 
            alignItems:'center',
            justifyContent:'center',
            borderTopLeftRadius:16,
            borderBottomLeftRadius:16,
            backgroundColor:leftbg,
            borderColor:leftbd,
            borderWidth:1,
            }}>
            <Text style={{color:leftTextColor}}>达人</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>this.onPressedRankType(RANKING_TYPE_1)}
            style={{flex:1,height:32, 
            alignItems:'center',
            justifyContent:'center',
            marginLeft:-1,
            borderTopRightRadius:16,
            borderBottomRightRadius:16,
            backgroundColor:rightbg,
            borderColor:rightbd,
            borderWidth:1,}}>
            <Text style={{color:rightTextColor}}>关注</Text>
          </TouchableOpacity>
        </View> 
       
    ) 
  }

  renderRanks(){
    if(this.state.rankType == RANKING_TYPE_0){
      return(<RankHeroList navigation={this.props.navigation}>达人榜</RankHeroList>)
    }else if(this.state.rankType == RANKING_TYPE_1){
      return(
      <View style={{width:width,height:height-120,alignItems:'center', justifyContent:'center'}}>
         <Image style={{width:290,height:244,}}source={require('../../images/no_attention.png')}></Image>
      </View>
      )
    }
  }

  render() {
    return (
    <View style={styles.mainContainer}>
        {this.renderRankTypeButton()}
        {this.renderRanks()}
    </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.BGBLUE
    },
    icon: {
      width: 26,
      height: 26,
    },
    headContainer:{
      margin:10,
      height:32,
      width:128,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center', 
      flexDirection:'row', 
    }
})

module.exports = TabRankScreen;

