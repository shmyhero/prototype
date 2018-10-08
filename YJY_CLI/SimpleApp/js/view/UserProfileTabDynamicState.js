import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ListView,
  TouchableOpacity,
  Image,
  Alert,
	ImageBackground
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import LogicData from '../LogicData';
import ViewKeys from '../ViewKeys';
import TweetBlock from './tweet/TweetBlock';
import CustomStyleText from './component/CustomStyleText';
import NetworkErrorIndicator from './component/NetworkErrorIndicator';
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var UIConstants = require("../UIConstants");
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var listRawData = [
] 
var LS=require('../LS')

export default class  UserProfileTabDynamicState extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }
 
  constructor(props){
		super(props);
		this.state = {
			// listRawData: ds.cloneWithRows(listResponse),
			// listResponse: listResponse,
			noMessage: false,
			contentLoaded: false,
			isRefreshing: false,
			trendId:undefined,
		}
	}
	
	refresh(){
		this.loadData()
	}
  
  onPressedEditView(){
    this.props.navigation.navigate(ViewKeys.SCREEN_TWEET, {
			onPopOut:()=>this.refresh()
		});
	}
	
	tabPressed(index){
		console.log('UserProfileTabDynamicState tabPressed')
		this.loadData()
	}
	 /*
	 { id: 9,
		userId: 0,
		time: '2018-03-08T04:00:46.243',
		text: '123123213123123',
		likeCount: 0 },
	{ id: 8,
		userId: 0,
		time: '2018-03-08T03:53:13.827',
		text: '<a href="cfd://page/stock/34781">加元/日元</a> Test',
		likeCount: 0 },
	{ id: 7,
		userId: 0,
		time: '2018-03-08T03:36:40.763',
		text: 'Test4',
		likeCount: 0 },
	{ id: 6,
		userId: 0,
		time: '2018-03-08T03:36:13.033',
		text: 'Test2',
		likeCount: 0 },
	{ id: 5,
		userId: 0,
		time: '2018-03-08T03:29:38.68',
		text: 'Test2',
		likeCount: 0 },
	 */
	loadData(){   
      var url = NetConstants.CFD_API.USER_DYNAMIC_LIST
      url = url.replace('<id>',this.props.userId)
      console.log('url='+url);
      this.setState({
					isDataLoading: true,
					isRefreshing: true,
      }, ()=>{
          NetworkModule.fetchTHUrl(
            url,
              {
                  method: 'GET', 
                  showLoading: true,
              }, (responseJson) => { 
                   this.setState({ 
										listRawData: ds.cloneWithRows(responseJson),
										listResponse: responseJson,
										contentLoaded: true,
										isRefreshing: false
                   })  
              },
              (exception) => {
								this.setState({
									isRefreshing: false
								});
              }
          );
      })  
  } 

  renderEditView(){ 
		  if(LogicData.isUserSelf(this.props.userId)){
				return(
						<TouchableOpacity style={styles.editView} onPress={()=>this.onPressedEditView()}>
								<Image style={{width:48,height:48}} source={require('../../images/icon_edit.png')}/>
						</TouchableOpacity>
				) 
			}else{
				return null
			} 
  }

  renderList(){		
		return (
			<View style={{flex:1}}>
				<ListView
					contentContainerStyle={styles.list}
					dataSource={this.state.listRawData}
					enableEmptySections={true}
					removeClippedSubviews={false}
					showsVerticalScrollIndicator={false}
					renderRow={this.renderRow.bind(this)} />
					{/* {this.renderPraiseModal()} */}
			</View>
		)	
  }
  
  emptyContent(){
		var emptyTip = LS.str("NO_DYNAMIC")  
		return(
			<View style={{flex:1,width:width,justifyContent:'center',alignItems:'center'}}>
				<CustomStyleText style={{color:'white',fontSize:14}}>{emptyTip}</CustomStyleText>
			</View>
		)
	}

  renderContent(){
		// console.log("listResponse" + this.state.listResponse.length)
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator onRefresh={()=>this.loadData()} refreshing={this.state.isRefreshing}/>
			)
		}else{
			if(this.state.listResponse&&this.state.listResponse.length>0){
				return this.renderList();
			}else{
				return this.emptyContent();
			}
		}
	}

  onPressedPraise(rowData){
     
			var userData = LogicData.getUserData();
			var url = NetConstants.CFD_API.DO_DYNAMIC_LIKE,
			url = url.replace('<id>',rowData.id)
			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'PUT',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					showLoading: true,
				}, (responseJson) => {					
					 
					this.setState({
						 
					})
				});
	 
  }

  onPressedShare(){

	}
	
	jump2Detail(name, id){ 
		this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, 
				{stockCode: id, stockName: name, backFrom: this.props.navigation.state.key});
	}
  

  renderRow(rowData,sectionID,rowID){
		console.log("renderRow"+rowData.id+"======"+rowData.message)
		var liked = rowData.Liked
		var iconPraise = liked?require('../../images/icon_praised.png'):require('../../images/icon_praise.png')
		var textPraise = liked?{color:'#1962dd'}:{}
		var strFX = LS.str('SHARE')

		var d = new Date(rowData.time);
		var timeText = d.getDateString()
				
		return(
			<View style={styles.itemLine}> 
			  <View style={{width:width-20,paddingRight:24}}>  
				<CustomStyleText style={styles.timeStyle}>{timeText}</CustomStyleText>
					<TweetBlock
							style={{fontSize:15,color:'#999999',lineHeight:18}}
							value={rowData.text}
							onBlockPressed={(name, id)=>{this.jump2Detail(name, id)}}/>
					  
					{/* <View style = {styles.itemOperator}>
						<View style={styles.separator}></View>
							<View style={{flexDirection:'row'}}>
								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedPraise(rowData)}>
										 <Image style={styles.iconOperator} source={iconPraise}/>
										 <CustomStyleText style={[styles.textOperator,textPraise]}>{rowData.likeCount}</CustomStyleText>
								</TouchableOpacity>
								<View style={styles.operatorSepator}/> 

								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedShare(rowData)}>
										<Image style={styles.iconOperator} source={require('../../images/icon_share.png')}/>
										<CustomStyleText style={styles.textOperator}>{strFX}</CustomStyleText>
								</TouchableOpacity>
							</View>
						<View style={styles.separator}></View>
					</View> */}
				</View> 
			</View>
	 	);
	}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topHead}/>
        <View style={styles.content}>
          {this.renderContent()}
          {this.renderEditView()}
        </View>
      </View> 
    );
  }
}

const styles = StyleSheet.create({
   	container:{
      	flex:1,
		marginTop:10,
   	},
   	topHead:{
		height:40,
	},
   content:{
		marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
		marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
		flex:1,
		width:width-UIConstants.ITEM_ROW_MARGIN_HORIZONTAL * 2,
		marginTop:-60,
		backgroundColor:'transparent'
	},
	separator: {
		height: 0.5,
		backgroundColor: '#f0f0f0',
	},

	editView:{
		width:48,
		height:48,
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		top:height - 220 - 120,//220是ViewPage以上的部分
		left:width*3/4,
	}, 
	list:{
		// marginLeft:5, 
		// marginRight:5, 
		justifyContent: 'flex-start',
		flexWrap:'wrap',
		paddingTop:25, 
		paddingBottom:24,
	},
	itemLine:{ 
		flexDirection:'row',
		backgroundColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG,
		paddingLeft:10,
		paddingRight:10,
		paddingBottom:8, 
		borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS, 
		marginBottom: UIConstants.ITEM_ROW_MARGIN_VERTICAL, 
	},
	itemOperator:{
		height:32,
		marginTop:10,
		paddingRight:10,
	},
	operatorItem:{
		flex:1,
		height:30,
		margin:1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center'
	},
	operatorSepator:{
		height:24,
		backgroundColor:'#f0f0f0',
		alignSelf:'center',
		width:0.5
	},
	textStyle:{
		lineHeight:18,
		fontSize:14,
		color:'#333333',
	},
	timeStyle:{
		fontSize:12,
		color:'#474747',
		marginTop:15,
		marginBottom:5,
	},
	iconOperator:{
		 width:16,
		 height:16,
	},
	textOperator:{
		fontSize:9,
		marginLeft:5,
		color:'#999999',
	},
	lineV:{
		width:1,
		backgroundColor:'#f0f0f0',

	}
})


module.exports = UserProfileTabDynamicState;

