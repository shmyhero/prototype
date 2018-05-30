'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
var LS = require('../../../LS')
var ColorConstants = require('../../../ColorConstants');  
var NetworkModule = require('../../../module/NetworkModule');
var NetConstants = require('../../../NetConstants');

export default class TradeStyleBlock extends Component {
  static propTypes = {
    // userId: PropTypes.number,
  }

  static defaultProps = {
    // userId: 0,
  }

  constructor(props) {
    super(props);
    this.state = { 
      totalWinRate:'36%', //总胜率
      averageProfile:'+78',//平均每笔获利
      totalTradeCount: '50',//累积下单
      averageOpenTime: '2.5',//平均持仓
      averageLeverage: '50',//平均倍数
      averageInvestUSD: '100',//平均糖果
    }

    
  }

  componentDidMount(){
    this.loadData();
  }


  /*
  { winRate: 0,
    posCount: 12,
    avgInv: 158.33333333333334,
    avgLev: 27.583333333333332,
    avgPl: -4.1691446975,
    avgDur: 0.174804940200617 }
  */
  loadData(){   
      var url = NetConstants.CFD_API.PERSONAL_PAGE_TRADESTYLE
      url = url.replace('<id>',this.props.userId)
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
                    totalWinRate:(responseJson.winRate*100).toFixed(2), //总胜率
                    averageProfile:responseJson.avgPl.toFixed(2),//平均每笔获利
                    totalTradeCount: responseJson.posCount,//累积下单
                    averageOpenTime: responseJson.avgDur.toFixed(2),//平均持仓
                    averageLeverage: responseJson.avgLev.toFixed(2),//平均倍数
                    averageInvestUSD: responseJson.avgInv.toFixed(2),//平均糖果
                   }) 
                   console.log('responseJson is ='+responseJson)
              },
              (exception) => {
                  alert(exception.errorMessage)
              }
          );
      })  
  }


  refresh(tradeStyle){
    console.log("tradeStyle isPrivate = " + tradeStyle.isPrivate);
    //TODO: add api
    if(tradeStyle.isPrivate){
      this.setState({
        averageLeverage: "***",
        totalTradeCount: "***",
        averageOpenTime: "***",
        averageInvestUSD: "***",
        averageProfile: "***",
        totalWinRate: "***",
      })
    }else{
      this.setState({
        averageLeverage: tradeStyle.avgLeverage,
        totalTradeCount: tradeStyle.orderCount,
        averageOpenTime: tradeStyle.avgHoldPeriod,
        averageInvestUSD: tradeStyle.avgInvestUSD,
        averageProfile:tradeStyle.avgProfile,
        totalWinRate:tradeStyle.totalWinRate,
      })
    }
  }

  clear(){
    this.setState({
      averageLeverage: '--',
      totalTradeCount: '--',
      averageOpenTime: '--',
      averageInvestUSD: '--',
      averageProfile:'--',
      totalWinRate:'--',
    })
  }

  render() {
    var strJYFG = LS.str('JYFG') 
    var strPJGG = LS.str('PJGG')
    var strLJXD = LS.str('LJXD')
    var strPJCCSJ = LS.str('PJCCSJ')
    var strPJBJ = LS.str('PJBJ')
    var strPJMBHL = LS.str('PJMBHL')
    var strZSL = LS.str('ZSL')

    return (
      <View style={[styles.container, this.props.style]}>

        {/* <View style={styles.titleRow}>
          <Text style={styles.titleText}>{strJYFG}</Text>
        </View> */}
				 
         <View style={styles.contentRow}>
           {/* <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strZSL}</Text>
            <Text style={styles.contentValueBlock}>{this.state.totalWinRate}</Text>
           </View>   */}

           <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJCCSJ}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageOpenTime}</Text>
          </View>

           <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJMBHL}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageProfile}</Text>
           </View>
         
            {/* <View style={styles.contentBlock}>
              <Text style={styles.contentTitleBlock}>{strLJXD}</Text>
              <Text style={styles.contentValueBlock}>{this.state.totalTradeCount}</Text>
            </View> */}
        </View>
         
        <View style={styles.contentRow}>
          {/* <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJCCSJ}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageOpenTime}</Text>
          </View> */}

          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJGG}</Text> 
            <Text style={styles.contentValueBlock}>{this.state.averageLeverage}</Text>
          </View>
          
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJBJ}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageInvestUSD}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 181,
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  verticalSeparator: {
    width: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
    marginTop: 10,
    marginBottom: 9,
  },
  titleRow: {
    paddingLeft: 15,
    justifyContent: 'space-around',
    height: 39,
  },
  titleText: {
    fontSize: 15,
    color: '#474747',
  },
  contentRow:{
    flex:1,
    flexDirection: 'row',
    alignItems:'stretch',
  },
  contentBlock:{
    flex:1,
    alignItems:'center',
    alignSelf:'center',
  },
  contentTitleBlock: {
    fontSize: 11,
    color: '#9c9b9b',
  },
  contentValueBlock:{
    fontSize: 19,
    color: '#595959',
    marginTop: 8,
  },
});

module.exports = TradeStyleBlock;
