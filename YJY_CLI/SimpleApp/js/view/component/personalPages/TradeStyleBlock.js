'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

var ColorConstants = require('../../../ColorConstants');  
 
export default class TradeStyleBlock extends Component {
  static propTypes = {
    userId: PropTypes.number,
  }

  static defaultProps = {
    userId: 0,
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
    var strJYFG = '交易风格'

    var strPJGG = '平均倍数'
    var strLJXD = '累积下单(次)'
    var strPJCCSJ = '平均持仓(天)'
    var strPJBJ = '平均糖果'
    var strPJMBHL = '平均每笔获利'
    var strZSL = '总胜率'

    return (
      <View style={[styles.container, this.props.style]}>

        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{strJYFG}</Text>
        </View>
				 
        <View style={styles.contentRow}>
            <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strZSL}</Text>
            <Text style={styles.contentValueBlock}>{this.state.totalWinRate}</Text>
           </View>

           <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJMBHL}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageProfile}</Text>
           </View>
         
            <View style={styles.contentBlock}>
              <Text style={styles.contentTitleBlock}>{strLJXD}</Text>
              <Text style={styles.contentValueBlock}>{this.state.totalTradeCount}</Text>
            </View>
        </View>
         
        <View style={styles.contentRow}>
          <View style={styles.contentBlock}>
            <Text style={styles.contentTitleBlock}>{strPJCCSJ}</Text>
            <Text style={styles.contentValueBlock}>{this.state.averageOpenTime}</Text>
          </View>

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
    backgroundColor: 'white',
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
