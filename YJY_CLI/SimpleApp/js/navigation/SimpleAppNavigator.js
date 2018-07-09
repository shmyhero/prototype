import React, {Component} from 'react';
import {
    StyleSheet,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
var ColorConstants = require("../ColorConstants");
import AppStackNavigatorConfiguration from '../AppStackNavigatorConfiguration';

const SimpleAppNavigator = StackNavigator(AppStackNavigatorConfiguration,  
{
    cardStyle: {
        shadowColor: 'transparent',
        backgroundColor: 'transparent',//ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
    navigationOptions: {
        headerStyle: {
            elevation: 0,
        },
        header: null,
    }
});

export default SimpleAppNavigator;
