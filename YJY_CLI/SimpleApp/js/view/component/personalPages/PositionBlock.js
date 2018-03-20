'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Dimensions,
  Alert,
} from 'react-native';

var ColorConstants = require('../../../ColorConstants'); 
var NetConstants = require('../../../NetConstants');
var UIConstants = require('../../../UIConstants');
var NetworkModule = require('../../../module/NetworkModule');
var NetworkErrorIndicator = require('../NetworkErrorIndicator'); 
var {height, width} = Dimensions.get('window');
var stockNameFontSize = Math.round(15*width/375.0);
var LogicData = require("../../../LogicData");
var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
		if(r1.security && r2.security){
			if(r1.security.last !== r2.security.last || r1.security.bid !== r2.security.bid || r1.security.ask !== r2.security.ask){
				return true;
			}
		}
		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
  }});
   

export default class PositionBlock extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    userId: 0,
    style: {},
    type: "open",
    isPrivate: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      stockInfo: ds.cloneWithRows([]),
      stockInfoRowData: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
      contentLoaded: false,
			isRefreshing: false,
    } 
  }

  componentDidMount(){
    this.setState({
      contentLoaded: true,
      isRefreshing: false, 
    });
  }

  getLastPrice(rowData) {
		var lastPrice = rowData.isLong ? rowData.security.bid : rowData.security.ask
		// console.log(rowData.security.bid, rowData.security.ask)
		return lastPrice === undefined ? rowData.security.last : lastPrice
	}

  refresh(){
    if(this.props.isPrivate){
      return;
    } 
    this.loadData();
  }

  loadData(){

		this.setState({
			isRefreshing: true,
		}, ()=>{
      var url = '';
      console.log('this.props.type='+this.props.type)
      if(this.props.type == 'open'){
        url = NetConstants.CFD_API.PERSONAL_PAGE_POSITION_OPEN;
      }else if(this.props.type == 'close'){
        url = NetConstants.CFD_API.PERSONAL_PAGE_POSITION_CLOSED;
      }
      console.log('url='+url)
      if(url == ''){
        return;
      }

      url = url.replace("<id>", this.props.userId);
      // var userData = LogicData.getUserData()

      NetworkModule.fetchTHUrl(
        url,
        {
          method: 'GET',
          // headers: {
          //   'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
          // },
          cache: 'none',
        },
        (responseJson) => {
          this.setState({
            contentLoaded: true,
            isRefreshing: false,
            stockInfoRowData: responseJson,
            stockInfo: this.state.stockInfo.cloneWithRows(responseJson),
          });
        },
        (result) => {
          if(!result.loadedOfflineCache){
            this.setState({
              contentLoaded: false,
              isRefreshing: false,
            })
          }
          // Alert.alert('', errorMessage);
        }
      )
    });

	}

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	} 


  /*
  { id: 22,
    roi: 0,
    pl: 0,
    security: { id: 34821, name: '黄金', symbol: 'GOLDS' } },
  { id: 4,
    roi: -0.0007437156,
    pl: -0.07437156,
    security: { id: 34821, name: '黄金', symbol: 'GOLDS' } },
  { id: 2,
    roi: -0.0007433838,
    pl: -0.07433838,
    security: { id: 34821, name: '黄金', symbol: 'GOLDS' } },
  */
  renderRow(rowData, sectionID, rowID, highlightRow) {
		var profitPercentage = rowData.roi
    var profitAmount = rowData.upl
    if(this.props.type == 'close'){
      profitAmount = rowData.pl
    }
		var bgcolor = 'white'

		return (
			 
				<TouchableHighlight style={styles.rowItem} activeOpacity={1}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowID}>
						<View style={styles.rowLeftPart}>
							<Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
								{rowData.security.name}
							</Text>

							<View style={{flexDirection: 'row', alignItems: 'center'}}>
						 
								<Text style={styles.stockSymbolText}>
									{rowData.security.symbol}
								</Text>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(profitAmount, null)}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit(profitPercentage * 100, "%")}
						</View>
					</View>
				</TouchableHighlight>
			 
		);
	}

  renderProfit(percentChange, endMark) {
    var textSize = Math.round(18*width/375.0) 
		percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange), fontSize:textSize}]}>
				 {startMark}{percentChange} {endMark}
			</Text>
		);

	}

  render() {
    var strYHWGKSJ = '用户未公开数据'
    var strZWCCJL = '暂无持仓记录'
    var strZWPCJL = '暂无平仓记录'
    if(this.props.isPrivate){
      return (
        <View style={styles.emptyView}>
          <Text style={styles.loadingText}>{strYHWGKSJ}</Text>
        </View>
      )
    }else{
      if(!this.state.contentLoaded){
  			return (
  				<NetworkErrorIndicator onRefresh={()=>this.loadData()} refreshing={this.state.isRefreshing}/>
  			)
  		}else {

        if(this.state.stockInfoRowData.length === 0) {

  			return (
  				<View style={styles.emptyView}>
  					<Text style={styles.loadingText}>{ this.props.type== "open" ? strZWCCJL:strZWPCJL}</Text>
  				</View>
  				)
        }else{
          return (
            <View style={styles.container}>
              {/* {this.renderHeaderBar()} */}
              <ListView
                style={styles.list}
                ref="listview"
                initialListSize={11}
                dataSource={this.state.stockInfo}
                enableEmptySections={true}
                showsVerticalScrollIndicator={false}
                renderRow={(rowData, sectionID, rowID, highlightRow)=>this.renderRow(rowData, sectionID, rowID, highlightRow)}
                // renderSeparator={this.renderSeparator}
                />
            </View>
          );
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:24,
  },
  list: {
    alignSelf: 'stretch',
    flex: 1,
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
  rowWrapper: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderWidth:1,
    borderRadius:10,
    borderColor:'#EEEEEE',
    marginBottom:10,
  },
  rowLeftPart: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
	stockNameText: {
		fontSize: stockNameFontSize,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 22,
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#5f5f5f',
		lineHeight: 14,
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
	headerBar: {
		flexDirection: 'row',
		backgroundColor: '#d9e6f3',
		height: UIConstants.LIST_HEADER_BAR_HEIGHT,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop:2,
	},
	headerCell: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
	headerText: {
		fontSize: 14,
		textAlign: 'center',
		color:'#576b95',
	},

	headerTextLeft: {
		fontSize: 14,
		textAlign: 'left',
		color:'#576b95',
	},

	emptyView: {
		flex: 2,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'space-around',
  },
  
  loadingText: {
    fontSize: 13,
    color: '#9f9f9f'
  },
  rowItem:{
    shadowOffset: {width:2, height:2},
    shadowColor: '#F1F1F1',
    shadowOpacity: 0.75,
		shadowRadius: 0.5,
		elevation: 1.5,
  }
});

module.exports = PositionBlock;
