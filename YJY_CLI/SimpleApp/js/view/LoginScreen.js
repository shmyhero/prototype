import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import NavBar from './component/NavBar';

var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NetworkModule = require('../module/NetworkModule');
var StorageModule = require('../module/StorageModule');
var NetConstants = require('../NetConstants')
var ColorConstants = require('../ColorConstants');
var LS = require('../LS')
import LogicData from "../LogicData";
const dismissKeyboard = require('dismissKeyboard');
class LoginScreen extends Component {
    constructor(props){
        super(props);

        var state = {hideBackButton:false};

        if(props){
            state = this.convertParametersToState(props, state);
        }
        
        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
            state = this.convertParametersToState(params, state);
        }

        this.state = state;
    }

    convertParametersToState(params, state){
        if(state == undefined){
            state = {};
        }
        if(params.hideBackButton != undefined){
            state.hideBackButton = params.hideBackButton;
        }
        if(params.onLoginFinished != undefined){
            state.onLoginFinished = params.onLoginFinished;
        }
        return state;
    }

    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }


    keyboardWillShow() {
        // this.props.navigation.toggleTabs({
        //     to: 'hidden',
        //     animated: false
        // });
        // this.setState({
        //     isVisible: false
        // })
    }

    keyboardWillHide() {
        // this.props.navigation.toggleTabs({
        //     to: 'shown',
        //     animated: false
        // });
        // this.setState({
        //     isVisible: true
        // })
    }

    componentDidMount() {
        
    }

    componentWillUnmount() { 
        this.keyboardWillShowSub.remove()
        this.keyboardWillHideSub.remove()
    }

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps", nextProps)
        var state = {}
        state = this.convertParametersToState(nextProps, state);
        this.setState(state);
    }

    getValidationCode(){
        

    }

    loginSuccess(responseJson){
        LogicData.setUserData(responseJson);
		StorageModule.setUserData(JSON.stringify(responseJson)).then(()=>{
            //Alert.alert("login success , token:"+responseJson.token)
            if(this.state.onLoginFinished){
                this.state.onLoginFinished();
            }
        });
    }

    onLoginClicked(){

        if(!this.isLoginable()){
            Alert.alert('温馨提示','请输入手机号码和验证码')
            return
        }

        if(NetConstants.CFD_API.POST_USER_SIGNUP_BY_PHONE == undefined){
            Alert.alert(
                'undefined')
        } 
        NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.POST_USER_SIGNUP_BY_PHONE,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({
					phone: this.state.phoneNumber,
					verifyCode: this.state.verifyCode,
				}),
			},
			(responseJson) => {
				this.loginSuccess(responseJson);
			},
			(result) => {
				Alert.alert('提示', result.errorMessage);
			}
		)
    }

    onWechatLogin(){
        
    }


    isLoginable(){
        if((this.state.phoneNumber&&this.state.phoneNumber.length==11) && (this.state.verifyCode&&this.state.verifyCode.length==4)){
            return true;
        }else{
            return false;
        }
    }

    onCancel(){
        console.log('OnCancel')
        dismissKeyboard();
    }

    renderContent(){
        var textLogin = this.isLoginable()?'white':'#6281a6'
        var bgbtn = this.isLoginable()?'#3d6c9d':'#2f5b8b' 

        var HeightSub = 50;
        if (!this.state.hideBackButton){
            HeightSub = 0;
        }

        return (
            <TouchableOpacity activeOpacity={1.0} onPress={()=>this.onCancel()} style={[styles.container, {height:height-HeightSub}]}>
                    <NavBar  backgroundColor='transparent' title="" navigation={this.props.navigation} showBackButton={!this.state.hideBackButton}/>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image style={{width:128,height:128}} source={require('../../images/logo_login.png')}/>
                    </View>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        
                        <Text style={{marginBottom:5,color:'#6699cc',fontSize:11}}>{LS.str("YOU_ARE_LOGIN")}</Text>
                        <View style={{backgroundColor:'#3d6c9d',height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <TextInput 
                            underlineColorAndroid='transparent'
                            maxLength={11} 
                            placeholderTextColor='white'
                            placeholder={LS.str("PHONE_NUM")}
                            keyboardType='numeric'  
                            onChangeText={(text) => {
                                this.setState({
                                    phoneNumber:text
                                })}
                            }
                            style={{marginLeft:10,color:'white',flex:1}}/>
                            <TouchableOpacity onPress={()=>this.getValidationCode()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <View style={{marginRight:10,width:1,height:40,backgroundColor:'#4e85bf'}}></View>
                                <Text style={{marginRight:10,color:'white'}}>{LS.str("GET_VCODE")}</Text>
                            </TouchableOpacity>  
                        </View>

                        <View style={{backgroundColor:'#3d6c9d',marginTop:1,height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <TextInput 
                                underlineColorAndroid='transparent'
                                maxLength={4} 
                                placeholderTextColor='white'
                                placeholder={LS.str("VCODE")}
                                keyboardType='numeric' 
                                onChangeText={(text) => {
                                    this.setState({
                                        verifyCode:text
                                    }) 
                                }}
                                style={{width:width,marginLeft:10,color:'white'}}/> 
                        </View> 
                        
                        <TouchableOpacity 
                            onPress={()=>this.onLoginClicked()}
                            style={{
                            alignItems:'center',
                            justifyContent:'center', 
                            width:width-50,height:40,backgroundColor:bgbtn,marginTop:20,borderRadius:7.5,}}>
                            <Text style={{fontSize:17, color:textLogin}}>{LS.str("LOGIN")}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View  style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:17, color:'#40b7f8'}}>{LS.str("FAST_LOGIN")}</Text>
                        <TouchableOpacity onPress={()=>this.onWechatLogin()}>
                        <Image style={{width:48,height:48}} source={require('../../images/icon_wechat.png')}/>
                        </TouchableOpacity>   
                    </View>     */}
                </TouchableOpacity>
        );
    }

    render() {
        if(Platform.OS == "ios"){
            return (            
                <KeyboardAvoidingView style={{width:width,
                    flex:1}}
                    behavior={"padding"}>
                    <ImageBackground style={{position:"absolute", width:width, height:height}} source={require('../../images/bg_login.jpg')} >                
                    </ImageBackground>
                    {this.renderContent()}
                </KeyboardAvoidingView>
            );
        } else {
            return (            
                <KeyboardAvoidingView style={{width:width,
                    flex:1}}
                    >
                    <ImageBackground style={{position:"absolute", width:width, height:height}} source={require('../../images/bg_login.jpg')} >                
                    </ImageBackground>
                    {this.renderContent()}
                </KeyboardAvoidingView>
            );
        }
    } 
}

const styles = StyleSheet.create({
    container:{
       flex:1, 
    }
})

export default LoginScreen;

