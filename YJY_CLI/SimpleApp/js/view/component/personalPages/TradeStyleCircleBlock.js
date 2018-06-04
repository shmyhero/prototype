'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
var LS = require('../../../LS')
var ColorConstants = require('../../../ColorConstants');  
var NetworkModule = require('../../../module/NetworkModule');
var NetConstants = require('../../../NetConstants');
var MyPie = require('../../component/Pie/MyPie')
var {height, width} = Dimensions.get('window')
export default class TradeStyleCircleBlock extends Component {
  static propTypes = {
    
  }

  static defaultProps = {
   
  }

  constructor(props) {
    super(props);
    this.state = { 
      totalWinRate:0,
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
    var url = NetConstants.CFD_API.PERSONAL_PAGE_TRADESTYLE
    url = url.replace('<id>', userId)
    console.log('url='+url);
    this.setState({
        isDataLoading: true,
    }, ()=>{
        NetworkModule.fetchTHUrl(
          url,
            {
                method: 'GET', 
                showLoading: true,
            }, (responseJson) => { 
                 this.setState({
                  totalWinRate:(responseJson.winRate*100).toFixed(0), //总胜率
                  averageProfile:responseJson.avgPl.toFixed(2),//平均每笔获利
                  totalTradeCount: responseJson.posCount,//累积下单
                  averageOpenTime: responseJson.avgDur.toFixed(2),//平均持仓
                  averageLeverage: responseJson.avgLev.toFixed(2),//平均倍数
                  averageInvestUSD: responseJson.avgInv.toFixed(2),//平均糖果
                 }) 
                 console.log('responseJson is ='+responseJson)

                 this.loadData2(this.props.userId);
            },
            (exception) => {
                alert(exception.errorMessage)
            }
        );
    })  
  }

  //获取交易品种的比例
  loadData2(userId){ 
      var url = NetConstants.CFD_API.PERSONAL_PAGE_PLDIST; 
      url = url.replace("<id>", userId); 

      NetworkModule.fetchTHUrl(
        url,
        {
          method: 'GET', 
          cache: 'none',
        },
        (responseJson) => { 
          this.setState({
            tradeType:responseJson[0].symbol, 
            tradeTypePercent:this.state.totalTradeCount==0?0:(responseJson[0].count/this.state.totalTradeCount*100).toFixed(0)
          });
        },
        (result) => {
        }
	   ) 
   }


  refresh(tradeStyle){
    console.log("tradeStyle isPrivate = " + tradeStyle.isPrivate);
    //TODO: add api
    if(tradeStyle.isPrivate){
      this.setState({
         
      })
    }  
  }

  clear(){
    this.setState({
       
    })
  }

  render() {
   
    var radius = 100;
    var innerRadius = 92;
    var totalWinRate = Number(this.state.totalWinRate);
    var totalTradeCount = Number(this.state.totalTradeCount);
    var tradeType = this.state.tradeType;
    var tradeTypePercent = Number(this.state.tradeTypePercent);
    console.log('WIN:' + totalWinRate + "TradeCount = " + totalTradeCount)

    return ( 

      <View style={[styles.container]}> 
            
            <View style={{backgroundColor:'white'}}>
              <MyPie  
              radius={radius}
              innerRadius={innerRadius} 
              colors={['#3dcc24','#d0f5c7',]} 
              series={[totalWinRate,100-totalWinRate]}
              colors2={[ColorConstants.BGBLUE,'#c8e2f4',]} 
              series2={[tradeTypePercent, 100-tradeTypePercent]}
              innerText={''+totalTradeCount}
              innerText2={'TRADES'}/>  
            </View>  
            <View style={{width:60,  position:'absolute',top:this.props.viewHeight/2-40,left:width/2-radius-70}}>
              <Text style={{fontSize:18,color:ColorConstants.BGBLUE}}>{tradeTypePercent}%</Text>
              <Text style={{fontSize:12,color:ColorConstants.BGBLUE}}>{tradeType}</Text>
              <Image style={{width:70,height:12,marginLeft:8}} source={require('../../../../images/blue_line.png')}></Image>
            </View> 
            <View style={{ width:60,alignItems:'flex-end', position:'absolute',top:this.props.viewHeight/2-40,left:width/2+radius-15}}>
              <Text style={{fontSize:18,color:'#3dcc24'}}>{totalWinRate}%</Text>
              <Text style={{fontSize:12,color:'#3dcc24'}}>WinRate</Text>
              <Image  style={{width:40,height:22,marginRight:22}} source={require('../../../../images/green_line.png')}></Image>
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
