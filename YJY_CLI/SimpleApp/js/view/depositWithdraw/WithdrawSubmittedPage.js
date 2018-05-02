'use strict'

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
	Dimensions,
	ListView,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
	ScrollView,
} from 'react-native';

import NavBar from '../component/NavBar';
import LogicData from '../../LogicData';
import SubmitButton from '../component/SubmitButton';
var ColorConstants = require('../../ColorConstants')
var NetworkModule = require('../../module/NetworkModule');
var NetConstants = require('../../NetConstants');

var {height, width} = Dimensions.get('window')
var rowPadding = Math.round(18*width/375)
var fontSize = Math.round(16*width/375)

var rowTitleWidth = (width - (2 * rowPadding)) / 4;
var rowValueWidth = (width - (2 * rowPadding)) / 4 * 3;

var defaultRawData = [
		{"type": "cardEntry",},
		{"type": "withdraw", value: null},
];

class WithdrawSubmittedPage extends Component {
  listRawData = [];
  ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 === r2 });
  constructor(props) {
	  super(props);

    this.state={
      refundETA: 1,
    }
  }

  componentDidMount(){
    var userData = LogicData.getUserData()
    if(userData.token == undefined){return}
  }

  gotoNext(){
    var backParam = null
    if(this.props.navigation.state && this.props.navigation.state.params){
      backParam = this.props.navigation.state.params.backFrom
    }
    this.props.navigation.goBack(backParam);
  }

  render() {
		var nextEnabled = true;//OpenAccountUtils.canGoNext(this.listRawData);
		//console.log("listRawData: " + JSON.stringify(listRawData));
		if(!this.state.withdrawValue || !this.isWithdrawValueAvailable()){
      nextEnabled = false;
    }else if(!this.state.hasRead){
      nextEnabled = false;
    }

    return (
			<View style={styles.wrapper}>
        <NavBar title={"出金提交成功"}
          showBackButton={false}
          navigator={this.props.navigator}
          />
        <Image source={require('../../../images/withdraw_submitted.png')} style={styles.checkImage}/>
        <Text style={styles.hintText}>{"预计资金到账时间为{1}小时，具体以钱包余额为准！".replace("{1}", this.state.refundETA)}</Text>

        <View style={{flex:1}}/>

        <View style={styles.bottomArea}>
          <SubmitButton style={styles.buttonArea}
            onPress={()=>this.gotoNext()}
            text={"完成"} />
        </View>
			</View>
		);
  }
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
		backgroundColor: "white",
	},
  checkImage:{
    marginTop: 65,
    width: 115,
    height: 115,
  },
  hintText:{
    marginTop: 51,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
    color: '#000000',
  },
  bottomArea: {
    height: 72,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    flexDirection:'row'
  },
  buttonArea: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 16,
    borderRadius: 3,
  },
  buttonView: {
		height: 40,
		borderRadius: 3,
		backgroundColor: ColorConstants.TITLE_DARK_BLUE,
		justifyContent: 'center',
	},
	buttonText: {
		fontSize: 17,
		textAlign: 'center',
		color: '#ffffff',
	},
});

export default WithdrawSubmittedPage;
