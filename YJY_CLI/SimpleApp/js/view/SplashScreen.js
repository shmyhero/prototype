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
} from 'react-native';
import { NavigationActions } from 'react-navigation'

var imgSplash = require('../../images/splash.jpg')
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0

export default class  SplashScreen extends React.Component {
    componentDidMount() {
        this.timer = setTimeout(
        () => { 
            console.log('把一个定时器的引用挂在this上'); 
            this.jump2Home();
        },
        1500
        );
    }
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }
    render() {
        return (
            <Image
                source={imgSplash}
                style={{width:width,height:height}}
            />
        );
    }

    jump2Home(){
        const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home'})]
        })
        this.props.navigation.dispatch(resetAction) 
    }
}


module.exports = SplashScreen;

