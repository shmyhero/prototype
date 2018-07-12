//import liraries
import React, { Component } from 'react';
import {
    View, 
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image } from 'react-native';
import NavBar from '../component/NavBar';
var ColorConstants = require('../../ColorConstants')
var PAYMENT_TYPE_WECHAT = "wechat";
var PAYMENT_TYPE_ALIPAY = "alipay";
// create a component
class DepositScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            balance: 100,
            displayText: "",
            value: 0,
            paymentType: PAYMENT_TYPE_WECHAT,
            isAgreementRead: false,
        }
    }

    updatePaymentAmount(value){
        var state = {
            displayText: value
        };
        if(value){
            state.value = parseInt(value);
        }else{
            state.value = 0;
        }
        this.setState(state)
    }

    isReadyToPay(){
        if(this.state.value > 0 && this.state.isAgreementRead){
            return true;
        }else{
            return false;
        }
    }

    renderAgreement(){
        var checkIcon;
        if(this.state.isAgreementRead){
            checkIcon = require("../../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../../images/selection_small_unselected.png");
        }
        return (
            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{
                this.setState({
                    isAgreementRead: !this.state.isAgreementRead
                })
            }}>
                <Image style={{height:15, width:15}}
                    source={checkIcon}/>
                <Text>
                    我已经阅读并同意
                    {/* <TouchableOpacity style={{width:150, height:11, }}> */}
                        <Text style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>《购买糖果协议内容》</Text>
                    {/* </TouchableOpacity> */}
                    。
                </Text>
            </TouchableOpacity>);
    }

    renderPaymentSwitch(title, icon, type){
        var checkIcon;
        if(this.state.paymentType == type){
            checkIcon = require("../../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../../images/selection_small_unselected.png");
        }
        return (
            <TouchableOpacity style={styles.rowContainer} onPress={()=>{
                this.setState({
                    paymentType: type
                })
            }}>
                <Image style={styles.paymentIcon} resizeMode="contain" source={icon}/>
                <Text style={styles.rowHeader}>{title}</Text>
                <Image style={styles.paymentIcon} resizeMode="contain" source={checkIcon}/>
            </TouchableOpacity>
        );
    }

    renderConfirmButton(){
        var buttonEnabled = this.isReadyToPay();
        var buttonImage = buttonEnabled ? require("../../../images/position_confirm_button_enabled.png") : require("../../../images/position_confirm_button_disabled.png")
        return (
            <TouchableOpacity
                onPress={()=>{alert("支付" + this.state.paymentType + ", " + this.state.value)}}
                style={styles.okView}
                >
                <ImageBackground source={buttonImage}
                    style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                    <Text style={styles.okButton}>
                        确认支付
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="在线充值"
                        showBackButton={true}
                        backgroundColor="transparent"
                        titleColor={'#0066cc'}
                        navigation={this.props.navigation}                                   
                        />
                <View style={styles.contentContainer}>
                    <View style={{flexDirection:'row'}}>
                        <Image style={{height:15, width:15}} source={require('../../../images/deposit_balance.png')}/>
                        <Text style={styles.hintText}>糖果可用于产品交易及服务，1元=1糖果</Text>
                    </View>
                    <Text style={styles.rowTitle}>当前剩余糖果: {+ this.state.balance}</Text>

                    <View style={styles.blockContainer}>
                        <ImageBackground style={{width:"100%", height:"100%"}}
                                            source={require("../../../images/deposit_block_background.png")}>
                            <View style={styles.rowContainer}>
                                <Text style={styles.rowHeader}>糖果数量: </Text>
                                <TextInput style={styles.rowValue} defaultValue={this.state.displayText}
                                    onChangeText={(value)=>this.updatePaymentAmount(value)}/>
                            </View>
                            <View style={styles.darkSeparator}/>
                            <View style={styles.rowContainer}>
                                <Text style={styles.rowHeader}>待支付金额</Text>
                                <Text style={styles.rowValue}>{this.state.value}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <Text style={styles.rowTitle}>选择支付方式</Text>
                    <View style={styles.blockContainer}>
                        <ImageBackground style={{width:"100%", height:"100%"}}
                                            source={require("../../../images/deposit_block_background.png")}>                          
                            {this.renderPaymentSwitch("微信支付", require("../../../images/deposit_icon_wechat.png"), PAYMENT_TYPE_WECHAT)}
                            {this.renderPaymentSwitch("支付宝", require("../../../images/deposit_icon_alipay.png"), PAYMENT_TYPE_ALIPAY)}
                        </ImageBackground>
                    </View>
                    {this.renderAgreement()}
                    {this.renderConfirmButton()}
                </View>
               
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    contentContainer:{
        flex: 1,
        padding:20
    },
    hintText:{
        fontSize: 11,
        color: '#666666',
    },
    rowHeader:{
        flex: 2,
        fontSize: 15,
        color:'#8c8d90'
    },
    rowValue:{
        flex: 3,
        fontSize: 15,
        color:'#269cee'
    },
    rowTitle:{
        fontSize:20,
        color:'#8c8d90',
        marginTop:15,
        marginBottom:10,
    },
    blockContainer:{
        height: 144,
        alignSelf: 'stretch',
        flexDirection:'column'
    },
    rowContainer:{
        padding:20,
        flexDirection:'row',
        height:68,
        alignItems:'center'
    },
    darkSeparator: {
        height: 0.5,
        marginLeft:4,
        marginRight:4,
		backgroundColor: '#eeeeee',
    },
    paymentIcon:{
        height:30,
        width:30
    },
    okView: {
		width: 332,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'center',
    },
	okButton: {
		color: 'white',
		textAlign: 'center',
		fontSize: 17,
	},

});

//make this component available to the app
export default DepositScreen;
