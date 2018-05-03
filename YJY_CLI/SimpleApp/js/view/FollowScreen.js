//import liraries
import React, { Component } from 'react';
import {
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ImageBackground,
    Image,
    Picker,
} from 'react-native';

var {height, width} = Dimensions.get("window");
var ColorConstants = require('../ColorConstants');

import LinearGradient from 'react-native-linear-gradient'
var LS = require("../LS");

// create a component

class FollowScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            modalVisible: false,
            balance: 9999.1,
            amount: 20,
            followCounts: 3,
            avaliableAmount: [10,20,30,50,100],
            avaliableFollowCounts: [1,2,3,4,5],
            isAgreementRead: true,
            valueChanged: false,
        }
    }

    show(){
        this.setState({
            modalVisible: true,
        })
    }

    hide(){
        this.setState({
            modalVisible: false,
        })
    }

    isReadyToUpdateFollow(){
        if(this.state.valueChanged && this.state.isAgreementRead){
            return true;
        }
    }

    renderHint(){
        var checkIcon;
        if(this.state.isAgreementRead){
            checkIcon = require("../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../images/selection_small_unselected.png");
        }
        return(
            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{
                    this.setState({
                        isAgreementRead: !this.state.isAgreementRead
                    })
                }}>
                <View style={{flexDirection:'row', flex:1, alignItems:'flex-start'}}>
                    <Image style={{height:15, width:15}}
                        source={checkIcon}/>
                    <Text style={{color:"#858585", fontSize:13}}>
                        {LS.str("WITHDRAW_READ_AGREEMENT")}
                        <Text onPress={this.onLinkPress} style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>{LS.str("FOLLOW_AGREEMENT")}</Text>
                    </Text>                   
                </View>
            </TouchableOpacity>
        )
    }

    onChangePickerValue(itemValue, itemIndex, stateKey){
        if(this.state[stateKey] != itemValue){
            var state = { valueChanged: true};
            state[stateKey] = itemValue;
            this.setState(state)
        }
    }

    bindCard(){
        this.setState({
            valueChanged: false,
        })
    }

    renderPicker(title, stateKey, availableKey){

        var pickerItems = this.state[availableKey].map( (value, index, array)=>{
            return (
                <Picker.Item label={""+value} value={value} key={index}/>
            );
        })
        return(
            <View style={{alignItems:'center', flex:1}}>
                <Text style={styles.pickerTitle}>{title}</Text>
                <Picker
                    selectedValue={this.state[stateKey]}
                    style={{flex:1, height:150, width: 100 }}
                    itemStyle={{color:"#bfbfbf", height:150, fontSize:20}}
                    onValueChange={(itemValue, itemIndex) => this.onChangePickerValue(itemValue, itemIndex, stateKey)}>
                    {pickerItems}
                </Picker>
            </View>
        );
    }

    renderConfirmButton(){
        var buttonEnabled = this.isReadyToUpdateFollow();
        var buttonImage = buttonEnabled ? require("../../images/position_confirm_button_enabled.png") : require("../../images/position_confirm_button_disabled.png")
        return (
            <TouchableOpacity
                onPress={()=>this.bindCard()}
                style={styles.okView}>
                <ImageBackground source={buttonImage}
                    style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                    <Text style={styles.okButton}>
                        {LS.str("POSITION_CONFIRM")}
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    renderContent(){
        return (
            <View style={{flex:1, alignSelf:'stretch', alignItems:'stretch'}}>
                <View style={styles.mainContent}>
                    <ImageBackground 
                        source={require('../../images/remain_tokens_border.jpg')}
                        style={{
                            height:60, //450 × 120,
                            width: 225,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Text style={styles.balanceText}>{this.state.balance}</Text>
                    </ImageBackground>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:30, flex:1}}>
                        {this.renderPicker(LS.str("FOLLOW_AMOUNT"), "amount", "avaliableAmount")}
                        {this.renderPicker(LS.str("FOLLOW_COUNT"), "followCounts", "avaliableFollowCounts")}
                    </View>
                    {this.renderHint()}
                </View>               
                {this.renderConfirmButton()}
            </View>
            );
    }

    render() {
        return (
            <Modal style={styles.container}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={()=>{}}
                >
                <TouchableOpacity activeOpacity={1} style={styles.modalBackground} onPress={()=>this.hide()}>
                    <TouchableOpacity activeOpacity={1} style={styles.contentContainer}>
                        {this.renderContent()}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
    },
    button: {
        height: 45,
        backgroundColor:"#0075ff",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 10,
    },
    modalBackground: {
        width:width,
        height:height,
        backgroundColor:'rgba(0, 0, 0, 0.7)',
        alignItems:'center',
        justifyContent:'center',
    },
    contentContainer: {
        height: 365,
        width:width-40,
        backgroundColor:'white',
        borderRadius:10
    },
    mainContent: {
        margin: 15,
        alignItems:'center',
        flex:1,
    },
    balanceText:{
        fontSize: 17,
        color:'#333333'
    },
    pickerTitle:{
        fontSize:11,
        color:'#333333'
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
});

//make this component available to the app
export default FollowScreen;
