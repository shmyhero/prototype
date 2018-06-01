//import liraries
import React, { Component } from 'react';
import { View, 
    Text, 
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform
} from 'react-native';
import NavBar from "../component/NavBar";
var ColorConstants = require("../../ColorConstants");
var {height,width} = Dimensions.get('window');
import { ViewKeys } from '../../../AppNavigatorConfiguration';
import LinearGradient from 'react-native-linear-gradient'
var UIConstants = require("../../UIConstants");
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");
import LogicData from "../../LogicData";
import SubmitButton from "../component/SubmitButton";
var LS = require("../../LS");
import { bindWallet } from '../../redux/actions'
import { connect } from 'react-redux';

// create a component

const necessaryAddressLengthWithout0x = 40
const necessaryAddressLength = 42
class BindPurseScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            thtAddress: "",
            isButtonEnable: false,
            isRequestSending: false
        }
    }

    updateButtonStatus(){
        this.setState({
            isButtonEnable: this.isReadyToBind()
        })
    }

    componentDidMount(){
        this.textInputRef && this.textInputRef.focus()
    }

    isReadyToBind(){
        if(this.state.thtAddress
            && (this.state.thtAddress.length == necessaryAddressLength
            || this.state.thtAddress.length == necessaryAddressLengthWithout0x)
            && !this.state.isRequestSending){
            return true;
        }else{
            return false;
        }
    }

    updateAddress(thtAddress){
        var state = {
            thtAddress: thtAddress
        };        
        this.setState(state, ()=>this.updateButtonStatus());
    }

    bindCard(){
        
        this.setState({
            isRequestSending: true,
        }, ()=>{
            this.updateButtonStatus();

            var userData = LogicData.getUserData();

            var thtAddress = this.state.thtAddress
            if (this.state.thtAddress.length == necessaryAddressLengthWithout0x){
                thtAddress = "0x" + thtAddress
            }

            NetworkModule.fetchTHUrl(
                NetConstants.CFD_API.BIND_PURSE_ADDRESS,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        "address": thtAddress,
                    }),
                },
                (response)=>{
                    this.props.bindWallet(this.state.thtAddress);
                    var nextView = this.props.navigation.state.params.nextView;
                    this.props.navigation.navigate(nextView, {backFrom: this.props.navigation.state.key});
                },
                (error)=>{
                    alert(error.errorMessage)
                    this.setState({
                        isRequestSending: false,
                    }, ()=>{
                        this.updateButtonStatus();
                    });
                });
        });
    }
    
    render() {
        return (
            <View style={styles.container}>                
                <View style={{flex:1}}>
                    <LinearGradient
                        start={{x:0.0, y:0}}
                        end={{x:1.0, y:0.0}}
                        style={{height: UIConstants.HEADER_HEIGHT + 50, width:width, alignItems:'center', justifyContent:'flex-end'}}
                        colors={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}>
                        <View style={{height:50, alignItems:'center', justifyContent:'center'}}>
                            <Image style={{height:35, width:170}} source={
                                //require("../../../images/zh-cn/bind_purse_address_hint.png")
                                //require("../../../images/en-us/bind_purse_address_hint.png")
                                LS.loadImage("bind_purse_address_hint")
                                }/>
                        </View>
                    </LinearGradient>
                    <View style={styles.contentContainer}>
                        <View style={styles.rowContainer}>
                            <Text style={{fontSize:13, color:"#5a5a5a"}}>{LS.str("BIND_PURSE_ADDRESS_HINT")}</Text>
                            <TextInput
                                ref={(ref)=>this.textInputRef = ref}
                                underlineColorAndroid={"transparent"}
                                style={{height: Platform.OS === "ios" ? 50 : 70, fontSize:13, color:"#000000"}}
                                multiline={true}
                                maxLength={necessaryAddressLength}
                                onChangeText={(thtAddress)=>this.updateAddress(thtAddress)}
                                value={this.state.thtAddress}/>
                        </View>
                        <View style={styles.hintContainer}>
                            <Text style={{fontSize:13, color:"#cccccc"}}>
                                {LS.str("BIND_PURSE_HINT")}
                            </Text>
                        </View>
                        <View style={{flex:1}}></View>
                        <SubmitButton onPress={()=>this.bindCard()}
                            enable={this.state.isButtonEnable}
                            text={LS.str("BIND_CONFIRM")} />
                    </View>
                </View>
                <View style={{position:'absolute', top:0, left:0, right:0, width: width, height:100}}>
                    <NavBar 
                        title={LS.str("BIND_PURSE_HEADER")}
                        showBackButton={true}
                        backgroundColor="transparent"
                        navigation={this.props.navigation}
                    />
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
        alignItems: 'center',
        backgroundColor: 'white'
    },
    contentContainer:{
        padding: 15, 
        flex:1,
    },
    headerBackground:{
        width:width, 
        height: 150
    },
    rowContainer: {
        padding: 15, 
        borderWidth: 1, 
        borderColor: "#dddddd",
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'column'
    },
    hintContainer:{
        marginTop: 30,
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
        ...state.meData,
    };
  };
  
  const mapDispatchToProps = {
    bindWallet
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(BindPurseScreen);
  
  