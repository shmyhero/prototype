'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

var ColorConstants = require('../../../ColorConstants');
var NetConstants = require('../../../NetConstants');
var NetworkModule = require('../../../module/NetworkModule')
import PriceChartView from '../PriceChartView';
import LogicData from '../../../LogicData';
var TYPE_MONTH = 0;
var TYPE_ALL = 1;

export default class ProfitTrendCharts extends Component {
  static propTypes = {
    userId: PropTypes.number,
  }

  static defaultProps = {
    userId: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      chartType:TYPE_MONTH,
      stockInfo: null,
    }
  }

  refresh(tradeStyle){ 
    this.fetchData();
  }

  fetchData(){
    console.log("profit chart fetchData")
    var url = this.state.chartType == TYPE_MONTH ? NetConstants.CFD_API.USER_PROFIT_ONE_MONTH : NetConstants.CFD_API.USER_PROFIT_TOTAL;
    url = url.replace("<id>", this.props.userId);
    var userData = LogicData.getUserData()

    NetworkModule.fetchTHUrl(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          'Content-Type': 'application/json; charset=utf-8',
        },
        showLoading: true,
      }, (responseJson) => { 
        var stockInfo = {priceData: responseJson}
        this.setState({
          stockInfo:stockInfo,
        })
      },
      (exception) => {
        alert(exception.errorMessage)
      }
    );
  }

  clear(){ 
  }

  selectorPressed(type){
    if(type !== this.state.chartType){
      this.setState({
        chartType:type
      }, ()=>{
        this.fetchData();
      })
    }
  }

  renderChart(){
    if(this.state.stockInfo && this.state.stockInfo.priceData && this.state.stockInfo.priceData.length > 0){
      return (
        <PriceChartView style={{flex:1}}
            chartType={"userHomePage"}
            lineChartGradient={['#dbf1fd', '#feffff']}
            dataSetColor={"#0f98eb"}
            textColor={"#9e9e9e"}
            borderColor={ColorConstants.SEPARATOR_GRAY}
            xAxisPosition="BOTTOM"
            leftAxisEnabled={false}
            rightAxisEnabled={true}
            rightAxisDrawLabel={true}
            rightAxisLabelCount={5}
            chartPaddingLeft={24}
            chartPaddingTop={20}
            xAxisPaddingBottom={20}
            xAxisPaddingTop={20}
            paddingRightAxis={10}
            drawBorders={true}
            data={JSON.stringify(this.state.stockInfo)}
            drawDataUnderYAxis={false}
            xAxisTextSize={10}
        />
      )
    }else{
      return (<View style={{alignItems:'center', justifyContent:'center', flex:1}}>
        <Text style={{color:'#666666'}}>暂无交易记录</Text>
      </View>);
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
            <Text style={{fontSize:12,color:'#666666'}}>TA的收益走势</Text>
          </View>
        </View>
        <View style={[styles.chartContainer, {backgroundColor: 'white'}]}>
          {this.renderChart()}
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
    color:'#999999'
  },
  chartContainer:{
    flex:1, 
    alignSelf:'stretch', 
    backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE
  },
});

module.exports = ProfitTrendCharts;
