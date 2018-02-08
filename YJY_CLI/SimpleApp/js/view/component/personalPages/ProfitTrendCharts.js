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
import PriceChartView from '../PriceChartView';
var TYPE_MONTH = 0;
var TYPE_ALL = 1;

export default class ProfitTrendCharts extends Component {
 

  static defaultProps = {
    userId: 0,
  }

  constructor(props) {
    super(props);

    //TODO: use real data instead of sample data.
    var stockInfo = { lastOpen: '2018-01-29T22:05:00.476Z',
      lastClose: '2018-01-29T22:00:00.3Z',
      longPct: 0.73256338654671,
      minValueLong: 1237,
      minValueShort: 1237,
      minInvestUSD: 50,
      maxValueLong: 309145,
      maxValueShort: 309095,
      maxLeverage: 100,
      smd: 0.0005,
      gsmd: 0.003,
      ccy: 'USD',
      isPriceDown: true,
      levList: [ 1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 70, 100 ],
      dcmCount: 5,
      bid: 1.23638,
      ask: 1.23658,
      id: 34805,
      symbol: 'EURUSD',
      name: '欧元/美元',
      preClose: 1.23861,
      open: 1.23826,
      last: 1.23648,
      isOpen: true,
      status: 1 
    }

    var priceData = [{"p":1.23527,"time":"2018-01-29T14:40:56.988Z"},{"p":1.23561,"time":"2018-01-29T14:41:56.858Z"},{"p":1.23566,"time":"2018-01-29T14:42:56.764Z"},{"p":1.23578,"time":"2018-01-29T14:43:56.824Z"},{"p":1.23574,"time":"2018-01-29T14:44:57.149Z"},{"p":1.23553,"time":"2018-01-29T14:45:56.961Z"},{"p":1.23495,"time":"2018-01-29T14:46:57.32Z"},{"p":1.23479,"time":"2018-01-29T14:47:57.177Z"},{"p":1.23507,"time":"2018-01-29T14:48:57.085Z"},{"p":1.2354,"time":"2018-01-29T14:49:57.676Z"},{"p":1.23559,"time":"2018-01-29T14:50:57.404Z"},{"p":1.23596,"time":"2018-01-29T14:51:57.32Z"},{"p":1.23598,"time":"2018-01-29T14:52:57.31Z"},{"p":1.23593,"time":"2018-01-29T14:53:57.875Z"},{"p":1.2358,"time":"2018-01-29T14:54:57.781Z"},{"p":1.23596,"time":"2018-01-29T14:55:57.752Z"},{"p":1.23625,"time":"2018-01-29T14:56:57.643Z"},{"p":1.23608,"time":"2018-01-29T14:57:57.599Z"},{"p":1.23586,"time":"2018-01-29T14:58:57.929Z"},{"p":1.23537,"time":"2018-01-29T14:59:57.878Z"},{"p":1.23554,"time":"2018-01-29T15:00:58.113Z"},{"p":1.23417,"time":"2018-01-29T16:19:53.072Z"},{"p":1.23457,"time":"2018-01-29T16:20:53.117Z"},{"p":1.23465,"time":"2018-01-29T16:21:52.983Z"},{"p":1.23474,"time":"2018-01-29T16:22:52.799Z"},{"p":1.23442,"time":"2018-01-29T16:23:53.157Z"},{"p":1.23431,"time":"2018-01-29T16:24:53.459Z"},{"p":1.23402,"time":"2018-01-29T16:25:53.316Z"},{"p":1.23429,"time":"2018-01-29T16:26:53.239Z"},{"p":1.23407,"time":"2018-01-29T16:27:53.782Z"},{"p":1.23444,"time":"2018-01-29T16:28:53.427Z"},{"p":1.23448,"time":"2018-01-29T16:29:53.352Z"},{"p":1.23475,"time":"2018-01-29T16:30:53.405Z"},{"p":1.23475,"time":"2018-01-29T16:31:53.464Z"},{"p":1.23521,"time":"2018-01-29T16:32:53.824Z"},{"p":1.2351,"time":"2018-01-29T16:33:53.517Z"},{"p":1.23491,"time":"2018-01-29T16:34:53.944Z"},{"p":1.23462,"time":"2018-01-29T16:35:53.381Z"},{"p":1.23496,"time":"2018-01-29T16:36:53.889Z"},{"p":1.23509,"time":"2018-01-29T16:37:54.317Z"},{"p":1.23453,"time":"2018-01-29T16:38:53.931Z"},{"p":1.23438,"time":"2018-01-29T16:39:54.37Z"},{"p":1.23457,"time":"2018-01-29T16:40:54.016Z"},{"p":1.23465,"time":"2018-01-29T16:41:54.481Z"},{"p":1.2346,"time":"2018-01-29T16:42:54.472Z"},{"p":1.23864,"time":"2018-01-29T20:19:58.035Z"},{"p":1.23867,"time":"2018-01-29T20:20:57.904Z"},{"p":1.23864,"time":"2018-01-29T20:21:58.414Z"},{"p":1.23866,"time":"2018-01-29T20:22:57.918Z"},{"p":1.23864,"time":"2018-01-29T20:23:57.862Z"},{"p":1.23862,"time":"2018-01-29T20:24:58.135Z"},{"p":1.23867,"time":"2018-01-29T20:25:58.222Z"},{"p":1.23861,"time":"2018-01-29T20:26:58.546Z"},{"p":1.23864,"time":"2018-01-29T20:27:58.397Z"},{"p":1.23868,"time":"2018-01-29T20:28:58.219Z"},{"p":1.23864,"time":"2018-01-29T20:29:58.762Z"},{"p":1.23852,"time":"2018-01-29T20:30:58.192Z"},{"p":1.23846,"time":"2018-01-29T20:31:58.508Z"},{"p":1.23851,"time":"2018-01-29T20:32:58.628Z"},{"p":1.23852,"time":"2018-01-29T20:33:58.617Z"},{"p":1.23853,"time":"2018-01-29T20:34:59.071Z"},{"p":1.23843,"time":"2018-01-29T20:35:58.769Z"},{"p":1.23862,"time":"2018-01-29T20:36:58.644Z"},{"p":1.23878,"time":"2018-01-29T20:37:59.15Z"},{"p":1.23885,"time":"2018-01-29T20:38:58.922Z"},{"p":1.23876,"time":"2018-01-29T20:39:59.182Z"},{"p":1.23877,"time":"2018-01-29T20:40:59.104Z"},{"p":1.23883,"time":"2018-01-29T20:41:59.038Z"},{"p":1.23877,"time":"2018-01-29T20:42:59.611Z"},{"p":1.23814,"time":"2018-01-29T21:57:53.816Z"},{"p":1.2382,"time":"2018-01-29T21:58:54.103Z"},{"p":1.23826,"time":"2018-01-29T21:59:53.739Z"},{"p":1.23818,"time":"2018-01-29T22:05:54.336Z"},{"p":1.23819,"time":"2018-01-29T22:06:54.258Z"},{"p":1.23830,"time":"2018-01-29T22:07:54.488Z"},{"p":1.23826,"time":"2018-01-29T22:08:54.505Z"},{"p":1.23822,"time":"2018-01-29T22:09:54.119Z"},{"p":1.23824,"time":"2018-01-29T22:10:54.338Z"},{"p":1.23833,"time":"2018-01-29T22:11:54.568Z"},{"p":1.23836,"time":"2018-01-29T22:12:54.952Z"},{"p":1.23830,"time":"2018-01-29T22:13:54.306Z"},{"p":1.23833,"time":"2018-01-29T22:14:54.659Z"},{"p":1.23842,"time":"2018-01-29T22:15:55.114Z"},{"p":1.23837,"time":"2018-01-29T22:16:55.105Z"},{"p":1.23838,"time":"2018-01-29T22:17:54.878Z"},{"p":1.2384,"time":"2018-01-29T22:18:55.226Z"},{"p":1.23842,"time":"2018-01-29T22:19:55.173Z"},{"p":1.23839,"time":"2018-01-29T22:20:55.418Z"},{"p":1.23839,"time":"2018-01-29T22:21:54.896Z"},{"p":1.23841,"time":"2018-01-29T22:22:55.223Z"},{"p":1.23842,"time":"2018-01-29T22:23:55.667Z"},{"p":1.2384,"time":"2018-01-29T22:24:55.5Z"},{"p":1.23839,"time":"2018-01-29T22:25:55.313Z"},{"p":1.23822,"time":"2018-01-29T22:26:55.411Z"},{"p":1.23813,"time":"2018-01-29T22:27:55.506Z"},{"p":1.23808,"time":"2018-01-29T22:28:55.341Z"},{"p":1.23822,"time":"2018-01-29T22:29:55.686Z"},{"p":1.23809,"time":"2018-01-29T22:30:55.847Z"},{"p":1.23817,"time":"2018-01-29T22:31:55.664Z"},{"p":1.23812,"time":"2018-01-29T22:32:55.795Z"},{"p":1.23814,"time":"2018-01-29T22:33:56.229Z"},{"p":1.23805,"time":"2018-01-29T22:34:56.049Z"},{"p":1.23815,"time":"2018-01-29T22:35:55.673Z"},{"p":1.23814,"time":"2018-01-29T22:36:56.283Z"},{"p":1.23812,"time":"2018-01-29T22:37:56.508Z"},{"p":1.23813,"time":"2018-01-29T22:38:55.884Z"},{"p":1.23808,"time":"2018-01-29T22:39:56.367Z"},{"p":1.23809,"time":"2018-01-29T22:40:56.03Z"},{"p":1.23813,"time":"2018-01-29T22:41:56.668Z"},{"p":1.23811,"time":"2018-01-29T22:42:56.589Z"},{"p":1.23814,"time":"2018-01-29T22:43:55.02Z"},{"p":1.23812,"time":"2018-01-29T22:44:56.55Z"},{"p":1.2381,"time":"2018-01-29T22:45:57.013Z"},{"p":1.23807,"time":"2018-01-29T22:46:56.352Z"},{"p":1.23802,"time":"2018-01-29T22:47:56.794Z"},{"p":1.23797,"time":"2018-01-29T22:48:56.626Z"},{"p":1.23803,"time":"2018-01-29T22:49:56.515Z"},{"p":1.23803,"time":"2018-01-29T22:50:56.87Z"},{"p":1.23797,"time":"2018-01-29T22:51:56.821Z"},{"p":1.23785,"time":"2018-01-29T22:52:57.145Z"},{"p":1.23807,"time":"2018-01-29T22:53:56.834Z"},{"p":1.23814,"time":"2018-01-29T22:54:57.028Z"},{"p":1.23816,"time":"2018-01-29T22:55:57.47Z"},{"p":1.23814,"time":"2018-01-29T22:56:57.335Z"},{"p":1.23819,"time":"2018-01-29T22:57:57.257Z"},{"p":1.23806,"time":"2018-01-29T22:58:57.591Z"},{"p":1.23826,"time":"2018-01-29T22:59:57.5Z"},{"p":1.23833,"time":"2018-01-29T23:00:57.4Z"},{"p":1.23835,"time":"2018-01-29T23:01:57.254Z"},{"p":1.23832,"time":"2018-01-29T23:02:57.419Z"},{"p":1.23834,"time":"2018-01-29T23:03:57.875Z"},{"p":1.23838,"time":"2018-01-29T23:04:57.797Z"},{"p":1.23851,"time":"2018-01-29T23:05:57.68Z"},{"p":1.23648,"time":"2018-01-30T02:40:35.942Z"}];
    stockInfo.priceData = priceData;

    this.state = {
      chartType:TYPE_MONTH,
      stockInfo: stockInfo
       //TODO: use real data
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
            <Text style={{fontSize:12,color:'#666666'}}>TA的收益走势</Text>
          </View>
        </View>
        <View style={[styles.chartContainer, {backgroundColor: 'white'}]}>
            <PriceChartView style={{flex:1}}
                chartType={"userHomePage"}
                lineChartGradient={['#dbf1fd', '#feffff']}
                dataSetColor={"#0f98eb"}
                textColor={"#9e9e9e"}
                borderColor={'#666666'}
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
            />
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
