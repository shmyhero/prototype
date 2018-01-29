import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";

var ColorConstants = require('../ColorConstants');
var UIConstants = require('../UIConstants');
var MyPie = require('./component/MyPie');
var BannerIntro = require('./component/BannerIntro');
var DynamicList = require('./component/DynamicList');
var ShareCard = require('./component/ShareCard');

var {height, width} = Dimensions.get('window');

export default class  TabMainScreen extends React.Component {


  static navigationOptions = {
    tabBarLabel:'首页',
    tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('../../images/tab0_sel.png')}
            style={[styles.icon, {tintColor: tintColor}]}
          />
        ),
    tabBarOnPress: (scene,jumpToIndex) => {
                         console.log(scene)
                         jumpToIndex(scene.index)
                },
  }


    constructor(props){
        super()
        this.state = {
            topStepStyle : 0,//0,1顶部的显示是收缩还是全屏
        }
    }
 

  render() {
    return (
        <ScrollView>
            {this.renderStep1()}
            {this.renderStep2()}
            {this.renderStep3()}
            {this.renderStep4()}
        </ScrollView>

    );
  }


    bannerOneCliced(){
        Alert.alert("BannerOne Cliced!");
    }

    bannerTwoCliced(){
        Alert.alert("BannerTwo Cliced!");
    }

    renderStep1(){
      var topStepHeight = this.state.topStepStyle==0?181:height-UIConstants.TAB_BAR_HEIGHT*2;

      return(
          <View style={{height:topStepHeight,backgroundColor:'black'}}>
                <TouchableOpacity onPress={()=>{this.setState({topStepStyle:this.state.topStepStyle==0?1:0})}}>
                    <Text style={{color:'white'}}>今天</Text>
                </TouchableOpacity>
                <DynamicList style={{flex:1}}/>
          </View>
      )
    }
    renderStep2(){
        if(this.state.topStepStyle == 1){
            return null
        }

        return(
        <View style={{flexDirection:'row',height:132,justifyContent: 'space-around',backgroundColor:'black',alignItems:'center'}}>
            <View style={{width:(width-30)/2,height:96,marginLeft:5}}>
                <BannerIntro title='大盘连连猜|美国科技股大盘明日走势'
                    category='NEW TOPIC'
                    buttonText='参与竞猜'
                    buttonClicked={()=>{this.bannerOneCliced();}}/>
            </View>
            <View style={{width:(width-30)/2,height:96,marginRight:5}}>
                <BannerIntro title='微信讨论-比特币后续是否继续走高'
                    category='TALKING'
                    buttonText='入微信群'
                    buttonClicked={()=>{this.bannerTwoCliced();}}/>
            </View>
        </View>
        )
    }
    renderStep3(){
        if(this.state.topStepStyle == 1){
                    return null
        }

        var pieData = [
            {radius:40,series:[12,23],innerText:'黄金'},
            {radius:40,series:[5,23],innerText:'美元／欧元'},
            {radius:40,series:[8,23],innerText:'纳斯达克'},
            {radius:40,series:[42,23],innerText:'美元／日元'},
            {radius:40,series:[32,23],innerText:'比特币／美元'},
        ]

        var pieItems = pieData.map(
            (pie,i)=>
            <View style={styles.pieStyle} key={i}>
                <MyPie
                radius={pie.radius}
                series={pie.series}
                innerText={pie.innerText}
                colors={[ColorConstants.RED, ColorConstants.GREEN]} />
            </View>
        )

        return(
          <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{height:100,backgroundColor:'black'}}>
            {pieItems}
          </ScrollView>
        )
    }
    renderStep4(){
        if(this.state.topStepStyle == 1){
                    return null
        }

        var cardData = [
                    {cardWidth:90,cardHeight:120,cardId:1},
                    {cardWidth:90,cardHeight:120,cardId:2},
                    {cardWidth:90,cardHeight:120,cardId:3},
                    {cardWidth:90,cardHeight:120,cardId:4},
                    {cardWidth:90,cardHeight:120,cardId:5}
                ]

        var cardItems = cardData.map(
                    (cardData,i)=>
                    <View key={i}>
                        <ShareCard
                        cardWidth={cardData.cardWidth}
                        cardHeight={cardData.cardHeight}
                        cardId={cardData.cardId}/>
                    </View>
                )

        return(
            <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{height:128,flex:1,backgroundColor:'black',}}>
                    {cardItems}
            </ScrollView>
        )
    }

  jump2Detail(){
//    Alert.alert("jump2Detail")
    this.props.navigation.navigate('StockDetail', { user: 'Lucy' })
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
    title: {
        fontSize: 24,
        margin: 10
    },
    pieStyle:{
        marginTop:10,
        marginBottom:10,
        marginLeft:5,
        marginRight:5,
    }

})


module.exports = TabMainScreen;

