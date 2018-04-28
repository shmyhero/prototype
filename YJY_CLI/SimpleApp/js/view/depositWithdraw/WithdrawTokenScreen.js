//import liraries
import React, { Component } from 'react';
import { View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import NavBar from '../component/NavBar';
var ColorConstants = require('../../ColorConstants');
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");
import LogicData from "../../LogicData";
import { ViewKeys } from '../../../AppNavigatorConfiguration';
import SubmitButton from '../component/SubmitButton';
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");

// create a component
class WithdrawTokenScreen extends Component {
    constructor(props){
        super(props)

        var purseAddress = "";
        if(this.props.navigation.state && this.props.navigation.state.params){
            purseAddress = this.props.navigation.state.params.address;
        }
        this.state = {
            balance: 0,
            balanceText: "...",
            withdrawStringValue: "",
            withdrawValue: 0,
            isAgreementRead: false,
            purseAddress: purseAddress,
            isButtonEnable: false,
            isRequestSending: false,
        }
    }

    componentWillMount(){
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.USER_FUND_BALANCE,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                },
            },(responseJson)=>{
                this.setState({
                    balance: responseJson.balance.maxDecimal(2),
                    balanceText: ""+responseJson.balance.maxDecimal(2),
                })
            },()=>{

            });
    }

    updateButtonStatus(){
        this.setState({
            isButtonEnable: this.isReadyToPay()
        })
    }

    isReadyToPay(){
        return this.state.withdrawValue > 0 && this.state.isAgreementRead && !this.state.isRequestSending;
    }

    onWithdrawAllPressed(){
        var state = {
            withdrawStringValue: "" + this.state.balance,
            withdrawValue: this.state.balance,
        };
        this.setState(state, ()=>this.updateButtonStatus())
    }

    updatePaymentAmount(withdrawValue){
        var state = {
            withdrawStringValue: withdrawValue
        };
        if(withdrawValue){
            state.withdrawValue = parseInt(withdrawValue);
        }else{
            state.withdrawValue = 0;
        }
        this.setState(state, ()=>this.updateButtonStatus())
    }

    deposit(){
        if(this.isReadyToPay()){
            this.setState({
                isRequestSending: true,
            }, ()=>{
                this.updateButtonStatus();
                var userData = LogicData.getUserData();

                NetworkModule.fetchTHUrl(
                    NetConstants.CFD_API.WITHDRAW_BALANCE,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: JSON.stringify({
                            "value": this.state.withdrawValue,
                        }),
                    },
                    (response )=>{
                        this.props.navigation.navigate(ViewKeys.SCREEN_WITHDRAW_SUBMITTED, {backFrom: this.props.navigation.state.key});
                    },
                    (error)=>{
                        console.log("withdraw balance", error);
                        //alert(error.message)
                        this.setState({
                            isRequestSending: false,
                        }, ()=>{
                            this.updateButtonStatus();
                        });
                    });
            })            
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
            <TouchableOpacity style={{flexDirection:'row', marginBottom:15, marginTop:15}} onPress={()=>{
                    this.setState({
                        isAgreementRead: !this.state.isAgreementRead
                    },()=>this.updateButtonStatus())
                }}>
                <View style={{flexDirection:'row', }}>
                    <Image style={{height:15, width:15}}
                        source={checkIcon}/>
                    <Text>
                        我已经阅读并同意
                        <Text onPress={this.onLinkPress} style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>《购买糖果协议内容》</Text>
                        。
                    </Text>                   
                </View>
            </TouchableOpacity>);
    }

    renderPurseAddress(){
        if(this.state.purseAddress && this.state.purseAddress != ""){
            return (
                <View style={styles.rowContainer}>
                    <Text style={{fontSize:17}}>我的收款地址</Text>
                    <Text style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{this.state.purseAddress}</Text>
                </View>);
        }else{
            return null;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="出金"
                    showBackButton={true}
                    backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                    navigation={this.props.navigation}
                    />
                <View style={{flex:1, paddingLeft: 15, paddingRight: 15}}>
                    {this.renderPurseAddress()}
                    <View style={styles.rowContainer}>
                        <Text style={{fontSize:15, color:"#7d7d7d"}}>出金金额</Text>
                        <View style={styles.depositValueRow}>
                            <Text style={{fontSize:20, fontWeight:"bold", marginRight:15}}>糖果</Text>
                            <TextInput 
                                underlineColorAndroid={"transparent"}
                                style={{fontSize:40, flex:1,}}
                                onChangeText={(withdrawValue)=>this.updatePaymentAmount(withdrawValue)}
                                value={this.state.withdrawStringValue}/>
                        </View>
                        <Text style={{color:"#7d7d7d", fontSize:14}}>
                            {"可出资金："+this.state.balanceText+"糖果，"}
                            <Text onPress={()=>this.onWithdrawAllPressed()} style={{color:ColorConstants.COLOR_MAIN_THEME_BLUE}}>全部出金</Text>
                        </Text>
                    </View>
                    <View style={{flex:1}}/>
                    {this.renderAgreement()}
                    <SubmitButton 
                        enable={this.state.isButtonEnable}
                        onPress={()=>this.deposit()}
                        text={"确认出金"} />
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
    depositValueRow:{
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginBottom:15,
    },
    rowContainer: {
        padding: 15, 
        borderWidth: 1, 
        borderColor: "#dddddd",
        borderRadius: 10,
        marginTop: 15,
    }
});

//make this component available to the app
export default WithdrawTokenScreen;
