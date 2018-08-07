//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
	ViewPropTypes,
} from 'react-native';
import CustomStyleText from './CustomStyleText';
var {height,width} = Dimensions.get("screen");
var ColorConstants = require("../../ColorConstants.js");
// create a component
class UserBlock extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        rowData: PropTypes.object,
        onPressItem: PropTypes.func,
    }

    static defaultProps = {
        style: {},
        rowData:{
            roi:0,
            picUrl: "",
        },
        onPressItem: (rowData)=>{}
    }

    render() {
        var profit = (this.props.rowData.roi*100).toFixed(2);
        if(profit==-0){ profit = 0 }
        if(profit >= 0){
            profit = "+" + profit
        }
        return(
            <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={()=>this.props.onPressItem(this.props.rowData)} 
                style={[{height:70,alignItems:'center',justifyContent:'space-between',flexDirection:'row',backgroundColor:'white'}, this.props.style]}>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:2}}>
                    <Image style={{height:46,width:46,marginLeft:15,marginBottom:5,borderRadius:23 }} source={{uri:this.props.rowData.picUrl}}></Image>
                    <View style={{marginLeft:10}}>
                        <CustomStyleText style={{fontSize:15,color:'#454545'}}>{this.props.rowData.nickname}</CustomStyleText>
                        {/* <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                            <CustomStyleText style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</CustomStyleText>
                            <CustomStyleText style={{fontSize:14, color:'#454545'}}>{(rowData.winRate*100).toFixed(0)}%</CustomStyleText>
                        </View> */}
                    </View>
                </View>
                <View style={{marginRight:30}}>
                    <CustomStyleText style={{fontSize:17, fontWeight: 'bold', color:ColorConstants.stock_color(profit)}}>{profit}%</CustomStyleText>
                </View> 
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default UserBlock;
