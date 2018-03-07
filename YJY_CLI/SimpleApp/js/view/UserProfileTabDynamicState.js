import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ListView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import LogicData from '../LogicData';
var ColorConstants = require('../ColorConstants');
var {height, width} = Dimensions.get('window');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var listRawData = [
]
var listResponse = [ 
  {Liked:false,likes:9,rewardCount:10,createdAt:'2017.10.12 20.20',message:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续加大，可以适当买涨黄金，杠杆在10-20倍左右，2018年预全球不稳定因素继续加大，可以适当买涨黄金，杠杆在10-20倍左右，2018年预全球不稳定因素继续加大稳定因素继续加大，可以适当买涨黄金，杠杆在10-20倍左右，2018年预计增长20%收益。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
  {Liked:false,likes:1,rewardCount:4,createdAt:'2017.10.11 10.20',message:'@美国科技股100，由于税改赠策的落地，建议继续买涨，杠杆在10倍左右，同时设置好止损。'},
]



export default class  UserProfileTabDynamicState extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }
 
  constructor(props){
		super(props);
		this.state = {
			listRawData: ds.cloneWithRows(listResponse),
			listResponse: listResponse,
			noMessage: false,
			contentLoaded: false,
			isRefreshing: false,
			trendId:undefined,
		}
  }
  
  onPressedEditView(){
    Alert.alert('发动态')
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
		var emptyTip = '暂无动态'   
		return(
			<View style={{flex:1,width:width,justifyContent:'center',alignItems:'center'}}>
				<Text style={{color:'grey',fontSize:14}}>{emptyTip}</Text>
			</View>
		)
	}

  renderContent(){
		// console.log("listResponse" + this.state.listResponse.length)
		if(this.state.listResponse&&this.state.listResponse.length>0){
			return this.renderList();
		}else{
			return this.emptyContent();
		}
	}

  onPressedPraise(){
    
  }

  onPressedShare(){

  }
  

  renderRow(rowData,sectionID,rowID){
		console.log("renderRow"+rowData.id+"======"+rowData.message)
		var liked = rowData.Liked
		var iconPraise = liked?require('../../images/icon_praised.png'):require('../../images/icon_praise.png')
		var textPraise = liked?{color:'#1962dd'}:{}
		var strFX = '分享'
		return(
			<View style={styles.itemLine}>
			  <View style={{width:width-20,paddingRight:24}}>
					<Text style={styles.timeStyle}>{rowData.createdAt}</Text>
					<Text style={{fontSize:15,color:'#999999'}}>{rowData.message}</Text>
 
					<View style = {styles.itemOperator}>
						<View style={styles.separator}></View>
							<View style={{flexDirection:'row'}}>
								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedPraise(rowData)}>
										 <Image style={styles.iconOperator} source={iconPraise}/>
										 <Text style={[styles.textOperator,textPraise]}>{rowData.likes}</Text>
								</TouchableOpacity>
								<View style={styles.operatorSepator}/> 

								<TouchableOpacity style={styles.operatorItem} onPress={()=>this.onPressedShare(rowData)}>
										<Image style={styles.iconOperator} source={require('../../images/icon_share.png')}/>
										<Text style={styles.textOperator}>{strFX}</Text>
								</TouchableOpacity>
							</View>
						<View style={styles.separator}></View>
					</View>
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
      backgroundColor:'white'
   },
   topHead:{
     backgroundColor:ColorConstants.BGBLUE,
     height:40,
   },
   content:{
    marginLeft:10,
    marginRight:10,
    flex:1,
    width:width-20,
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
		marginLeft:5, 
		marginRight:5, 
		justifyContent: 'flex-start',
    flexWrap:'wrap',
    paddingTop:24, 
    paddingBottom:24,
	},
	itemLine:{ 
    flexDirection:'row',
    backgroundColor:'white',
    paddingLeft:10,
    paddingRight:10,
    paddingBottom:8,
    borderWidth:1,
    borderRadius:16,
    borderColor:'#EEEEEE',
    marginBottom:16,
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

