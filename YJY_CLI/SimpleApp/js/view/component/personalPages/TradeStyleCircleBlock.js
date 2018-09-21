'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import CustomStyleText from '../CustomStyleText';
var LS = require('../../../LS')
var ColorConstants = require('../../../ColorConstants');  
var NetworkModule = require('../../../module/NetworkModule');
var NetConstants = require('../../../NetConstants');
var MyPie = require('../../component/Pie/MyPie')
var {height, width} = Dimensions.get('window')
import LogicData from '../../../LogicData';
export default class TradeStyleCircleBlock extends Component {
  static propTypes = {
    
  }

  static defaultProps = {
   
  }

  constructor(props) {
    super(props);
    this.state = { 
      totalWinRate:'0',
      totalTradeCount:0,
      tradeType:'--',
      tradeTypePercent:'0',
    }
  }

  componentWillReceiveProps(props){
    if(props.userId != this.props.userId){
      this.loadData(props.userId);
      // this.loadData2(this.props.userId);
    }
  }

  componentDidMount(){
    this.loadData(this.props.userId);
    // this.loadData2(this.props.userId);
  }
 


  loadData(userId){  

    var p1 = new Promise( function(resolve,reject){
      var url = NetConstants.CFD_API.PERSONAL_PAGE_TRADESTYLE
      url = url.replace('<id>', userId) 
      var userData = LogicData.getUserData()  
      NetworkModule.fetchTHUrl(
        url,
          {
              method: 'GET', 
              showLoading: true,
              headers: {
                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                'Content-Type': 'application/json; charset=utf-8',
              }
          }, (responseJson) => {  
            
                resolve(responseJson) 
          },
          (exception) => {
              reject(exception)
          }
      );
          
    })

    var p2 = new Promise( function(resolve,reject){ 
      var url = NetConstants.CFD_API.PERSONAL_PAGE_PLDIST; 
      url = url.replace("<id>", userId); 
      var userData = LogicData.getUserData() 
      NetworkModule.fetchTHUrl(
        url,
        {
          method: 'GET', 
          cache: 'none',
          headers: {
            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
            'Content-Type': 'application/json; charset=utf-8',
          }
        },
        (responseJson) => {   
          
          resolve(responseJson)
        },
        (result) => {
          reject(result)
        }
	    ) 
    }) 

    Promise.all([p1,p2]).then(results=>{  
      this.setState({
          totalWinRate:(results[0].winRate*100).toFixed(0), //总胜率
          averageProfile:results[0].avgPl.toFixed(2),//平均每笔获利
          totalTradeCount:results[0].posCount,//累积下单
          averageOpenTime:results[0].avgDur.toFixed(2),//平均持仓
          averageLeverage:results[0].avgLev.toFixed(2),//平均倍数
          averageInvestUSD:results[0].avgInv.toFixed(2),//平均糖果

          tradeType:results[1][0].name, 
          tradeTypePercent:results[0].posCount==0?0:(results[1][0].count/results[0].posCount*100).toFixed(0)
         })  
    }).catch(function(error){ 
       
    })
  }

  

  // loadData(userId){   
  //   var url = NetConstants.CFD_API.PERSONAL_PAGE_TRADESTYLE
  //   url = url.replace('<id>', userId)

  //   var userData = LogicData.getUserData() 

  //   console.log('url='+url);
  //   this.setState({
  //       isDataLoading: true,
  //   }, ()=>{
  //       NetworkModule.fetchTHUrl(
  //         url,
  //           {
  //               method: 'GET', 
  //               showLoading: true,
  //               headers: {
  //                 'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
  //                 'Content-Type': 'application/json; charset=utf-8',
  //               }
  //           }, (responseJson) => { 
  //                this.setState({
  //                 totalWinRate:(responseJson.winRate*100).toFixed(0), //总胜率
  //                 averageProfile:responseJson.avgPl.toFixed(2),//平均每笔获利
  //                 totalTradeCount: responseJson.posCount,//累积下单
  //                 averageOpenTime: responseJson.avgDur.toFixed(2),//平均持仓
  //                 averageLeverage: responseJson.avgLev.toFixed(2),//平均倍数
  //                 averageInvestUSD: responseJson.avgInv.toFixed(2),//平均糖果
  //                }) 
  //                console.log('responseJson is ='+responseJson)

  //                this.loadData2(this.props.userId);
  //           },
  //           (exception) => {
               
  //           }
  //       );
  //   })  
  // }

  // //获取交易品种的比例
  // loadData2(userId){ 
  //     var url = NetConstants.CFD_API.PERSONAL_PAGE_PLDIST; 
  //     url = url.replace("<id>", userId); 
  //     var userData = LogicData.getUserData() 
  //     NetworkModule.fetchTHUrl(
  //       url,
  //       {
  //         method: 'GET', 
  //         cache: 'none',
  //         headers: {
  //           'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
  //           'Content-Type': 'application/json; charset=utf-8',
  //         }
  //       },
  //       (responseJson) => { 
  //         this.setState({
  //           tradeType:responseJson[0].name, 
  //           tradeTypePercent:this.state.totalTradeCount==0?0:(responseJson[0].count/this.state.totalTradeCount*100).toFixed(0)
  //         });
  //       },
  //       (result) => {
  //       }
	//    ) 
  //  }


  refresh(tradeStyle){
    this.loadData(this.props.userId);
  }

  clear(){
    this.setState({
       
    })
  }

  render() {
   
    var radius = 90;
    var innerRadius = 82;
    var totalWinRate = Number(this.state.totalWinRate);
    var totalTradeCount = Number(this.state.totalTradeCount);
    var tradeType = this.state.tradeType;
    var tradeTypePercent = Number(this.state.tradeTypePercent);
    console.log('WIN:' + totalWinRate + "TradeCount = " + totalTradeCount)

    var leftRes = tradeTypePercent==0?require('../../../../images/blue_line2.png'):require('../../../../images/blue_line.png')
    var rightRes = totalWinRate==0?require('../../../../images/green_line2.png'):require('../../../../images/green_line.png')
    var colorLeft = '#F9C028';
    var colorRight = '#00FA6E';
    return ( 

      <View style={[styles.container]}> 
            
            <View style={{backgroundColor:'#1F1F2B'}}>
              <MyPie  
              radius={radius}
              innerRadius={innerRadius} 
              colors={[colorRight,'#2c2c3d',]} 
              series={[totalWinRate,100-totalWinRate]}
              colors2={[colorLeft,'#2c2c3d',]} 
              series2={[tradeTypePercent, 100-tradeTypePercent]}
              innerText={''+totalTradeCount}
              innerText2={LS.str('TRADES')}/>  
            </View>  
            <View style={{width:100,alignItems:'center', position:'absolute',top:this.props.viewHeight/2-40,left:width/2-radius-92}}>
              <View style={{alignItems:'center',width:70,marginRight:40}}>
              <CustomStyleText style={{fontSize:18,color:colorLeft,fontWeight:'bold'}}>{tradeTypePercent}%</CustomStyleText>
              <CustomStyleText numberOfLines={1} ellipsizeMode={'tail'} style={{fontSize:12,color:colorLeft}}>{tradeType}</CustomStyleText>
              </View>
              <Image style={{width:70,height:12,alignSelf:'flex-end'}} source={leftRes}></Image>
            </View> 
            <View style={{width:60,alignItems:'center', position:'absolute',top:this.props.viewHeight/2-40,left:width/2+radius-17}}>
              <CustomStyleText style={{marginLeft:10, fontSize:18,color:colorRight,fontWeight:'bold'}}>{totalWinRate}%</CustomStyleText>
              <CustomStyleText style={{marginLeft:10,fontSize:12,color:colorRight}}>{LS.str('WINRATE_')}</CustomStyleText>
              <Image  style={{width:40,height:22,marginRight:22}} source={rightRes}></Image>
            </View>  

           
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flexDirection:'row',
    justifyContent:'center',
    alignContent:'center', 
  }, 
});

module.exports = TradeStyleCircleBlock;
