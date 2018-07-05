import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Platform,
    Keyboard,
    Animated,
    Easing,
    View,
    Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { TabNavigator,TabBarBottom } from 'react-navigation';
var {EventConst, EventCenter} = require('./js/EventCenter');
var ColorConstants = require("./js/ColorConstants");
import SplashScreen from './js/module/SplashScreenModule'

var MyHomeScreen = require('./js/view/MyHomeScreen');
var MyHomeScreen3 = require('./js/view/MyHome3Screen');

var TabMainScreen = require('./js/view/TabMainScreen');
import TabMarketScreen from './js/view/TabMarketScreen';
var TabRankScreen = require('./js/view/TabRankScreen');
import TabPositionScreen from './js/view/TabPositionScreen';
import TabMeScreen from './js/view/TabMeScreen';
var LS = require("./js/LS");

const ViewKeys = {
    TAB_MAIN: "TabMain",
    TAB_MARKET: "TabMarket",
    TAB_RANK: "TabRank",
    TAB_POSITION: "TabPosition",
    TAB_ME: "TabMe",

    SCREEN_SPLASH: "SplashScreen",
    SCREEN_HOME: "Home",
    SCREEN_STOCK_DETAIL: "StockDetail",
    SCREEN_LOGIN: "Login",
    SCREEN_USER_PROFILE: "UserProfileScreen",
    SCREEN_HELP: "Help",
    SCREEN_ABOUT: "AboutScreen",
    SCREEN_MESSAGE: "MessageScreen",
    SCREEN_DEPOSIT_WITHDRAW: "DepositWithdraw",
    SCREEN_DEPOSIT: "DepositTokenScreen",
    SCREEN_WITHDRAW: "WithdrawTokenScreen",
    SCREEN_WITHDRAW_SUBMITTED: "WithdrawSubmittedPage",
    SCREEN_TWEET: "TweetScreen",
    SCREEN_STOCK_SEARCH: "StockSearchScreen",
    SCREEN_DYNAMIC_STATUS_CONFIG:"DynamicStatusConfig",
    SCREEN_BIND_PURSE: "BindPurseScreen",
    SCREEN_TOKEN_DETAIL: "TokenDetailScreen",
    SCREEN_FOLLOW: "FollowScreen",
    SCREEN_SETTINGS: "MeSettingsScreen",
    SCREEN_USER_CONFIG: "MeUserConfigScreen",
    SCREEN_SET_NICKNAME: "MeSettingNicknameScreen",
}

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

var mainTabNavigatorConfiguration = {}
mainTabNavigatorConfiguration[ViewKeys.TAB_MAIN] = {
    screen: TabMainScreen,
    navigationOptions: {
        tabBarLabel:LS.str('TAB_MAIN_TAB_LABEL'),
        tabBarIcon: ({focused,tintColor }) => (
            <Image
                source={focused?require('./images/tab0_sel.png'):require('./images/tab0_unsel.png')}
                style={[styles.icon ]}
            />
        ),   
    }
};

mainTabNavigatorConfiguration[ViewKeys.TAB_MARKET] = {
    screen: TabMarketScreen,
    navigationOptions: {
        tabBarLabel: LS.str('TAB_MARKET_TAB_LABEL'),
        tabBarIcon: ({ focused,tintColor }) => (
            <Image
            source={focused?require('./images/tab1_sel.png'):require('./images/tab1_unsel.png')}
            style={[styles.icon ]}
            />
        ),
    }
};

mainTabNavigatorConfiguration[ViewKeys.TAB_RANK] = {
    screen: TabRankScreen,
    navigationOptions: {
        tabBarLabel:LS.str('TAB_RANK_TAB_LABEL'),
        tabBarIcon: ({ focused,tintColor }) => (
            <Image
            source={focused?require('./images/tab2_sel.png'):require('./images/tab2_unsel.png')}
            style={[styles.icon ]}
            />
        ),
    }
};

mainTabNavigatorConfiguration[ViewKeys.TAB_POSITION] = {
    screen: TabPositionScreen,
    navigationOptions: {
        tabBarLabel:LS.str('TAB_POSITION_TAB_LABEL'),
        tabBarIcon: ({ focused,tintColor }) => (
        <Image
            source={focused?require('./images/tab3_sel.png'):require('./images/tab3_unsel.png')}
            style={[styles.icon ]}
        />
        )
    },
};

mainTabNavigatorConfiguration[ViewKeys.TAB_ME] = {
    screen: TabMeScreen,
    navigationOptions: {
        tabBarLabel:LS.str('TAB_ME_TAB_LABEL'),
        tabBarIcon: ({ focused,tintColor }) => (
        <Image
            source={focused?require('./images/tab4_sel.png'):require('./images/tab4_unsel.png')}
            style={[styles.icon]}
        />     
    )}
};

const MainScreenNavigator = TabNavigator(mainTabNavigatorConfiguration, {
    tabBarPosition: 'bottom',
    lazy: false, //Only render tab content when it is active
    animationEnabled: false, //If lazy load is true, make sure no tab animation is enabled.
    swipeEnabled: false,
    backBehavior: 'none',
    tabBarComponent: CustomTabBar,
    tabBarOptions: {
        activeTintColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
        inactiveTintColor:'grey',
        style:{
            backgroundColor: 'white',
            height:Platform.OS == "android"?58:50, 
        },
        labelStyle: {
            fontSize: 10,
            marginBottom:5,
            marginLeft:0,
            marginRight:0,
            paddingLeft:0,
            paddingRight:0,
        },
        iconStyle: {  
            marginBottom:-5
        },
        showIcon:true, 
        indicatorStyle:{height:0},//for android ,remove line on tab
    }, 
    navigationOptions: (navigation) => ({     
        headerStyle: {
            elevation: 0,
        },
        header: null,
        tabBarOnPress: (options) => {
            options.jumpToIndex(options.scene.index);
        },
    })
});

var mainAppStackNavigatorConfiguration = {}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_SPLASH] = { getScreen: ()=> require('./js/view/SplashScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_HOME] = {screen: MainScreenNavigator}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_DETAIL] = {getScreen: ()=> require('./js/view/StockDetailScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_LOGIN] = {getScreen: ()=> require('./js/view/LoginScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_USER_PROFILE] = {getScreen: ()=> require('./js/view/UserProfileScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_HELP] = {getScreen: ()=> require("./js/view/HelpScreen")}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_ABOUT] = {getScreen: ()=> require("./js/view/AboutScreen")}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_MESSAGE] = {getScreen: ()=> require("./js/view/MessageScreen")}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_DEPOSIT_WITHDRAW] = {getScreen: ()=> require("./js/view/depositWithdraw/DepositWithdrawEntryScreen")}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_DEPOSIT] = {getScreen: ()=> require('./js/view/depositWithdraw/DepositTokenScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW] = {getScreen: ()=> require('./js/view/depositWithdraw/WithdrawTokenScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW_SUBMITTED] = {getScreen: ()=> require("./js/view/depositWithdraw/WithdrawSubmittedPage")}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_TWEET] = {getScreen: ()=> require('./js/view/tweet/PublishTweetScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_SEARCH] = {getScreen: ()=> require('./js/view/StockSearchScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_DYNAMIC_STATUS_CONFIG] = {getScreen: ()=> require('./js/view/DynamicStatusConfig')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_BIND_PURSE] = {getScreen: ()=> require('./js/view/depositWithdraw/BindPurseScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_TOKEN_DETAIL] = {getScreen: ()=> require('./js/view/depositWithdraw/TokenDetailScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_FOLLOW] = {getScreen: ()=> require("./js/view/FollowScreen"),
    navigationOptions: {
        mode: 'modal', // Remember to set the root navigator to display modally.
        headerMode: 'none', // This ensures we don't get two top bars.
    }
}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_SETTINGS] = {getScreen: ()=> require('./js/view/MeSettingsScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_USER_CONFIG] = {screen: ()=> require('./js/view/MeUserConfigScreen')}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_SET_NICKNAME] = {getScreen: ()=> require("./js/view/MeSettingNicknameScreen")}



const SimpleApp = StackNavigator(mainAppStackNavigatorConfiguration,  
{
    cardStyle: {
        shadowColor: 'transparent',
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
    navigationOptions: {
        headerStyle: {
            elevation: 0,
        },
        header: null,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }, 
    icon: {
        width: 26,
        height: 26,
    },
});

export {SimpleApp, ViewKeys};
