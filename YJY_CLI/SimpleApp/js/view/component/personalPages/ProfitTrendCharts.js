'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

var ColorConstants = require('../../../ColorConstants');  

var TYPE_MONTH = 0;
var TYPE_ALL = 1;

export default class ProfitTrendCharts extends Component {
 

  static defaultProps = {
    userId: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      chartType:TYPE_MONTH
    }
  }

  componentDidMount(){

  }

  refresh(tradeStyle){ 
     
  }

  clear(){ 
  }

  selectorPressed(type){
    if(type !== this.state.chartType){
      this.setState({
        chartType:type
      })
    }
  }

  render() { 
    var selectorLeftBgColor = this.state.chartType == TYPE_MONTH ? ColorConstants.BGBLUE:'transparent'
    var selectorRightBgColor = this.state.chartType == TYPE_MONTH ? 'transparent':ColorConstants.BGBLUE
    var textColorLeft = this.state.chartType == TYPE_MONTH ? 'white':'grey'
    var textColorRight = this.state.chartType == TYPE_MONTH ? 'grey':'white'
    return (
      <View style={styles.container}>
        <View style={{margin:10,flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.selectorPressed(TYPE_MONTH)} style={[styles.selectorLeft,{backgroundColor:selectorLeftBgColor}]}>
              <Text style = {[styles.textChartSelector,{color:textColorLeft}]}>近一个月</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.selectorPressed(TYPE_ALL)} style={[styles.selectorRight,{backgroundColor:selectorRightBgColor}]}>
              <Text style = {[styles.textChartSelector,{color:textColorRight}]}>全部</Text>
            </TouchableOpacity> 
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{width:20,height:4,marginRight:5,backgroundColor:ColorConstants.BGBLUE}}/>
            <Text style={{fontSize:12}}>TA的收益走势</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
  },
  separator: {
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  selectorLeft:{
    alignItems:'center',
    borderWidth:0.5,
    padding:5,
    width:72,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
    borderColor:'#EEEEEE'
  },
  selectorRight:{
    alignItems:'center',
    borderWidth:0.5,
    padding:5,
    width:72,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    borderColor:'#EEEEEE'
  } ,
  textChartSelector:{
    fontSize:12,
    color:'white'
  }
});

module.exports = ProfitTrendCharts;
