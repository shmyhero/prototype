import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Button,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Image,
    Platform,
    Alert,
	LayoutAnimation,
	FlatList,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');
var PositionBlock = require('./component/personalPages/PositionBlock') 
var {height, width} = Dimensions.get('window');


var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
// var NetworkErrorIndicator = require('./NetworkErrorIndicator');
// var MainPage = require('./MainPage')
// var WaitingRing = require('./component/WaitingRing');
// var {EventCenter, EventConst} = require('../EventCenter');

var extendHeight = 204
var rowHeight = 56
var perPageCount = 20;
var stockNameFontSize = Math.round(17*width/375.0)


const ROW_PADDING = 15

export default class  MyPositionTabClosed extends React.Component {
    static navigationOptions = {
        title: 'Home',
    }

	isLoadedAll = false
	currentTicks = 0
	isResetScroll = false
    scrollViewYOffset = 0
    
    constructor(props){
        super(props)
        this.state = {
			stockInfoRowData: [],
			selectedRow: -1,
			isClear:false,
			contentLoaded: false,
			isRefreshing: false,
		};
    }

	componentDidMount() {
		this.loadClosedPositionInfo();
	}

	tabPressed(index) {
		var d = new Date();
		this.currentTicks = d.getTime();
		console.log("tabpressed ")

		this.onLayoutSizeChanged()
		this.setState({
			selectedRow: -1,
		})
		if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
			try{
				this.endNextPageLoadingState(false);
			}catch(e){
				console.log("Met error when clear closed position page!" + e)
			}
		}

		if(this.scrollViewYOffset != 0){
			//If current scrollview offset isn't 0, scroll to 0.
			if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
				console.log("tabPressed - scroll to top")
				this.isResetScroll = true;
				this._pullToRefreshListView._scrollView.scrollTo({x:0, y:0, animated:false})
			}
		}else{
			this.loadClosedPositionInfo();
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

	clearViews(){
		if(this._pullToRefreshListView && this._pullToRefreshListView._scrollView){
			try{
				this.endNextPageLoadingState(false);
				if(this.scrollViewYOffset != 0){
					this._pullToRefreshListView._scrollView.scrollTo({x:0, y:0, animated:false})
				}
			}catch(e){
				console.log("Met error when clear closed position page!" + e)
			}
		}

		this.setState({
			isClear:true,
			contentLoaded: false,
			isRefreshing: false,
			stockInfoRowData: [],
			selectedRow: -1,
		})
	}

	loadClosedPositionInfo() {
		//TODO: real data
		var stockInfo = [ { id: '141276020020',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'GBP',
		   isPriceDown: false,
		   dcmCount: 1,
		   id: 34854,
		   symbol: 'UKX',
		   name: 'UK 100 Rolling' },
		invest: 77.90612401152,
		isLong: true,
		leverage: 100,
		openPrice: 7148.8,
		closePrice: 7077.4,
		pl: -109.2950384,
		financingSum: -255.3176,
		dividendSum: 330.5088,
		hasCard: false,
		openAt: '2017-04-19T10:02:45.02',
		closeAt: '2018-02-05T21:10:53.863' },
	  { id: '143647788227',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 34857,
		   symbol: 'SPX',
		   name: 'US 500 Rolling' },
		invest: 49.99999879125,
		isLong: true,
		leverage: 100,
		openPrice: 2750.25,
		closePrice: 2722.75,
		pl: -50,
		financingSum: -13.3646,
		dividendSum: 2.9052,
		hasCard: false,
		openAt: '2018-01-10T02:22:24.09',
		closeAt: '2018-02-05T18:09:18.783' },
	  { id: '143179490158',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 1,
		   id: 34821,
		   symbol: 'GOLDS',
		   name: 'Gold' },
		invest: 72933.99995175,
		isLong: true,
		leverage: 1,
		openPrice: 1277.5,
		closePrice: 1244.3,
		pl: -1895.43,
		financingSum: -0.18,
		hasCard: false,
		openAt: '2017-11-16T07:49:42.813',
		closeAt: '2017-12-12T03:28:17.59' },
	  { id: '143179255908',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 3,
		   id: 34847,
		   symbol: 'SILV',
		   name: 'Silver' },
		invest: 73265.99996232,
		isLong: true,
		leverage: 1,
		openPrice: 17.028,
		closePrice: 16.951,
		pl: -331.31,
		hasCard: false,
		openAt: '2017-11-16T06:51:10.777',
		closeAt: '2017-11-16T07:03:06.44' },
	  { id: '143063920735',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 38289,
		   symbol: 'XBTUSD',
		   name: 'Bitcoin/USD' },
		invest: 30105.930056332,
		isLong: true,
		leverage: 3,
		openPrice: 7254.78,
		closePrice: 5836.04,
		pl: -17662.49,
		financingSum: -475.4723,
		hasCard: false,
		openAt: '2017-11-03T06:40:02.533',
		closeAt: '2017-11-13T05:07:36.417' },
	  { id: '142489407317',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'HKD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 34812,
		   symbol: '27 HK',
		   name: 'Galaxy Entertainment Group L' },
		invest: 1564.99999990612,
		isLong: true,
		leverage: 5,
		openPrice: 51.43,
		closePrice: 54.84,
		pl: 66.11274072,
		financingSum: -6.7036,
		hasCard: false,
		openAt: '2017-09-04T06:17:13.193',
		closeAt: '2017-11-07T01:30:49.25' } ];
		
		this.setState({
			stockInfoRowData: stockInfo,
		})
	}

	loadClosedPositionInfoWithLastDateTime(dateTime, count) {
		//TODO: real data
		var responseJson = [ { id: '141276020020',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'GBP',
		   isPriceDown: false,
		   dcmCount: 1,
		   id: 34854,
		   symbol: 'UKX',
		   name: 'UK 100 Rolling' },
		invest: 77.90612401152,
		isLong: true,
		leverage: 100,
		openPrice: 7148.8,
		closePrice: 7077.4,
		pl: -109.2950384,
		financingSum: -255.3176,
		dividendSum: 330.5088,
		hasCard: false,
		openAt: '2017-04-19T10:02:45.02',
		closeAt: '2018-02-05T21:10:53.863' },
	  { id: '143647788227',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 34857,
		   symbol: 'SPX',
		   name: 'US 500 Rolling' },
		invest: 49.99999879125,
		isLong: true,
		leverage: 100,
		openPrice: 2750.25,
		closePrice: 2722.75,
		pl: -50,
		financingSum: -13.3646,
		dividendSum: 2.9052,
		hasCard: false,
		openAt: '2018-01-10T02:22:24.09',
		closeAt: '2018-02-05T18:09:18.783' },
	  { id: '143179490158',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 1,
		   id: 34821,
		   symbol: 'GOLDS',
		   name: 'Gold' },
		invest: 72933.99995175,
		isLong: true,
		leverage: 1,
		openPrice: 1277.5,
		closePrice: 1244.3,
		pl: -1895.43,
		financingSum: -0.18,
		hasCard: false,
		openAt: '2017-11-16T07:49:42.813',
		closeAt: '2017-12-12T03:28:17.59' },
	  { id: '143179255908',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 3,
		   id: 34847,
		   symbol: 'SILV',
		   name: 'Silver' },
		invest: 73265.99996232,
		isLong: true,
		leverage: 1,
		openPrice: 17.028,
		closePrice: 16.951,
		pl: -331.31,
		hasCard: false,
		openAt: '2017-11-16T06:51:10.777',
		closeAt: '2017-11-16T07:03:06.44' },
	  { id: '143063920735',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'USD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 38289,
		   symbol: 'XBTUSD',
		   name: 'Bitcoin/USD' },
		invest: 30105.930056332,
		isLong: true,
		leverage: 3,
		openPrice: 7254.78,
		closePrice: 5836.04,
		pl: -17662.49,
		financingSum: -475.4723,
		hasCard: false,
		openAt: '2017-11-03T06:40:02.533',
		closeAt: '2017-11-13T05:07:36.417' },
	  { id: '142489407317',
		security: 
		 { minInvestUSD: 50,
		   ccy: 'HKD',
		   isPriceDown: false,
		   dcmCount: 2,
		   id: 34812,
		   symbol: '27 HK',
		   name: 'Galaxy Entertainment Group L' },
		invest: 1564.99999990612,
		isLong: true,
		leverage: 5,
		openPrice: 51.43,
		closePrice: 54.84,
		pl: 66.11274072,
		financingSum: -6.7036,
		hasCard: false,
		openAt: '2017-09-04T06:17:13.193',
		closeAt: '2017-11-07T01:30:49.25' } ]

		var stockInfoRowData = this.state.stockInfoRowData.concat(responseJson);
		this.setState({
			stockInfoRowData: stockInfoRowData,
		}, ()=>{
			this.endNextPageLoadingState(responseJson.length < count);
		})
		
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
			var dateTime = lastItem.closeAt;

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
						<Text style={styles.refreshTextStyle}>加载更多</Text>
					</View>
				)
			case loading_more:
				return (
					<View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center'}}>
						{this.renderActivityIndicator()}<Text style={styles.refreshTextStyle}>加载中...</Text>
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
			<Text style={{color:color}}>
				载入中...
			</Text>
			// <WaitingRing color={color} styleAttr={styleAttr}/>
		);
	}

	renderCountyFlag(rowData) {
		if (rowData.tag !== undefined) {
			return (
				<View style={styles.stockCountryFlagContainer}>
					<Text style={styles.stockCountryFlagText}>
						{rowData.tag}
					</Text>
				</View>
			);
		}
	}

	renderProfit(pl) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		pl = pl.toFixed(2)
		var add = (pl > 0)?'+':'';

		return (
			<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(pl), fontSize:textSize}]}>
				 {add}{pl}
			</Text>
		);
	}

	renderProfitPercentage(percentChange) {
		var {height, width} = Dimensions.get('window');
		var textSize = Math.round(18*width/375.0)
		percentChange = percentChange.toFixed(2)
		var add = (percentChange > 0)?'+':'';
		return (
		<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange), fontSize:textSize}]}>
		  			 {add}{percentChange} %
		</Text>
		)

		// if (percentChange > 0) {
		// 	return (
		// 		<Text style={[styles.stockPercentText, {color: '#f19296', fontSize:textSize}]}>
		// 			 +{percentChange} %
		// 		</Text>
		// 	);
		// } else if (percentChange < 0) {
		// 	return (
		// 		<Text style={[styles.stockPercentText, {color: '#82d2bb', fontSize:textSize}]}>
		// 			 {percentChange} %
		// 		</Text>
		// 	);
		//
		// } else {
		// 	return (
		// 		<Text style={[styles.stockPercentText, {color: '#c5c5c5', fontSize:textSize}]}>
		// 			 {percentChange} %
		// 		</Text>
		// 	);
		// }
	}

	renderDetailInfo(rowData) {
		var tradeImage = rowData.isLong ? require('../../images/stock_detail_direction_up_enabled.png') : require('../../images/stock_detail_direction_down_enabled.png')
		var profitColor = rowData.pl > 0 ? ColorConstants.STOCK_RISE_RED : ColorConstants.STOCK_DOWN_GREEN

		if (rowData.pl === 0) {
			profitColor = 'black'
		}
		var openDate = new Date(rowData.openAt)
		var closeDate = new Date(rowData.closeAt)

		return (
			<View style={[{height: extendHeight}, styles.extendWrapper]} >
				<View style={[styles.darkSeparator]} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>类型</Text>
						<Image style={styles.extendImageBottom} source={tradeImage}/>
					</View>
					<View style={styles.extendMiddle}>
						<Text style={styles.extendTextTop}>糖果</Text>
						<Text style={styles.extendTextBottom}>{rowData.invest && rowData.invest.toFixed(2)}</Text>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>倍数</Text>
						<Text style={styles.extendTextBottom}>x{rowData.leverage}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>开仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.openPrice.maxDecimal(5)}</Text>
					</View>
					<View style={styles.extendMiddle}>
						
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{openDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{openDate.Format('hh:mm')}</Text>
					</View>
				</View>
				<View style={styles.darkSeparator} />
				<View style={styles.extendRowWrapper}>
					<View style={styles.extendLeft}>
						<Text style={styles.extendTextTop}>平仓价格</Text>
						<Text style={styles.extendTextBottom}>{rowData.closePrice.maxDecimal(5)}</Text>
					</View>
					<View style={styles.extendMiddle}>
					</View>
					<View style={styles.extendRight}>
						<Text style={styles.extendTextTop}>{closeDate.Format('yy/MM/dd')}</Text>
						<Text style={styles.extendTextBottom}>{closeDate.Format('hh:mm')}</Text>
					</View>
				</View>
			</View>
		);
	}

	renderItem(data) {
		var rowData = data.item;
		var rowID = data.index;

		var plPercent = (rowData.closePrice - rowData.openPrice) / rowData.openPrice * rowData.leverage * 100
		plPercent = plPercent * (rowData.isLong ? 1 : -1)
		var topLine = rowData.security.name
        var bottomLine = rowData.security.symbol

		return (
			<View style={styles.rowContainer}>
				<TouchableOpacity activeOpacity={1} onPress={() => this.stockPressed(rowData, rowID)}>
					<View style={[styles.rowWrapper]} key={rowData.key}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{topLine}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								{this.renderCountyFlag(rowData)}
								<Text style={styles.stockSymbolText}>
									{bottomLine}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(rowData.pl)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfitPercentage(plPercent)}
						</View>
					</View>
				</TouchableOpacity>

				{this.state.selectedRow == rowID ? this.renderDetailInfo(rowData): null}
			</View>
		);
	}

	renderLoadingText() {
		if(this.state.stockInfoRowData.length === 0) {
			return (
				<View style={styles.loadingTextView}>
					<Text style={styles.loadingText}>ZWPCJL</Text>
				</View>
				)
		}
	}

	renderOrClear(){
		if(this.state.isClear){
			return(<View style={{height:10000}}></View>)
		}
	}

	renderContent(){
		// if(!this.state.contentLoaded){
		// 	return (
		// 		<NetworkErrorIndicator onRefresh={()=>this.loadClosedPositionInfo()} refreshing={this.state.isRefreshing}/>
		// 	)
		// }else{
			var pullUpDistance = 35;
			var pullUpStayDistance = 35;

			return (<View style={{flex:1}}>
				{this.renderOrClear()}
				{this.renderLoadingText()}
				<FlatList
					style={styles.list}
					ref={ (component) => this._pullToRefreshListView = component }
					keyExtractor={(item, index) => index}
					data={this.state.stockInfoRowData}
					enableEmptySections={true}
					// renderFooter={(viewState)=>this.renderFooter(viewState)}
					pageSize={20}
					renderItem={(data)=>this.renderItem(data)}
					autoLoadMore={false}
					enabledPullDown={false}
					onEndReachedThreshold={30}
					onScroll={(event)=>this.onScroll(event)}
					//onRefresh={this._onRefresh.bind(this)}
					onLoadMore={()=>this.onLoadMore()}
					pullUpDistance={pullUpDistance}
					pullUpStayDistance={pullUpStayDistance}
				/>
			</View>);
		// }
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

	rowContainer: {
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:10,      
        margin:ROW_PADDING,
        marginTop: 5,
        marginBottom: ROW_PADDING-5,
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
		marginLeft: 15,
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
		alignItems: 'center',
		paddingTop: 180,
		backgroundColor: 'transparent'
	},

	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},

	refreshTextStyle: {
		color: '#afafaf',
	},
});

module.exports = MyPositionTabClosed;

