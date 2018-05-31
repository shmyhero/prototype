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
var LS = require("../../LS");
import { connect } from 'react-redux';

import { fetchBalanceData } from "../../redux/actions/balance";
// create a component
class WithdrawTokenScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            balance: 0,
            balanceText: "...",
            withdrawStringValue: "",
            withdrawValue: 0,
            isAgreementRead: false,
            isButtonEnable: false,
            isRequestSending: false,
        }
    }

    componentWillMount(){
        this.props.fetchBalanceData();
    }

    updateButtonStatus(){
        this.setState({
            isButtonEnable: this.isReadyToPay()
        })
    }

    isReadyToPay(){
        return this.state.withdrawValue > 0 
                && this.state.isAgreementRead
                && !this.state.isRequestSending
                && this.props.thtAddress != undefined
                && this.props.thtAddress != "";
    }

    onWithdrawAllPressed(){
        var state = {
            withdrawStringValue: "" + this.props.balance,
            withdrawValue: this.props.balance,
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

    withdraw(){
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
                            "amount": this.state.withdrawValue,
                        }),
                    },
                    (response )=>{
                        var backFrom = this.props.navigation.state.key;
                        if(this.props.navigation.state.params && this.props.navigation.state.params.backFrom){
                            backFrom = this.props.navigation.state.params.backFrom;
                        }
                        this.props.navigation.navigate(ViewKeys.SCREEN_WITHDRAW_SUBMITTED, {backFrom: backFrom});
                    },
                    (error)=>{
                        console.log("withdraw balance", error);
                        alert(error.errorMessage)
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
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image style={{height:15, width:15}}
                        source={checkIcon}/>
                    <Text>
                        {LS.str("WITHDRAW_READ_AGREEMENT")}
                        <Text onPress={this.onLinkPress} style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>
                        {LS.str("WITHDRAW_AGREEMENT")}
                        </Text>
                        。
                    </Text>                   
                </View>
            </TouchableOpacity>);
    }

    renderPurseAddress(){
        if(this.props.thtAddress && this.props.thtAddress != ""){
            return (
                <View style={styles.rowContainer}>
                    <Text style={{fontSize:17}}>{LS.str("WITHDRAW_ADDRESS_HINT")}</Text>
                    <Text style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{this.props.thtAddress}</Text>
                </View>);
        }else{
            return null;
        }
    }

    render() {
        var balanceValue = this.props.isBalanceLoading ? "--" : this.props.balance;
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("ME_WITHDRAW_TITLE")}
                    showBackButton={true}
                    backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                    navigation={this.props.navigation}
                    />
                <View style={{flex:1, paddingLeft: 15, paddingRight: 15}}>
                    {this.renderPurseAddress()}
                    <View style={styles.rowContainer}>
                        <Text style={{fontSize:15, color:"#7d7d7d"}}>{LS.str("WITHDRAW_AMOUNT")}</Text>
                        <View style={styles.withdrawValueRow}>
                            <Text style={{fontSize:20, fontWeight:"bold", marginRight:15}}>{LS.str("WITHDRAW_BTH")}</Text>
                            <TextInput 
                                underlineColorAndroid={"transparent"}
                                style={{fontSize:40, flex:1,}}
                                keyboardType='numeric' 
                                onChangeText={(withdrawValue)=>this.updatePaymentAmount(withdrawValue)}
                                value={this.state.withdrawStringValue}/>
                        </View>
                        <Text style={{color:"#7d7d7d", fontSize:14}}>
                            {LS.str("WITHDRAW_AVAILABLE_AMOUNT").replace("{1}", balanceValue)}
                            <Text onPress={()=>this.onWithdrawAllPressed()} style={{color:ColorConstants.COLOR_MAIN_THEME_BLUE}}>{LS.str("WITHDRAW_ALL")}</Text>
                        </Text>
                    </View>
                    <View style={{flex:1}}/>
                    {this.renderAgreement()}
                    <SubmitButton 
                        style={{marginBottom:10}}
                        enable={this.state.isButtonEnable}
                        onPress={()=>this.withdraw()}
                        text={this.state.isRequestSending ? LS.str("VERIFING") : LS.str("WITHDRAW_WITHDRAW")} />
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
    withdrawValueRow:{
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

const mapStateToProps = state => {
    return {
        ...state.balance,
        ...state.meData,
    };
};

const mapDispatchToProps = {
    fetchBalanceData
};

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawTokenScreen);
  
  