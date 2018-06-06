'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
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

import LogicData from '../../../LogicData';
var NetworkModule = require('../../../module/NetworkModule');
var NetConstants = require('../../../NetConstants');
var ColorConstants = require('../../../ColorConstants');  
var LS = require('../../../LS')
 
var {height, width} = Dimensions.get('window');
export default class ProfitStatisticsBlock extends Component {
  static propTypes = {
    userId: PropTypes.number,
  }

  static defaultProps = {
    userId: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      balance:0,
      total:0,
    }
  }

  componentDidMount(){
    this.refresh()
  }

  refresh(){
    this.loadBalance()
  }


  loadBalance(){ 
    //{ balance: 98249.97026353, total: 99494.27291035505 }
 
    if(LogicData.isLoggedIn()){
      var userData = LogicData.getUserData();
      this.setState({
          isDataLoading: true,
      }, ()=>{
          NetworkModule.fetchTHUrl(
              NetConstants.CFD_API.USER_FUND_BALANCE,
              {
                  method: 'GET',
                  headers: {
                      'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                      'Content-Type': 'application/json; charset=utf-8',
                  },
                  showLoading: true,
              }, (responseJson) => { 
                   this.setState({
                     balance:responseJson.balance,
                     total:responseJson.total,
                   })
              },
              (exception) => {
                  //alert(exception.errorMessage)
              }
          );
      })			
    }
  } 

  render() {  
    return (  
          <ImageBackground style={styles.gifBg} source={require('../../../../images/statistics.gif')}>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{marginTop:30,color:'#666666'}}>{LS.str('TOTAL_MOUNT')}</Text>
              <Text style={{marginTop:0,fontSize:50,color:ColorConstants.BGBLUE}}>{this.state.total.toFixed(2)}</Text>
            </View>  
            <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{fontSize:15, color:'#89cff7'}}>{LS.str('REMAIN_MOUNT')}</Text>
              <Text style={{color:'#c1e5fc',fontSize:20,marginBottom:10}}>{this.state.balance.toFixed(2)}</Text>
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
  
  gifBg:{
    width:width-40,
    height:(width-40)*230/350,
    margin:0,alignItems:'center',
    justifyContent:'space-between'
  }
});

module.exports = ProfitStatisticsBlock;
