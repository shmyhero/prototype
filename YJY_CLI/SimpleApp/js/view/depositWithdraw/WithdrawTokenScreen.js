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
var ColorConstants = require('../../ColorConstants')
// create a component
class WithdrawTokenScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            balance: 122,
            withdrawStringValue: "",
            withdrawValue: 0,
            isAgreementRead: false,
            purseAddress: "0XBASFEWR$@#VF123fgdfg@#FGEWRTERDFGGERTY#12gGEWETRWT4gAW",
        }
    }

    isReadyToPay(){
        if(this.state.withdrawValue > 0 && this.state.isAgreementRead){
            return true;
        }else{
            return false;
        }
    }

    onWithdrawAllPressed(){
        var state = {
            withdrawStringValue: "" + this.state.balance,
            withdrawValue: this.state.balance
        };       
        this.setState(state)
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
        this.setState(state)
    }

    deposit(){
        if(this.isReadyToPay()){
            alert("出金" + this.state.withdrawValue);
        }
    }

    renderConfirmButton(){
        var buttonEnabled = this.isReadyToPay();
        var buttonImage = buttonEnabled ? require("../../../images/position_confirm_button_enabled.png") : require("../../../images/position_confirm_button_disabled.png")
        return (
            <TouchableOpacity
                onPress={()=>this.deposit()}
                style={styles.okView}>
                {/* <ImageBackground source={buttonImage}
                    style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                    <Text style={styles.okButton}>
                        确认出金
                    </Text>
                </ImageBackground> */}
            </TouchableOpacity>
        );
    }

    renderAgreement(){
        var checkIcon;
        if(this.state.isAgreementRead){
            checkIcon = require("../../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../../images/selection_small_unselected.png");
        }
        return (
            <TouchableOpacity style={{flexDirection:'row', marginBottom:15}} onPress={()=>{
                    this.setState({
                        isAgreementRead: !this.state.isAgreementRead
                    })
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

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="出金"
                    showBackButton={true}
                    backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                    navigation={this.props.navigation}
                    />
                <View style={{flex:1, paddingLeft: 15, paddingRight: 15}}>
                    <View style={styles.rowContainer}>
                        <Text style={{fontSize:17}}>我的收款地址</Text>
                        <Text style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{this.state.purseAddress}</Text>
                    </View>

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
                        {/* <Text style={{color:"#7d7d7d", fontSize:14}}>
                            {"可出资金："+this.state.balance+"糖果，"}
                            <TouchableOpacity style={{height:13, width:100}} onPress={()=>this.onWithdrawAllPressed()}>
                                <Text style={{color:ColorConstants.COLOR_MAIN_THEME_BLUE}}>全部出金</Text>
                            </TouchableOpacity>
                        </Text> */}
                    </View>
                    <View style={{flex:1}}/>
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
    depositValueRow:{
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginBottom:15,
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
        position:'absolute',
        top:17
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
