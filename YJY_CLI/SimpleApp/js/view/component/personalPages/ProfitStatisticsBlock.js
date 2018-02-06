'use strict';

import React, { Component, PropTypes} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  ImageBackground
} from 'react-native';

var ColorConstants = require('../../../ColorConstants');  

var TYPE_MONTH = 0;
var TYPE_ALL = 1;
var {height, width} = Dimensions.get('window');
export default class ProfitStatisticsBlock extends Component {
 

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
          <ImageBackground style={styles.gifBg} source={require('../../../../images/statistics.gif')}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginTop:15,color:'grey'}}>总糖果</Text>
              <Text style={{marginTop:0,fontSize:48,color:ColorConstants.BGBLUE}}>99999.00</Text>
            </View>  

            <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{color:'#c8e7fb'}}>剩余糖果</Text>
              <Text style={{color:'#c8e7fb',fontSize:34,marginBottom:10}}>50000.00</Text>
            </View>
           
          
          </ImageBackground>
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
  },
  gifBg:{
    width:width-40,
    height:(width-40)*215/350,
    margin:0,alignItems:'center',
    justifyContent:'space-between'
  }
});

module.exports = ProfitStatisticsBlock;
