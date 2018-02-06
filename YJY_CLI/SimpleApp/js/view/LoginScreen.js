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
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation'

var imgSplash = require('../../images/splash.jpg')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var NetworkModule = require('../module/NetworkModule')
var NetConstants = require('../NetConstants')
var ColorConstants = require('../ColorConstants');
export default class  LoginScreen extends React.Component {
    componentDidMount() {
        
    }

    componentWillUnmount() { 
    }


    getValidationCode(){
        

    }

    loginSuccess(responseJson){
        Alert.alert("login success , token:"+responseJson.token)
    }

    onLoginClicked(){
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
					phone: '13601751330',
					verifyCode: '2222'
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

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:48}}>
                    <Image style={{width:120,height:72}} source={require('../../images/icon_candy.png')}/>
                </View>
                <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                    
                    <Text style={{marginBottom:5,color:'#33b5f4',fontSize:10}}>您正在登录糖果市场</Text>
                    <View style={{backgroundColor:'#46bef5',height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TextInput 
                        underlineColorAndroid='transparent'
                        maxLength={11} 
                        placeholderTextColor='white'
                        placeholder='手机号'
                        keyboardType='numeric' 
                        style={{marginLeft:10,color:'white',flex:1}}/>
                        <TouchableOpacity onPress={()=>this.getValidationCode()} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <View style={{marginRight:10,width:1,height:40,backgroundColor:'#50c2f7'}}></View>
                            <Text style={{marginRight:10,color:'white'}}>获取验证码</Text>
                        </TouchableOpacity>  
                    </View>

                    <View style={{backgroundColor:'#46bef5',marginTop:1,height:48,width:width,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TextInput 
                            underlineColorAndroid='transparent'
                            maxLength={6} 
                            placeholderTextColor='white'
                            placeholder='验证码'
                            keyboardType='numeric' 
                            style={{width:width,marginLeft:10,color:'white'}}/> 
                    </View>

                    <TouchableOpacity 
                        onPress={()=>this.onLoginClicked()}
                        style={{
                        alignItems:'center',
                        justifyContent:'center',
                        width:width-50,height:40,backgroundColor:'#30abf0',marginTop:20,borderRadius:15,}}>
                        <Text style={{color:'white'}}>登录</Text>
                    </TouchableOpacity>
                    
                </View>
                <View  style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#6ac1f5'}}>快速登录</Text>
                    <TouchableOpacity onPress={()=>this.onWechatLogin()}>
                     <Image style={{width:48,height:48}} source={require('../../images/icon_wechat.png')}/>
                    </TouchableOpacity>    
                    
                </View>    
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       backgroundColor:ColorConstants.BGBLUE
    }
})


module.exports = LoginScreen;

