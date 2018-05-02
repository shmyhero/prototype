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
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import NavBar from './component/NavBar';

var imgSplash = require('../../images/splash.jpg')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NetworkModule = require('../module/NetworkModule');
var StorageModule = require('../module/StorageModule');
var NetConstants = require('../NetConstants')
var ColorConstants = require('../ColorConstants');
import LogicData from "../LogicData";

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

    componentDidMount() {
        
    }

    componentWillUnmount() { 
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

    render() {
        var textLogin = this.isLoginable()?'white':'#40b7f8'
        return (
            <ScrollView style={{width:width,height:height-50}}>
             
            <View style={styles.container}>
                <NavBar title="" navigation={this.props.navigation} showBackButton={!this.state.hideBackButton}/>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:128,height:128}} source={require('../../images/app_icon.png')}/>
                </View>
                <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                    
                    <Text style={{marginBottom:5,color:'#60cafa',fontSize:11}}>您正在登录糖果市场</Text>
                    <View style={{backgroundColor:'#3ebdf8',height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TextInput 
                        underlineColorAndroid='transparent'
                        maxLength={11} 
                        placeholderTextColor='white'
                        placeholder='手机号'
                        keyboardType='numeric' 
                        onChangeText={(text) => {
                            this.setState({
                                phoneNumber:text
                            })}
                        }
                        style={{marginLeft:10,color:'white',flex:1}}/>
                        <TouchableOpacity onPress={()=>this.getValidationCode()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <View style={{marginRight:10,width:1,height:40,backgroundColor:'#50c2f7'}}></View>
                            <Text style={{marginRight:10,color:'white'}}>获取验证码</Text>
                        </TouchableOpacity>  
                    </View>

                    <View style={{backgroundColor:'#3ebdf8',marginTop:1,height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TextInput 
                            underlineColorAndroid='transparent'
                            maxLength={4} 
                            placeholderTextColor='white'
                            placeholder='验证码'
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
                        width:width-50,height:40,backgroundColor:'#25aaf3',marginTop:20,borderRadius:15,}}>
                        <Text style={{fontSize:17, color:textLogin}}>登录</Text>
                    </TouchableOpacity>
                </View>
                <View  style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:17, color:'#40b7f8'}}>快速登录</Text>
                    <TouchableOpacity onPress={()=>this.onWechatLogin()}>
                     <Image style={{width:48,height:48}} source={require('../../images/icon_wechat.png')}/>
                    </TouchableOpacity>   
                </View>    
            </View>
            </ScrollView>  
        );
    } 
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       height:height-50,
       backgroundColor:ColorConstants.BGBLUE
    }
})

export default LoginScreen;

