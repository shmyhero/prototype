'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image
} from 'react-native';

var ColorConstants = require('../../../ColorConstants'); 
var NetConstants = require('../../../NetConstants');
var UIConstants = require('../../../UIConstants');
var NetworkModule = require('../../../module/NetworkModule');
import NetworkErrorIndicator from '../NetworkErrorIndicator'; 
var {height, width} = Dimensions.get('window');
var stockNameFontSize = Math.round(15*width/375.0);
var LogicData = require("../../../LogicData");
var {height, width} = Dimensions.get('window');
var LS = require('../../../LS')

// var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
// 		if(r1.security && r2.security){
// 			if(r1.security.last !== r2.security.last || r1.security.bid !== r2.security.bid || r1.security.ask !== r2.security.ask){
// 				return true;
// 			}
// 		}
// 		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
//   }});
   

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
      stockInfo: [],
      stockInfoRowData: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
      contentLoaded: false,
      isRefreshing: false,
      selectedRow: -1,
    } 
  }

  componentDidMount(){
    this.setState({
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
            stockInfo: responseJson,
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

    onRowPressed(rowData, rowID){
        rowID = parseInt(rowID)
        var newData = []
        $.extend(true, newData, this.state.stockInfo)
        if(this.state.selectedRow == rowID){
            this.setState({
                stockInfo: newData,
                selectedRow: -1
            })
        }else{
            this.setState({
                stockInfo: newData,
                selectedRow: rowID
            })
        }
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

  renderExtended(rowData, rowID) {
    console.log("renderExtended this.state.selectedRow", this.state.selectedRow)
    console.log("renderExtended rowID", rowID)
    if(this.state.selectedRow == rowID){
      var tradeImage = null;
      if(rowData.isLong){
        tradeImage = require('../../../../images/stock_detail_direction_up_disabled.png');
      }else{
        tradeImage = require('../../../../images/stock_detail_direction_down_disabled.png');
      }
      var timeSubTitle = this.props.type == "open" ? LS.str('ORDER_OPEN_TIME') : LS.str('ORDER_CLOSE_TIME');
      var dateString = this.props.type == "open" ? rowData.createAt : rowData.closedAt;
      console.log("renderDetailInfo", dateString)
      var date = new Date(dateString)
      console.log("renderDetailInfo", date)
      var timeString = date.Format('yy/MM/dd hh:mm');
      return (
        <View style={styles.extendRowWrapper}>
          <View style={styles.extendLeft}>
            <Text style={styles.extendTextTop}>{LS.str('ORDER_TYPE')}</Text>
            <Image style={styles.extendImageBottom} source={tradeImage}/>
          </View>
          <View style={styles.extendRight}>
            <Text style={styles.extendTextTop}>{timeSubTitle}</Text>
            <Text style={styles.extendTextBottom}>{timeString}</Text>
          </View>
        </View>);
    }else{
      return null;
    }
  }

  renderRow(data){
    var rowData = data.item;
    var rowID = data.index;

    var profitPercentage = rowData.roi
    var profitAmount = rowData.upl
    if(this.props.type == 'close'){
        profitAmount = rowData.pl
    }
    var bgcolor = 'white'
    
    var additionalStyle = {};
    if(rowID == 0){
        additionalStyle.marginTop = 10;
    }
    return (
        <TouchableOpacity style={[styles.rowItem, additionalStyle]}
          activeOpacity={0.7} onPress={()=>this.onRowPressed(rowData, rowID)}>
          <View style={[styles.rowWrapper, {backgroundColor: bgcolor}]}>
            <View style={styles.rowHeader}>
              <View style={styles.rowLeftPart}>
                <Text style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
                  {rowData.security.name}
                </Text>
              </View>

              <View style={styles.rowCenterPart}>
                {this.renderProfit(profitAmount, null)}
              </View>

              <View style={styles.rowRightPart}>
                {this.renderProfit(profitPercentage * 100, "%")}
              </View>
            </View>
            {this.renderExtended(rowData, rowID)}
          </View>
				</TouchableOpacity>
			 
		);
	}

  renderProfit(percentChange, endMark) {
    percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<Text style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange)}]}>
				 {startMark}{percentChange} {endMark}
			</Text>
		);

	}

  render() {
    var strYHWGKSJ = LS.str('YHWGKSJ')
    var strZWCCJL = LS.str('ZWCCJL')
    var strZWPCJL = LS.str('ZWPCJL')
    
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
              <FlatList
                ref={ (component) => this.flatListView = component }
                style={styles.list}
                initialListSize={11}
                data={this.state.stockInfo}
                enableEmptySections={true}
                keyExtractor={(item, index) => index}
                showsVerticalScrollIndicator={false}
                renderItem={(data)=>this.renderRow(data)}
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
    marginTop:15,
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
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS,
    //borderWidth:1,
    //borderColor:'#EEEEEE',
  },
  rowHeader:{
    height: 50,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center', 
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
    fontSize: UIConstants.STOCK_ROW_NAME_FONT_SIZE
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
    color: 'white'
  },
  stockPercentText:{
    fontSize: UIConstants.STOCK_ROW_PRICE_FONT_SIZE,
  },
  rowItem:{
    // shadowOffset: {width:2, height:2},
    // shadowColor: '#999999',
    // shadowOpacity: 0.75,
		// shadowRadius: 0.5,
    //elevation: 1.5,
    marginBottom:15,
  },
  extendLeft: {
		flex: 1,
		alignItems: 'flex-start',
		paddingTop: 8,
		paddingBottom: 8,
  },
  extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		paddingTop: 8,
		paddingBottom: 8,
	},
  extendImageBottom: {
		width: 24,
		height: 24,
  },
  extendRowWrapper: {
    marginTop:10,
    borderTopWidth:1,
    borderColor: ColorConstants.SEPARATOR_GRAY,
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-around',
    height: 52,
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
});

module.exports = PositionBlock;
