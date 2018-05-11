import React, {Component} from 'react';
import { Image, StyleSheet,Platform, } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { TabNavigator,TabBarBottom } from 'react-navigation';

var ColorConstants = require("./js/ColorConstants");
import LoginScreen from './js/view/LoginScreen';
import HelpScreen from "./js/view/HelpScreen"
import AboutScreen from "./js/view/AboutScreen"
import StockDetailScreen from './js/view/StockDetailScreen';
import MessageScreen from './js/view/MessageScreen';
import DepositTokenScreen from './js/view/depositWithdraw/DepositTokenScreen';
import WithdrawTokenScreen from './js/view/depositWithdraw/WithdrawTokenScreen';
import PublishTweetScreen from './js/view/tweet/PublishTweetScreen';
import StockSearchScreen from './js/view/StockSearchScreen';
import DynamicStatusConfig from './js/view/DynamicStatusConfig';
import BindPurseScreen from './js/view/depositWithdraw/BindPurseScreen';
import TokenDetailScreen from './js/view/depositWithdraw/TokenDetailScreen';
import WithdrawSubmittedPage from './js/view/depositWithdraw/WithdrawSubmittedPage';

var MyHomeScreen = require('./js/view/MyHomeScreen');
var MyHomeScreen3 = require('./js/view/MyHome3Screen');
var TabMainScreen = require('./js/view/TabMainScreen');
import TabMarketScreen from './js/view/TabMarketScreen';
var TabRankScreen = require('./js/view/TabRankScreen');
import TabPositionScreen from './js/view/TabPositionScreen';
import TabMeScreen from './js/view/TabMeScreen';
import FollowScreen from './js/view/FollowScreen';
var SplashScreen = require('./js/view/SplashScreen');
var UserProfileScreen = require('./js/view/UserProfileScreen');
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
    SCREEN_DEPOSIT: "DepositTokenScreen",
    SCREEN_WITHDRAW: "WithdrawTokenScreen",
    SCREEN_WITHDRAW_SUBMITTED: "WithdrawSubmittedPage",
    SCREEN_TWEET: "TweetScreen",
    SCREEN_STOCK_SEARCH: "StockSearchScreen",
    SCREEN_DYNAMIC_STATUS_CONFIG:"DynamicStatusConfig",
    SCREEN_BIND_PURSE: "BindPurseScreen",
    SCREEN_TOKEN_DETAIL: "TokenDetailScreen",
    SCREEN_FOLLOW: "FollowScreen",
}

class CustomTabBar extends Component {
    render(){
        return (
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
        />)
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
        activeTintColor: '#1b9bec',
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
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_SPLASH] = {screen: SplashScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_HOME] = {screen: MainScreenNavigator}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_DETAIL] = {screen: StockDetailScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_LOGIN] = {screen: LoginScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_USER_PROFILE] = {screen: UserProfileScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_HELP] = {screen: HelpScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_ABOUT] = {screen: AboutScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_MESSAGE] = {screen: MessageScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_DEPOSIT] = {screen: DepositTokenScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW] = {screen: WithdrawTokenScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW_SUBMITTED] = {screen: WithdrawSubmittedPage}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_TWEET] = {screen: PublishTweetScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_SEARCH] = {screen: StockSearchScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_DYNAMIC_STATUS_CONFIG] = {screen: DynamicStatusConfig}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_BIND_PURSE] = {screen: BindPurseScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_TOKEN_DETAIL] = {screen: TokenDetailScreen}
mainAppStackNavigatorConfiguration[ViewKeys.SCREEN_FOLLOW] = {screen: FollowScreen,
    navigationOptions: {
        mode: 'modal', // Remember to set the root navigator to display modally.
        headerMode: 'none', // This ensures we don't get two top bars.
    }
}


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
