import React, {Component} from 'react';
import {
    Platform,
    Keyboard,
    Animated,
    Easing,
} from 'react-native';
import { TabBarBottom } from 'react-navigation';
var {EventConst, EventCenter} = require('../EventCenter');
import SplashScreen from '../module/SplashScreenModule'
import ViewKeys from '../ViewKeys';

var LS = require("../LS");

class CustomTabBar extends Component {
    updateTabbarSubscription = null

    constructor(props){
        super(props)

        var height = 100;
        if(props.style && props.style.height){
            height = props.style.height
        }

        this.state = {
            showTab: true,
            tabbarOpacity: new Animated.Value(1),
            originHeight: height,
            height: new Animated.Value(height),
        }
    }

    componentWillReceiveProps(props){
        if(props.style && props.style.height && props.style.height != this.props.style.height){
            this.setState({
                height: new Animated.Value(props.height),
            })
        }
    }

    componentDidMount(){
        this.updateTabbarSubscription = EventCenter.getEventEmitter().addListener(EventConst.UPDATE_TABBAR, () => {
            console.log("UPDATE_TABBAR")
            this.forceUpdate()
        });

        console.log("Splash hide");
        SplashScreen.hide();//关闭启动屏幕
        if (Platform.OS == "android") {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', () => this.keyboardWillShow())
            this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', () => this.keyboardWillHide())
        }
    }
    
    componentWillUnmount(){
        this.updateTabbarSubscription && this.updateTabbarSubscription.remove()
        if (Platform.OS == "android"){
            this.keyboardWillShowSub && this.keyboardWillShowSub.remove()
            this.keyboardWillHideSub && this.keyboardWillHideSub.remove()
        }
    }

    keyboardWillShow(){
        Animated.timing(
            this.state.height, // The value to drive
            {
                toValue: 0, // Animate to final value of 1
                duration: 300,
                easing: Easing.cubic
            }
        ).start(); // Start the animation
    }

    keyboardWillHide(){
        Animated.timing(
            this.state.height, // The value to drive
            {
                toValue: this.state.originHeight, // Animate to final value of 1
                duration: 500,
                easing: Easing.cubic
            }
        ).start(); // Start the animation
    }

    render(){
        if(this.state.showTab){
            return (
                <Animated.View style={{height:this.state.height}}>
                    <TabBarBottom
                        {...this.props}
                        getLabel={(scene)=>{
                            try{
                                console.log("scene.route.routeName", scene.route.routeName)
                                switch(scene.route.routeName){
                                    case ViewKeys.TAB_MAIN:
                                        return LS.str('TAB_MAIN_TAB_LABEL');
                                    case ViewKeys.TAB_MARKET:
                                        return LS.str('TAB_MARKET_TAB_LABEL');
                                    case ViewKeys.TAB_RANK:
                                        return LS.str('TAB_RANK_TAB_LABEL');
                                    case ViewKeys.TAB_POSITION:
                                        return LS.str('TAB_POSITION_TAB_LABEL');
                                    case ViewKeys.TAB_ME:
                                        return LS.str('TAB_ME_TAB_LABEL');
                                    return ""
                                }
                            }catch(e){
                                return ""
                            }
                        }}
                />
            </Animated.View>);
        }else{
            return null;
        }
    }
}

export default CustomTabBar;
module.exports = CustomTabBar;

