'use strict'

import React, {Component} from 'react';
import PropTypes from "prop-types";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
} from 'react-native';

var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var LS = require("../LS");

var {height, width} = Dimensions.get('window');
const RESIZE_SCALE = width/375
var itemTitleFontSize = Math.round(14*RESIZE_SCALE)
var itemValueFontSize = Math.round(14*RESIZE_SCALE)

var TITLE_HEIGHT = 40;
var ROW_HEIGHT = 61;
var HORIZONTAL_BIG_MARGIN = 28;
var HORIZONTAL_SMALL_MARGIN = 15;

export default class StockOrderInfoBar extends Component {
    static propTypes = {
        orderData: PropTypes.object,
        hideTopCornerRadius: PropTypes.bool,
        width: PropTypes.number,
        bigMargin: PropTypes.bool,
    }

    static defaultProps = {
        orderData: null,
        hideTopCornerRadius: false,
        width: width-30,
        bigMargin: false,
    }

    constructor(props) {
        super(props);

        var orderData = this.props.orderData;
        if(orderData){
            console.log("orderData: " + JSON.stringify(orderData))
            console.log("orderData.stockName: " + orderData.stockName)
            this.state = {
                name: orderData.stockName,
                isCreate: orderData.isCreate,
                isLong: orderData.isLong,
                invest: orderData.invest,
                leverage: orderData.leverage,
                closePrice: orderData.closePrice,
                settlePrice: orderData.settlePrice,
                time: orderData.time,
                titleColor: ColorConstants.TITLE_BLUE,
                ccy: orderData.security ? orderData.security.ccy : "USD",
                pl: orderData.pl,
                plRate: '',
            };
        }else{
            this.state = {
                name: 'ABC',
                isCreate: true,
                isLong: true,
                invest: 0,
                leverage: 0,
                openPrice: 0,
                settlePrice: 0,
                time: new Date(),                
                ccy: 'USD',
                pl: 0,
                plRate: 0,
            }
        }
    }

    render(){       
        var plRate = this.state.plRate;
        console.log("plRate: ", plRate, this.state.isCreate)
            
        if ((plRate === '' || plRate === undefined) && !this.state.isCreate) {
            console.log("this.state.settlePrice: " + this.state.settlePrice + ", this.state.closePrice: " + this.state.closePrice + ", this.state.leverage: " + this.state.leverage)
            plRate = (this.state.closePrice - this.state.settlePrice) / this.state.settlePrice * this.state.leverage * 100
            plRate *= (this.state.isLong ? 1 : -1)
            console.log("plRate", plRate)
        }

        var plColor = 'black'
        if (!this.state.isCreate){
            plColor = plRate > 0 ? ColorConstants.STOCK_RISE_RED : (plRate < 0 ? ColorConstants.STOCK_DOWN_GREEN : 'black')
        }

        //Card style.
        var titleTextStyle = {}
        var itemTitleTextStyle = {}
        var itemValueTextStyle = {}
        var upTextStyle = {}
        var lineStyle = {};
        var longImageStyle = {};
        var extraTitleImageBackground = (<View/>);

        var headerHeight = this.props.width / 690 * 82
        var longImageSrc = this.state.isLong ? require('../../images/stock_detail_direction_up_disabled.png') : require('../../images/stock_detail_direction_down_disabled.png');
        console.log("headerHeight " + headerHeight)
        console.log("{this.state.name} " + this.state.name)
        return (
            <View style={[styles.container]}>
                {extraTitleImageBackground}
                <View style={[styles.titleContainer, {justifyContent:'center'}]}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                        <Text style={[styles.titleText, {flex:1, marginLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}, titleTextStyle]} numberOfLines={1} ellipsizeMode={'head'}>
                            {this.state.name} - {this.state.isCreate? LS.str("ORDER_OPEN") : LS.str("ORDER_CLOSE")}
                        </Text>
                        {this.state.isCreate ?
                            null :
                            <Text style={[styles.titleText, {marginRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, marginLeft: 5}, titleTextStyle]}>
                                {(plRate).toFixed(2)} %
                            </Text>
                        }
                    </View>
                </View>
                <View style={[styles.centerContainer]}>
                    <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, paddingVertical: 8}}>
                        <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
                            {LS.str("ORDER_TYPE")}
                        </Text>
                        <Image style={[styles.longImage, longImageStyle]} source={longImageSrc}/>
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
                            {LS.str("ORDER_SUGAR_AMOUNT")}
                        </Text>
                        <Text style={[styles.itemValueText, itemValueTextStyle]}>
                        {this.state.invest.toFixed(2)}
                        </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', paddingRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}}>
                        <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
                            {LS.str("ORDER_MULTIPLE")}
                        </Text>
                        <Text style={[styles.itemValueText, itemValueTextStyle]}>
                        {this.state.leverage}
                        </Text>
                    </View>
                </View>
                <View style={[styles.line, lineStyle]}/>
                <View style={[styles.bottomContainer]}>
                    <View style={{flex: 1, alignItems: 'flex-start', paddingLeft: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN, paddingVertical: 8}}>
                        <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
                            {LS.str("ORDER_TRADE_PRICE")}
                        </Text>
                        <Text style={[styles.itemValueText, itemValueTextStyle]}>
                        {this.state.settlePrice}
                        </Text>
                    </View>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Text style={[styles.itemTitleText, itemTitleTextStyle]}>
                            {this.state.isCreate? LS.str("ORDER_MAX_RISK") : LS.str("ORDER_PROFIT_AND_LOSS")}
                        </Text>
                        <Text style={[styles.itemValueText, itemValueTextStyle, {color: plColor}]}>
                        {this.state.isCreate ? this.state.invest.toFixed(2) : this.state.pl.toFixed(2)}
                        </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end', paddingRight: this.props.bigMargin ? HORIZONTAL_BIG_MARGIN : HORIZONTAL_SMALL_MARGIN}}>
                        <Text style={[styles.itemTitleText, itemValueTextStyle]}>
                        {this.state.time.Format('yy/MM/dd')}
                        </Text>
                        <Text style={[styles.itemValueText, itemValueTextStyle]}>
                        {this.state.time.Format('hh:mm')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        alignSelf: 'stretch',
        width: width - 20,
        //backgroundColor: 'gray',
    },

	titleContainer: {
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
        borderWidth:0,
		backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
		alignItems: 'flex-start',
        height: TITLE_HEIGHT,
	},

	centerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
        height: ROW_HEIGHT,
		backgroundColor: '#f5f5f5',
	},

	bottomContainer: {
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
        height: ROW_HEIGHT,
		backgroundColor: '#f5f5f5',
	},

    titleText: {
		fontSize: 17,
		// textAlign: 'center',
		color: '#ffffff',
		//marginVertical: 8,
        textAlign: 'left',
	},

	itemTitleText: {
		fontSize: itemTitleFontSize,
		textAlign: 'center',
        color: '#7d7d7d',
	},

	itemValueText: {
		fontSize: itemValueFontSize,
		textAlign: 'center',
		color: '#000000',
		paddingTop: 4,
	},

	longImage: {
		width: itemValueFontSize+5,
		height: itemValueFontSize+5,
		paddingTop: 4,
	},

	line: {
		height: 1,
		backgroundColor: '#c9c9c9',
	},
});

module.exports = StockOrderInfoBar;
