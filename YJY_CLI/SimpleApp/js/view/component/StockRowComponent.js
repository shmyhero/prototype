//import liraries
import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
    View, 
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import CustomStyleText from './CustomStyleText'
var ColorConstants = require('../../ColorConstants');
var UIConstants = require("../../UIConstants");
var LS = require('../../LS')

// create a component
class StockRowComponent extends Component {
    static propTypes = {
        data: PropTypes.object,
        onPress: PropTypes.func,
    }

    static defaultProps = {
        data: {},
        onPress: ()=>{},
    }

    renderStockStatus(rowData){
		var strBS = LS.str("STOCK_MARKET_CLOSED");
		var strZT = LS.str("STOCK_MARKET_STOP");
		if(rowData!==undefined){
			if(rowData.isOpen || rowData.status == undefined){
				return null;
			}else{
                var statusTxt = rowData.status == 2 ? strZT:strBS;

                return(
					<Image source={require("../../../images/item_stoped.png")} 
						style={styles.statusIcon}/>
				);
            }
        }
    }

    render() {
        var pl = ((this.props.data.last - this.props.data.open ) / this.props.data.open * 100).toFixed(2)
        var plStyleList = [styles.plStyle];
        var plStr = "" + pl + "%";
        if(pl > 0){
            plStyleList.push(styles.UpPLStyle);
            plStr = "+" + plStr;
        }
        else if(pl < 0){
            plStyleList.push(styles.DownPLStyle);
        }
        else if(pl == 0){
            plStyleList.push(styles.SamePLStyle);
        }

        return (
            <TouchableOpacity
                underlayColor={'#eee'}
                style={styles.stockTouchableContainerStyle}
                onPress={()=>this.props.onPress(this.props.data)}
                activeOpacity={0.7}
                {...this.props.sortHandlers}>
                <View style={styles.stockRowContainer}>
                    <View style={styles.titleContainerStyle}>                        
                        <View style={{flexDirection:'row'}}>
                            <CustomStyleText style={styles.titleStyle}>{this.props.data.name}</CustomStyleText>
                            {this.renderStockStatus(this.props.data)}
                            {/* <CustomStyleText style={styles.symbolStyle}>{this.props.data.symbol}</CustomStyleText> */}
                        </View>
                    </View>
                    <CustomStyleText style={styles.priceStyle}>{this.props.data.last}</CustomStyleText>
                    <CustomStyleText style={plStyleList}>{plStr}</CustomStyleText>
                </View>
            </TouchableOpacity>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    stockRowContainer:{
        margin:15,
        flexDirection:'row',
        flex:1
    },
    titleContainerStyle:{
        flex:2,
        justifyContent:'center',   
    },
    priceStyle:{
        flex:1,
        textAlign:'right',
        alignSelf: 'center',
        color:'#8181A2',
        fontSize: UIConstants.STOCK_ROW_PRICE_FONT_SIZE,
    },
    stockTouchableContainerStyle:{
        borderRadius: UIConstants.ITEM_ROW_BORDER_RADIUS,
        backgroundColor: ColorConstants.COLOR_LIST_VIEW_ITEM_BG,
        marginRight: UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
        marginLeft: UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
        marginBottom: UIConstants.ITEM_ROW_MARGIN_VERTICAL,
        height:70,
    },
    statusLableContainer: {
		backgroundColor: '#999999',
		borderRadius: 2,
		paddingLeft: 1,
		paddingRight: 1,
        marginRight: 2,
        alignSelf:'center',
        alignItems: 'center',
    },
	statusLable:{
		fontSize: 10,
		textAlign: 'center',
		color: '#ffffff',
    },  
    plStyle:{
        flex:1,
        textAlign:'right',
        alignSelf: 'center',
        fontSize: UIConstants.STOCK_ROW_PRICE_FONT_SIZE,
    },
    UpPLStyle:{
        color: ColorConstants.STOCK_RISE,
    },
    DownPLStyle: {
        color: ColorConstants.STOCK_DOWN,
    },
    SamePLStyle: {
        color: ColorConstants.STOCK_UNCHANGED_GRAY,
    },
    titleStyle:{
        color:'#ffffff',
        fontSize: UIConstants.STOCK_ROW_NAME_FONT_SIZE,
        fontWeight: 'bold'
    },
    symbolStyle:{
        color:'#666666',
        fontSize: UIConstants.STOCK_ROW_PRICE_FONT_SIZE,
    },
    statusIcon:{
		width:22,
		height:22,
		marginLeft:5
	}
});

//make this component available to the app
export default StockRowComponent;
