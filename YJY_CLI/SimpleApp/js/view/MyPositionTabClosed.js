import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Button,
    View,
    ListView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform,
    Alert,
	LayoutAnimation,
	FlatList,
	ImageBackground,
} from 'react-native';

import NinePatchView from 'react-native-9patch-image';
//import ImageCapInset from 'react-native-image-capinsets';
import LogicData from "../LogicData";
import CustomStyleText from './component/CustomStyleText'; 
import NetworkErrorIndicator from "./component/NetworkErrorIndicator";

//import RefreshableFlatList from 'react-native-refreshable-flatlist';
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock') 
var {height, width} = Dimensions.get('window');
var UIConstants = require('../UIConstants');
var NetConstants = require('../NetConstants');
var NetworkModule = require('../module/NetworkModule');
var LS = require("../LS");



const SHADOW_LEFT = 7;
const SHADOW_TOP = 6;
const SHADOW_RIGHT = 7;
const SHADOW_BOTTOM = 25;
const OUTER_ROW_MARGIN_TOP = 0;

var extendHeight = 204
var rowHeight = 56
var perPageCount = 20;
var stockNameFontSize = Math.round(17*width/375.0)

const ROW_PADDING = 15

const PAGE_SIZE = 20;
const FOLLOW_ROW_HEIGHT = 50;

export default class  MyPositionTabClosed extends React.Component {
    static navigationOptions = {
        title: 'Home',
    }

	isLoadedAll = false
	currentTicks = 0
	isResetScroll = false
	scrollViewYOffset = 0
	
	pageNum = 1;
    
    constructor(props){
        super(props)
        this.state = this.getInitialState();
    }

	getInitialState(){
		return {
			stockInfoRowData: [],
			selectedRow: -1,
			contentLoaded: false,
			isRefreshing: false,
			errorMessage: "",
		}
	}

	onScroll(event){
		this.scrollViewYOffset = event.nativeEvent.contentOffset.y;
		if(this.isResetScroll && this.scrollViewYOffset == 0){
			this.isResetScroll = false;
			//BUGBUG: We need to move the following code to scroll to callback.
			if(!this.state.contentLoaded){
				this.setState({
					isRefreshing: true,
				});
			}
			this.loadClosedPositionInfo();
		}
	}

	loadClosedPositionInfo(onFinished) {
		var userData = LogicData.getUserData();

		this.setState({
			isDataLoading: true,
		}, ()=>{
			var url = NetConstants.CFD_API.CLOSED_POSITION_LIST + "?pageSize=" + PAGE_SIZE + "&pageNum=" + this.pageNum
			NetworkModule.fetchTHUrl(
				url,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					},
					showLoading: true,
					//cache: 'offline',
				}, (responseJson, isCache) => {
					//TODO: Use real data!!!!!
					// for (var i in responseJson){
					// 	responseJson[i].isFollowing = true;
					// 	responseJson[i].followingUser = "一个人"
					// 	responseJson[i].followingUserPortrit = "https://yjystorage.blob.core.chinacloudapi.cn/user-pic/default/5.jpg"
					// }
					//TODO: Use real data!!!!!

					var newStockInfoRowData;
					if(this.pageNum == 1){
						newStockInfoRowData = responseJson;
					}else{
						if(!isCache){
							//Real data! Refresh the data
							for(var i = 0; i < responseJson.length; i++){
								var dataExisted = false;
								for(var j = 0; j < this.state.stockInfoRowData.length; j++){
									if(responseJson[i].id == this.state.stockInfoRowData[j].id){
										this.state.stockInfoRowData[j] = responseJson[i];
										dataExisted = true;
									}
								}
								if(!dataExisted){
									this.state.stockInfoRowData.concat(responseJson[i])
								}
							}
							newStockInfoRowData = this.state.stockInfoRowData;
						}else{
							newStockInfoRowData = this.state.stockInfoRowData.concat(responseJson);
						}
					}

					this.setState({
						stockInfoRowData: newStockInfoRowData,
						isDataLoading: false,
						contentLoaded: true,
						hasMore: !(responseJson.length < PAGE_SIZE)
					}, ()=>{
						if(!isCache){
							this.pageNum++;
							onFinished && onFinished();
						}
					})
				},
				(exception) => {
					this.setState({
						errorMessage: exception.errorMessage,
						isDataLoading: false,
					})
				}
			);
		});
	}
	
	refresh(){
		this.pageNum = 1;

		if(LogicData.isLoggedIn()){
			this.loadClosedPositionInfo()
		}else{
			this.setState(this.getInitialState());
		}
	}

	loadClosedPositionInfoWithLastDateTime(dateTime, count) {
		var url = NetConstants.CFD_API.CLOSED_POSITION_LIST		
		url = url + "?closedBefore=" + dateTime + "&count=" + count


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
				var stockInfoRowData = this.state.stockInfoRowData.concat(responseJson);
				this.setState({
					stockInfoRowData: stockInfoRowData,
				}, ()=>{
					this.endNextPageLoadingState(responseJson.length < count);
				})		
			},
			(exception) => {
				//alert(exception.errorMessage)
			}
		);
	}

	endNextPageLoadingState(endLoadMore){
		console.log("endLoadMore " + endLoadMore)
		if(this.isLoadedAll != endLoadMore){
			this.isLoadedAll = endLoadMore;
			this._pullToRefreshListView.endLoadMore(endLoadMore);
		}
	}

	onLoadMore() {
		if(this.state.stockInfoRowData && this.state.stockInfoRowData.length>0){
			var lastItem = this.state.stockInfoRowData[this.state.stockInfoRowData.length-1];
			var dateTime = lastItem.closedAt;

			this.loadClosedPositionInfoWithLastDateTime(dateTime, perPageCount);
		}
	}

	stockPressed(rowData, rowID) {
		//var contentLength = this._pullToRefreshListView._scrollView.getMetrics().contentLength;
		// if (rowHeight === 0) {
		// 	rowHeight = contentLength/this.state.stockInfoRowData.length
		// }

		var newData = []
		$.extend(true, newData, this.state.stockInfoRowData)	// deep copy

		if (this.state.selectedRow == rowID) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			newData[rowID].hasSelected = false
			this.setState({
				stockInfoRowData: newData,
				selectedRow: -1,
			},()=>{				
			});
		} else {
			if(Platform.OS === 'ios'){
				//Do not set delete animation, or the some row will be removed if clicked quickly.
				var animation = {
					duration: 700,
					create: {
						type: 'linear',
						property: 'opacity',
					},
					update: {
						type: 'spring',
						springDamping: 0.4,
						property: 'scaleXY',
					},
				}
				LayoutAnimation.configureNext(animation);//LayoutAnimation.Presets.spring);
			}
			newData[rowID].hasSelected = true
			this.setState({
				stockInfoRowData: newData,
				selectedRow: rowID,
			}, ()=>{
				this.scrollToCurrentSelectedItem(rowID, 1)
			})
		}
	}

	scrollToCurrentSelectedItem(selectedRow, viewPosition){
		setTimeout(()=>{
			this._pullToRefreshListView.scrollToIndex({
				index: selectedRow, 
				animated: true, 
				viewPosition:viewPosition,
				viewOffset:0,
			});
		}, 100);
	}

	renderFooter(viewState) {
		let {pullState, pullDistancePercent} = viewState
		let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
		pullDistancePercent = Math.round(pullDistancePercent * 100)
		switch(pullState) {
			case load_more_none:
			case load_more_idle:
			case will_load_more:
				return (
					<View style={{height: 35, justifyContent: 'center', alignItems: 'center'}}>
						<CustomStyleText style={styles.refreshTextStyle}>{LS.str("LOAD_MORE")}</CustomStyleText>
					</View>
				)
			case loading_more:
				return (
					<View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
						<CustomStyleText style={styles.refreshTextStyle}>{LS.str("DATA_LOADING")}</CustomStyleText>
					</View>
				)
			case loaded_all:
				return (
					<View/>
				)
		}
	}

	renderActivityIndicator(){
		var color = "#7a7987";
		var styleAttr = 'small' //or "large"
		return (
			<CustomStyleText style={{color:color}}>
				{LS.str("DATA_LOADING")}
			</CustomStyleText>
			// <WaitingRing color={color} styleAttr={styleAttr}/>
		);
	}

	renderCountyFlag(rowData) {
		if (rowData.tag !== undefined) {
			return (
				<View style={styles.stockCountryFlagContainer}>
					<CustomStyleText style={styles.stockCountryFlagText}>
						{rowData.tag}
					</CustomStyleText>
				</View>
			);
		}
	}

	renderProfit(pl, color) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		pl = pl.toFixed(2)
		var add = (pl > 0)?'+':'';

		return (
			<CustomStyleText style={[styles.stockPercentText, {color: color, fontSize:textSize}]}>
				 {add}{pl}
			</CustomStyleText>
		);
	}

	renderProfitPercentage(percentChange, color) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		var add = (percentChange > 0)?'+':'';
		return (
		<CustomStyleText style={[styles.stockPercentText, {color: color, fontSize:textSize}]}>
		  			 {add}{percentChange} %
		</CustomStyleText>
		)

		// if (percentChange > 0) {
		// 	return (
		// 		<CustomStyleText style={[styles.stockPercentText, {color: '#f19296', fontSize:textSize}]}>
		// 			 +{percentChange} %
		// 		</CustomStyleText>
		// 	);
		// } else if (percentChange < 0) {
		// 	return (
		// 		<CustomStyleText style={[styles.stockPercentText, {color: '#82d2bb', fontSize:textSize}]}>
		// 			 {percentChange} %
		// 		</CustomStyleText>
		// 	);
		//
		// } else {
		// 	return (
		// 		<CustomStyleText style={[styles.stockPercentText, {color: '#c5c5c5', fontSize:textSize}]}>
		// 			 {percentChange} %
		// 		</CustomStyleText>
		// 	);
		// }
	}

	renderDetailInfo(rowData, rowHeight) {
		var tradeImage = rowData.isLong ? require('../../images/stock_detail_direction_up_disabled.png') : require('../../images/stock_detail_direction_down_disabled.png')

		var openDate = new Date(rowData.createAt)
		console.log("rowData.createAt ", rowData.createAt);
		console.log("openDate ", openDate);
		var closeDate = new Date(rowData.closedAt)
		console.log("closeDate ", closeDate);

		return (
			<View style={[{height: rowHeight}, styles.extendWrapper]} >
				<View style={[styles.darkSeparator]} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_TYPE")}</CustomStyleText>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<CustomStyleText style={styles.extendTextTop}>
						{LS.str("ORDER_SUGAR_AMOUNT").replace("{1}", LS.getBalanceTypeDisplayText())}
						</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{rowData.invest && rowData.invest.toFixed(2)}</CustomStyleText>
					</View>
					<View style={styles.extendRight}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_MULTIPLE")}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{"x"+rowData.leverage}</CustomStyleText>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_OPEN_PRICE")}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{rowData.settlePrice.maxDecimal(5)}</CustomStyleText>
					</View>
					<View style={styles.extendMiddle}>
						
					</View>
					<View style={styles.extendRight}>
						<CustomStyleText style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</CustomStyleText>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("ORDER_CLOSE_PRICE")}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{rowData.closePrice.maxDecimal(5)}</CustomStyleText>
					</View>
					<View style={styles.extendMiddle}>
					</View>
					<View style={styles.extendRight}>
						<CustomStyleText style={styles.extendTextTop}>{closeDate.Format('yy/MM/dd')}</CustomStyleText>
						<CustomStyleText style={styles.extendTextBottom}>{closeDate.Format('hh:mm')}</CustomStyleText>
					</View>
				</View>
				{rowData.followUser ? <View style={styles.darkSeparator} /> : null}
				{this.renderFollowRow(rowData)}
			</View>
		);
	}

	renderFollowRow(rowData){
		if(rowData.followUser){
			return (
				<View style={[styles.rowWrapper, {height:FOLLOW_ROW_HEIGHT, justifyContent:'center', alignItems:'center'}]}>
					<View style={{justifyContent:'center', alignItems:'center'}}>
						<CustomStyleText style={styles.extendTextTop}>{LS.str("POSITION_COPY_TRADE").replace("{1}", rowData.followUser.nickname)}</CustomStyleText>					
						<Image source={{uri:rowData.followUser.picUrl}} 
							style={{height:20,width:20, borderRadius:10}}></Image>
					</View>
					{/* <ImageBackground style={{height:25,width:25 / 84 * 140}} source={require('../../images/bg_btn_blue.png')}>
						<View style={{justifyContent:'center', alignItems:'center', flex:1}}>
						<CustomStyleText style={{color:'white', fontSize:10}}>{LS.str("COPY_TRADE")}</CustomStyleText>
						</View>
					</ImageBackground> */}
				</View>
			)
		}else{
			return null;
		}
	}

	renderFollowStatus(rowData){
		if(rowData.followUser){
			var statusTxt = LS.str("COPY_TRADE")
			return(
				<Image source={LS.loadImage("position_follow_closed")} 
					style={styles.followIcon} resizeMode="contain"/>
			)
		}else{
			return null;
		}
	}

	renderItem(data) {
		var rowData = data.item;
		var rowID = data.index;

		var plPercent = (rowData.closePrice - rowData.settlePrice) / rowData.settlePrice * rowData.leverage * 100
		plPercent = plPercent * (rowData.isLong ? 1 : -1)
		var topLine = rowData.security.name
		var bottomLine = rowData.security.symbol
		var additionalStyle = {}
		var additionalOuterStyle = {};
		if(rowID == 0){
			additionalOuterStyle.marginTop = UIConstants.ITEM_ROW_MARGIN_VERTICAL - SHADOW_TOP;
			additionalStyle.marginTop = SHADOW_TOP;
		}
		if(this.state.stockInfoRowData && rowID == this.state.stockInfoRowData.length-1){
			additionalOuterStyle.marginBottom = UIConstants.ITEM_ROW_MARGIN_VERTICAL - SHADOW_BOTTOM;
			additionalStyle.marginBottom = SHADOW_BOTTOM;
		}

		var rowHeight = UIConstants.ITEM_ROW_HEIGHT + SHADOW_TOP + SHADOW_BOTTOM;
		var rowWidth = width - UIConstants.ITEM_ROW_MARGIN_HORIZONTAL * 2 + SHADOW_LEFT + SHADOW_RIGHT;
		var extendedRowHeight = rowData.followUser ? extendHeight + FOLLOW_ROW_HEIGHT : extendHeight
		if(this.state.selectedRow == rowID ){
			rowHeight += extendedRowHeight;
		}

		var color = ColorConstants.stock_color(rowData.pl);
		return (
			<View style={[styles.outerRowContainer, additionalOuterStyle]}>

				{/* if(Platform.OS =="ios")
					<ImageCapInset
					source={require('../../images/row_background.png')}
					capInsets={{ top: 15, left: 12, bottom: 28, right: 13}}
					style={{position:'absolute', top:0, left:0, bottom:0, right:0, height: rowHeight, width:rowWidth}}/> */}
				<NinePatchView
					style={{height: rowHeight, width:rowWidth, position:'absolute', top:0, left:0, bottom:0, right:0,}}
                    source={Platform.OS === 'android' ? {uri: 'row_background'} : require('../../images/row_background.png')}
                    capInsets={{top: 30, left: 40, bottom: 55, right: 26}}/>
				<View style={[styles.rowContainer, additionalStyle]}>
					<TouchableOpacity style={{height:UIConstants.ITEM_ROW_HEIGHT/* - 2*/, justifyContent:'center'}} activeOpacity={1} onPress={() => this.stockPressed(rowData, rowID)}>				
						<View style={[styles.rowWrapper]} key={rowData.key}>
							<View style={styles.rowLeftPart}>
								<CustomStyleText style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
									{topLine}
								</CustomStyleText>
							</View>

							<View style={{flexDirection: 'row', alignItems: 'center', 
								position:'absolute',
								bottom: 5,
								left: UIConstants.ITEM_ROW_MARGIN_HORIZONTAL}}>
								{this.renderFollowStatus(rowData)}
							</View>

							<View style={styles.rowCenterPart}>
								{this.renderProfit(rowData.pl, color)}
							</View>

							<View style={styles.rowRightPart}>
								{this.renderProfitPercentage(plPercent, color)}
							</View>
						</View>
					</TouchableOpacity>

					{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData, extendedRowHeight): null}
				</View>
			</View>
		);
	}

	renderLoadingText() {
		if(this.state.stockInfoRowData.length === 0) {
			if(this.state.isDataLoading){
				return (
					<View style={styles.loadingTextView}>
						<CustomStyleText style={styles.loadingText}>{LS.str("DATA_LOADING")}</CustomStyleText>
					</View>
				);
			}else{
				return (
					<View style={styles.loadingTextView}>
						<CustomStyleText style={styles.loadingText}>{LS.str("POSITION_CLOSED_NO_ITEMS")}</CustomStyleText>
					</View>
					)
			}
		}
	}

	renderContent(){
		if(!this.state.contentLoaded){
			return (
				<NetworkErrorIndicator
					isBlue={false}
					onRefresh={()=>this.loadClosedPositionInfo()}
					refreshing={this.state.isDataLoading}/>
			)
		}else{
			var pullUpDistance = 35;
			var pullUpStayDistance = 35;

			return (<View style={{flex:1}}>
				{this.renderLoadingText()}
				{/* <RefreshableFlatList */}
				<FlatList
					style={styles.list}
					ref={ (component) => this._pullToRefreshListView = component }
					keyExtractor={(item, index) => index}
					data={this.state.stockInfoRowData}
					enableEmptySections={true}
					// renderFooter={(viewState)=>this.renderFooter(viewState)}
					pageSize={20}
					renderItem={(data)=>this.renderItem(data)}
					autoLoadMore={true}
					enabledPullDown={true}
					onEndReachedThreshold={30}
					onScroll={(event)=>this.onScroll(event)}
					onRefresh={()=>this.refresh()}
					refreshing={this.state.isRefreshing}
					onLoadMore={()=>this.onLoadMore()}
					pullUpDistance={pullUpDistance}
					pullUpStayDistance={pullUpStayDistance}					
					onEndReached={()=>{this.loadClosedPositionInfo();}}
					// showBottomIndicator={!this.state.isRefreshing}
					// showBottomIndicator={this.state.hasMore}
					// topPullingPrompt="下拉刷新数据"
					// topHoldingPrompt="下拉刷新数据"
					// topRefreshingPrompt="刷新数据中..."
					// bottomPullingPrompt="下拉载入更多"
					// bottomHoldingPrompt="下拉载入更多"
					// bottomRefreshingPrompt="载入数据中..."
				/>
			</View>);
		}
	}

	render() {
		return (
			<View flex={1}>
				{this.renderContent()}
			</View>
		)
	}
}

var styles = StyleSheet.create({
	list: {
		alignSelf: 'stretch',
	},

	line: {
		height: 0.5,
		backgroundColor: 'white',
	},

	separator: {
		marginLeft: 15,
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},

	outerRowContainer:{		
		marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL - SHADOW_LEFT,
		marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL - SHADOW_RIGHT,
		marginTop: OUTER_ROW_MARGIN_TOP - SHADOW_TOP,
        marginBottom: UIConstants.ITEM_ROW_MARGIN_VERTICAL - OUTER_ROW_MARGIN_TOP - SHADOW_BOTTOM,
	},

	rowContainer: {
        // borderWidth:1,
        // borderColor:"#cccccc",
		borderRadius:10,
		//backgroundColor:"red",
		marginLeft: SHADOW_LEFT,
		marginRight: SHADOW_RIGHT,
		marginTop: SHADOW_TOP,
        marginBottom: SHADOW_BOTTOM,
    },

	rowWrapper: {
		height: rowHeight,
		flexDirection: 'row',
		alignSelf: 'stretch',
		alignItems: 'center',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 10,
		paddingTop: 10,
	},

	stockCountryFlagContainer: {
		backgroundColor: '#00b2fe',
		borderRadius: 2,
		paddingLeft: 3,
		paddingRight: 3,
		marginRight: 6,
	},

	stockCountryFlagText: {
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
	},

	rowLeftPart: {
		flex: 3,
		alignItems: 'flex-start',
		paddingLeft: 0,
	},

	rowCenterPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 5,
		alignItems: 'flex-end',
	},

	rowRightPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 0,
		alignItems: 'flex-end',
	},

	stockNameText: {
		fontSize: stockNameFontSize,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
		color: '#505050',
	},

	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
	},

	stockPercentText: {
		fontSize: 18,
		color: '#ffffff',
		fontWeight: 'normal',
	},

	darkSeparator: {
		height: 0.5,
		backgroundColor: '#dfdfdf',
	},

	extendWrapper: {
		alignItems: 'stretch',
		justifyContent: 'space-around',
		paddingLeft: ROW_PADDING,
		paddingRight: ROW_PADDING,
	},

	extendRowWrapper: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
		height: 51,
	},

	extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendMiddle: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 8,
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		paddingTop: 8,
		paddingBottom: 8,
	},

	extendTextTop: {
		fontSize:14,
		color: '#7d7d7d',
	},
	extendTextBottom: {
		fontSize:13,
		color: 'black',
		marginTop: 5,
	},
	extendImageBottom: {
		width: 24,
		height: 24,
	},

	loadingTextView: {
		position: 'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		alignItems: 'center',
		justifyContent: 'center',
	},

	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

	refreshTextStyle: {
		color: '#afafaf',
	},

	followIcon:{
		width:23,
		height:12,
	},
});

module.exports = MyPositionTabClosed;


