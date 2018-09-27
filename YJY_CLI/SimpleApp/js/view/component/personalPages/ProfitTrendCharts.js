'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewPropTypes,
  Platform,
  Image
} from 'react-native';
import CustomStyleText from '../CustomStyleText';
var UIConstants = require("../../../UIConstants");
var ColorConstants = require('../../../ColorConstants');
var NetConstants = require('../../../NetConstants');
var NetworkModule = require('../../../module/NetworkModule')
import PriceChartView from '../PriceChartView';
import LogicData from '../../../LogicData';
var TYPE_MONTH = 0;
var TYPE_ALL = 1;
var LS = require('../../../LS')

export default class ProfitTrendCharts extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    chartStyle: ViewPropTypes.style,
  }

  static defaultProps = {
    userId: 0,
    chartStyle: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      chartType:TYPE_MONTH,
      stockInfo: null,
    }
  }

  componentWillReceiveProps(props){
    if(props.userId != this.props.userId){
      this.fetchData(props.userId);
    }
  }

  refresh(tradeStyle){
    this.fetchData(this.props.userId);
  }

  fetchData(userId){
    if(userId == undefined){
      userId = this.props.userId;
    }
    console.log("profit chart fetchData")
    var url = this.state.chartType == TYPE_MONTH ? NetConstants.CFD_API.USER_PROFIT_ONE_MONTH : NetConstants.CFD_API.USER_PROFIT_TOTAL;
    url = url.replace("<id>", userId);
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
        //alert(exception.errorMessage)
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
      try{
        console.log("JSON.stringify(this.state.stockInfo)", JSON.stringify(this.state.stockInfo))
        var view = (<PriceChartView style={[styles.chartStyle, this.props.chartStyle]}
          chartType={"userHomePage"}
          lineChartGradient={['#1a272f', '#13131b']}
          dataSetColor={ColorConstants.COLOR_MAIN_THEME_BLUE} 
          textColor={"#9e9e9e"}
          lineWidth={10} 
          borderColor={ColorConstants.SEPARATOR_GRAY}
          xAxisPosition="BOTTOM"
          leftAxisEnabled={false}
          rightAxisEnabled={true}
          rightAxisDrawLabel={true}
          rightAxisLabelCount={4}
          chartPaddingLeft={0}
          chartPaddingTop={20}
          xAxisPaddingBottom={20}
          xAxisPaddingTop={20}
          paddingRightAxis={10}
          drawBorders={true}
          data={JSON.stringify(this.state.stockInfo)}
          drawDataUnderYAxis={false}
          xAxisTextSize={10}
          rainbowColor={['#B367F4', '#50E0E6']}
      />)
      }catch(e){

      console.log("JSON.stringify(this.state.stockInfo) error")
        console.log(e)
      }
      console.log("JSON.stringify(this.state.stockInfo)2")        
      return view;

    }else{
      return (<View style={{alignItems:'center', justifyContent:'center', flex:1}}>
        <CustomStyleText style={{color:'#666666'}}>{LS.str('ZWJYJL')}</CustomStyleText>
      </View>);
    }
  }

  render() { 
    var leftStyle = {};
    var rightStyle = {}
    if(this.state.chartType == TYPE_MONTH){
      leftStyle.backgroundColor = '#55cad3'
      leftStyle.borderColor = '#55cad3'
    }else{
      rightStyle.backgroundColor = '#55cad3'
      rightStyle.borderColor = '#55cad3'
    }
    
    var textColorLeft = this.state.chartType == TYPE_MONTH ? 'white':'grey'
    var textColorRight = this.state.chartType == TYPE_MONTH ? 'grey':'white'
    return (
      <View style={styles.container}>
        <View style={{margin:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL, 
            marginBottom: Platform.OS == "ios" ? 10 : 0,
            flexDirection:'row',
            justifyContent:'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>this.selectorPressed(TYPE_MONTH)} style={[styles.selectorLeft,leftStyle]}>
              <CustomStyleText style = {[styles.textChartSelector,{color:textColorLeft}]}>{LS.str('MONTHLY')}</CustomStyleText>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.selectorPressed(TYPE_ALL)} style={[styles.selectorRight,rightStyle]}>
              <CustomStyleText style = {[styles.textChartSelector,{color:textColorRight}]}>{LS.str("ALL")}</CustomStyleText>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            {/* <View style={{width:20,height:4,marginRight:5,backgroundColor:ColorConstants.BGBLUE}}/> */}
            <Image style={{width:20,height:4,marginRight:5}} source={require('../../../../images/icon_line.png')}></Image>
            <CustomStyleText style={{fontSize:12,color:'#666666'}}>{LS.str('INVESTMENT_TREND')}</CustomStyleText>
          </View>
        </View> 
        <View style={[styles.chartContainer, {backgroundColor: 'transparent'}]}>
          {this.renderChart()}
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1, 
    marginBottom:5,
  },
  separator: {
    height: 1,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  selectorLeft:{
    alignItems:'center',
    borderWidth:1,
    borderRightWidth:0,
    padding:5,
    width:72,
    borderTopLeftRadius:UIConstants.ITEM_ROW_BORDER_RADIUS - 5,
    borderBottomLeftRadius:UIConstants.ITEM_ROW_BORDER_RADIUS - 5,
    borderColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG
  },
  selectorRight:{
    alignItems:'center',
    borderWidth:1,
    borderLeftWidth:0,
    padding:5,
    width:72,
    borderTopRightRadius:UIConstants.ITEM_ROW_BORDER_RADIUS - 5,
    borderBottomRightRadius:UIConstants.ITEM_ROW_BORDER_RADIUS - 5,
    borderColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG
  } ,
  textChartSelector:{
    fontSize:12,
    color:'#999999',
     
  },
  chartContainer:{
    flex:1, 
    alignSelf:'stretch', 
    backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE
  },
  chartStyle:{
    flex:1, 
    marginLeft: 20, 
    marginBottom: Platform.OS == "ios" ? 5 : 0, 
    marginRight: Platform.OS == "ios" ? 0 : 10
  },
});

module.exports = ProfitTrendCharts;
