'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Dimensions,
	Image,
	TextInput,
	Platform,
	TouchableOpacity,
} from 'react-native';

import LogicData from '../LogicData';
import NavBar from "./component/NavBar";

import { setNickName } from '../redux/actions'
import { connect } from 'react-redux';
//var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var LS = require("../LS")

var {height, width} = Dimensions.get('window');
class ErrorMsg extends Component{
	constructor(prop){
		super(prop);
	}

	render(){
		if(this.props.showView){
			return (
				<View style={styles.errorMsg}>
						<Image source={require('../../images/error_dot.png')} style={[styles.errorDot]}/>
						<Text style={styles.errorText}>{this.props.showText}</Text>
				</View>
			);
		}else {
			return(
				<View></View>
			);
		}
	}

}

// create a component
class MeSettingNicknameScreen extends Component {

	constructor(props){
		super(props);

		console.log("this.props.nickname", this.props)
		this.state = {
			isShowError:false,
			errorText: LS.str("ERROR_HINT"),
			nickName:this.props.nickname,
		}
	}

	componentWillReceiveProps(props){
		if(this.props.nickname != props.nickname){
			this.props.navigation.goBack(null)
		}
	}

	onComplete(){
		//Check if the new value is valid.
		console.log("this.state.nickname", this.state.nickName)
		if(!this.state.nickName || this.state.nickName.length==0 ){
			this.setState({
				isShowError:true,
				errorText:LS.str("ACCOUNT_NAME_CANNOT_BE_EMPTY"),
			});
			return;
		}else if(this.state.nickName.length > UIConstants.MAX_NICKNAME_LENGTH){
			this.setState({
				isShowError:true,
				errorText: LS.str("ACCOUNT_NAME_MAXINUM_LENGTH").replace("{1}", UIConstants.MAX_NICKNAME_LENGTH),
			});
			return;
		}

		this.props.setNickName(this.state.nickName)
	}

	setNickName(text){
		console.log("nickname: " + text);
		this.setState({
			nickName: text
		});
	}

	render() {
		return (
			<View style={{flex:1,backgroundColor:'white'}}>

				 {this.renderHeader()}

				 <TextInput style={styles.nickNameInputView}
					onChangeText={(text) => this.setNickName(text)}
					placeholder={LS.str("ACCOUNT_NAME_INPUT_HINT")}
					placeholderTextColor='grey'
					maxLength={UIConstants.MAX_NICKNAME_LENGTH}
					value={this.state.nickName}/>

				<View style={styles.line}>
					<View style={[styles.separator, {marginLeft: 15, marginRight: 15}]}/>
				</View>

				<ErrorMsg
					showView={this.state.isShowError} 
					showText={this.state.errorText}/>
			</View>
		);
	}

	renderHeader(){
		return (
			<NavBar
				showBackButton={true}
				titleStyle={{fontSize:18}}
				title={LS.str("ACCOUNT_NAME_TITLE")}
				subTitleStyle={styles.subTitle}
				textOnRight={LS.str("FINISH")}
				rightPartOnClick={()=>this.onComplete()}
				navigation={this.props.navigation}/>
		)
	}
	
}

// define your styles
const styles = StyleSheet.create({
	nickNameInputView:{
		color:'#303030',
		height:64,
		backgroundColor:'transparent',
		marginLeft: 15,
	},

	line: {
		height: 0.5,
		backgroundColor: 'white',
	},

	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	errorDot: {
		width: 16,
		height: 16,
 		marginLeft: 15,
	},

	errorText:{
		fontSize:12,
		color:'red',
		marginLeft:10
	},

	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: 'white',
		marginRight:10,
	},

	errorMsg:{
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10
	},

});


const mapStateToProps = state => {
    return {
		...state.meData,
		...state.settingsReducer,
    };
};
  
const mapDispatchToProps = {
	setNickName
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MeSettingNicknameScreen);