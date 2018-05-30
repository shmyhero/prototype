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
    //Picker,
} from 'react-native';

var {height, width} = Dimensions.get("window");
var ColorConstants = require('../ColorConstants');
import WheelPicker from "./component/WheelPicker";
import LinearGradient from 'react-native-linear-gradient';
import SubmitButton from './component/SubmitButton';
import LogicData from '../LogicData';
import BalanceBlock from './component/BalanceBlock';
var NetworkModule = require("../module/NetworkModule");
var NetConstants = require("../NetConstants");

import {
    showFollowDialog,
    updateFollowConfig,
    sendFollowConfigRequest,
    checkAgreement,
    getCurrentFollowConfig
} from '../redux/actions'
import { connect } from 'react-redux';

var LS = require("../LS");

// create a component

class FollowScreen extends Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(props){
        console.log("componentWillReceiveProps props.userId", props.userId)
    }


    componentDidMount(){
        this.props.getCurrentFollowConfig();
    }

    hide(){        
        this.props.showFollowDialog(false);
    }

    onChangePickerValue(itemValue, itemIndex, stateKey){
        if (stateKey == "investFixed"){
            this.props.updateFollowConfig(itemValue, this.props.newFollowTrade.stopAfterCount);
        }else if (stateKey == "stopAfterCount"){
            this.props.updateFollowConfig(this.props.newFollowTrade.investFixed, itemValue);
        }
    }

    setFollowConfig(){
        console.log("setFollowConfig this.props.userId", this.props.userId)
        console.log("setFollowConfig this.props.newFollowTrade", this.props.newFollowTrade)
        this.props.sendFollowConfigRequest(this.props.userId, this.props.newFollowTrade);
    }

    renderHint(){
        var checkIcon;
        if(this.props.isAgreementRead){
            checkIcon = require("../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../images/selection_small_unselected.png");
        }
        return(
            <TouchableOpacity style={{flexDirection:'row', marginTop:10, marginBottom:10}}
                onPress={()=>{
                    this.props.checkAgreement(this.props.isAgreementRead);
                }}>
                <View style={{flexDirection:'row', flex:1, alignItems:'center'}}>
                    <Image style={{height:15, width:15}}
                        source={checkIcon}/>
                    <Text style={{color:"#858585", fontSize:13}}>
                        {LS.str("WITHDRAW_READ_AGREEMENT")}
                        <Text onPress={this.onLinkPress} style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>{LS.str("COPY_AGREEMENT")}</Text>
                    </Text>                   
                </View>
            </TouchableOpacity>
        )
    }

    renderPicker(title, stateKey, availableKey){
        var pickerItems = this.props[availableKey].map( (value, index, array)=>{
            return (
                <WheelPicker.Item label={""+value} value={value} key={index}/>
            );
        })
        return(
            <View style={{alignItems:'center', flex:1}}>
                <Text style={styles.pickerTitle}>{title}</Text>
                <WheelPicker
                    selectedValue={this.props.newFollowTrade[stateKey]}
                    selectedTextColor={"#333333"}
                    style={{flex:1, height:150, width: 100 }}
                    itemStyle={{color:"#bfbfbf", height:150, fontSize:20}}
                    onValueChange={(itemValue, itemIndex) => this.onChangePickerValue(itemValue, itemIndex, stateKey)}>
                    {pickerItems}
                </WheelPicker>
            </View>
        );
    }

    renderContent(){
        return (
            <View style={{flex:1, alignSelf:'stretch', alignItems:'stretch'}}>
                <View style={styles.mainContent}>
                    {/* <ImageBackground 
                        source={require('../../images/remain_tokens_border.jpg')}
                        style={{
                            height:60, //450 × 120,
                            width: 225,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}> */}
                        <View style={{
                                height:50, //450 × 120,
                                width: 225,
                                marginTop:15}}>
                            <View style={{
                                flex:1,
                                marginTop:10,                                
                                borderColor: ColorConstants.SEPARATOR_GRAY,
                                borderWidth: 1,
                                borderRadius:10,
                                alignItems:'center',
                                justifyContent:'center',
                            }}>
                                <BalanceBlock style={styles.balanceText}/>
                            </View>
                            <View style={{position:'absolute', 
                                    top:0,
                                    left:0,
                                    right:0,}}>
                                <View style={{
                                    backgroundColor:'white',
                                    alignSelf:'center',
                                    paddingLeft:10,
                                    paddingRight:10
                                }}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: ColorConstants.SEPARATOR_GRAY,
                                        textAlign:'center'
                                    }}>{LS.str('REMAIN_MOUNT')}</Text>
                                </View>
                            </View>
                            
                        </View>
                       
                    {/* </ImageBackground> */}
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:30, flex:1}}>
                        {this.renderPicker(LS.str("COPY_AMOUNT"), "investFixed", "availableInvestFixed")}
                        {this.renderPicker(LS.str("COPY_COUNT"), "stopAfterCount", "availableStopAfterCount")}
                    </View>
                    {this.renderHint()}
                </View>
                <SubmitButton 
                    style={{marginTop:10, marginBottom:10}}
                    onPress={()=>this.setFollowConfig()}
                    enable={this.props.followConfigButtonEnable}
                    text={this.props.isLoading ? LS.str("VERIFING") : LS.str("POSITION_CONFIRM")}
                />
            </View>
            );
    }

    render() {
        return (
            <Modal style={styles.container}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={()=>{this.hide()}}>
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
        marginLeft: 15,
        marginRight: 15,
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
const mapStateToProps = state => {
    return {
        ...state.follow,
    };
};
  
const mapDispatchToProps = {
    showFollowDialog,
    updateFollowConfig,
    sendFollowConfigRequest,
    checkAgreement,
    getCurrentFollowConfig
};
  
export default connect(mapStateToProps, mapDispatchToProps)(FollowScreen);