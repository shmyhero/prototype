import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Platform,    
} from 'react-native';
import { TabNavigator } from 'react-navigation';
var ColorConstants = require("../ColorConstants");

var CustomTabBar = require('./CustomTabBar');
var TabMainScreen = require('../view/TabMainScreen');
var TabRankScreen = require('../view/TabRankScreen');
var LS = require("../LS");
import TabMarketScreen from '../view/TabMarketScreen';
import TabPositionScreen from '../view/TabPositionScreen';
import TabMeScreen from '../view/TabMeScreen';
//import ViewKeys from '../ViewKeys';
import ViewKeys from "../ViewKeys";

var mainTabNavigatorConfiguration = {}
mainTabNavigatorConfiguration[ViewKeys.TAB_MAIN] = {
    screen: TabMainScreen,
    navigationOptions: {
        tabBarLabel:LS.str('TAB_MAIN_TAB_LABEL'),
        tabBarIcon: ({focused,tintColor }) => (
            <Image
                source={focused?require('../../images/tab0_sel.png'):require('../../images/tab0_unsel.png')}
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
            source={focused?require('../../images/tab1_sel.png'):require('../../images/tab1_unsel.png')}
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
            source={focused?require('../../images/tab2_sel.png'):require('../../images/tab2_unsel.png')}
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
            source={focused?require('../../images/tab3_sel.png'):require('../../images/tab3_unsel.png')}
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
            source={focused?require('../../images/tab4_sel.png'):require('../../images/tab4_unsel.png')}
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

export default MainScreenNavigator;
module.exports = MainScreenNavigator;