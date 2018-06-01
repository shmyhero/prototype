'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Text,
	Image,
	TouchableOpacity,
	Alert,
	ScrollView,
	Linking,
	Platform, 
	Switch,
} from 'react-native' 

import LogicData from "../LogicData";
import NavBar from './component/NavBar';
var ColorConstants = require('../ColorConstants') 
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var LS = require("../LS");

const FOCUS_FOLLOW = 0
const FOCUS_TRADE_FOLLOW = 1
const FOCUS_SYSTEM = 2

var listRawData = [ 
	{type:FOCUS_FOLLOW,"title":LS.str('WATCHLIST'),"desciption":'关注用户的交易动态'},
	{type:FOCUS_TRADE_FOLLOW,"title":LS.str('COPIERS'),"desciption":'自己的交易动态'},
	{type:FOCUS_SYSTEM,"title":LS.str('NEWS'),"desciption":'系统推送的每日资讯'},
] 
var {height, width} = Dimensions.get('window')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var MyPie = require('./component/Pie/MyPie')


	//  showFollowing: true, 关注的用户
	// 	showTradeFollowing: true, 跟随的用户
	// 	showHeadline: true 平台资讯
 
export default class DynamicStatusConfig extends Component {
 

	constructor(props){
		super(props);
		this.state = { 
			showFollowing:false,
			showTradeFollowing:false,
			showHeadline:false,
			dataSource: ds.cloneWithRows(listRawData),
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
		  <View style={styles.line} key={rowID}>
			<View style = {styles.separator}></View>
		  </View>
		);
	}

	componentDidMount(){
		this.loadLiveFilter()
	}

	onSwitchPressed(value,rowData){
		if(rowData.type == FOCUS_FOLLOW){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showFollowing: value
			})
		}else if(rowData.type == FOCUS_TRADE_FOLLOW){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showTradeFollowing: value
			})
		}
		else if(rowData.type == FOCUS_SYSTEM){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showHeadline: value
			})
		}
	}

	renderRow(rowData, sectionID, rowID){
		var switchIsOn = false;

		if(rowData.type == FOCUS_TRADE_FOLLOW){
			switchIsOn = this.state.showTradeFollowing
		}else if(rowData.type == FOCUS_FOLLOW){
			switchIsOn = this.state.showFollowing
		}else if(rowData.type == FOCUS_SYSTEM){
			switchIsOn = this.state.showHeadline
		}
		

		return(
			<View style={styles.viewWapper}>
				<View style={styles.leftWapper}>
					<Text style={styles.titleText}>{rowData.title}</Text>
					{/* <Text style={styles.desciptionText}>{rowData.desciption}</Text> */}
				</View> 
				<Switch
					onValueChange={(value) => this.onSwitchPressed(value, rowData)}
					value={switchIsOn}
					onTintColor={ColorConstants.BGBLUE} />
			</View>
			
		) 
	}
 
	loadLiveFilter() { 
		var userData = LogicData.getUserData()
		
		if(LogicData.isLoggedIn()){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_DYNAMIC_CONFIG_FILTER,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},  
				},
				(responseJson) =>{ 
					this.setState(
						{ 
							showFollowing:responseJson.showFollowing,
							showTradeFollowing:responseJson.showTradeFollowing,
							showHeadline:responseJson.showHeadline, 
							dataSource: ds.cloneWithRows(listRawData),
						}
					)
				}
			)
		}
	} 

	setLiveFilter(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.PUT_DYNAMIC_CONFIG_FILTER_SETTING,
				{
					method: 'PUT',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					}, 
					body: JSON.stringify({
						showTradeFollowing: this.state.showTradeFollowing,
						showFollowing: this.state.showFollowing,
						showHeadline: this.state.showHeadline, 
					}),
				},
				(responseJson) =>{ 
					this.props.navigator.pop();
					if(this.props.onPopOut){
						this.props.onPopOut()
					}
				}
			)
		}
	} 

	onCompleted(){ 
		this.setLiveFilter() 
		this.props.navigation.goBack();
		if(this.props.navigation.state.params.onGoBack){
			this.props.navigation.state.params.onGoBack();
		} 
	}

	render(){
		return(
			<View style={{backgroundColor:'#FFFFFF',flex:1,width:width}}>
				<NavBar title={LS.str('DYNAMIC_SETTING')} showBackButton={true} 
				rightPartOnClick={()=>this.onCompleted()}
				navigation={this.props.navigation} textOnRight={LS.str('FINISH')}/>
			 	<ListView 
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					renderSeparator={this.renderSeparator} /> 
			</View>
		 ) 
	}


}

var styles = StyleSheet.create({
	list:{

	},
	viewWapper:{
		height:60,
		width:width, 
		paddingLeft:15,
		paddingRight:15,
		flexDirection:'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	leftWapper:{
		justifyContent:'center'
	},
	titleText:{
		fontSize:15, 
		marginBottom:2.5,
		color:'black'
	},
	desciptionText:{
		fontSize:13,
		color:'grey'
	},
	separator: {
		height: 0.5,
		backgroundColor: '#eeeeee',
    	marginLeft:15,
	  },
	line: {
		height: 0.5,
		backgroundColor: 'white',
   		marginLeft:0,
	},
});


module.exports = DynamicStatusConfig;
