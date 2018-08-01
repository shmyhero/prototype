import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';

var UIConstants = require('./UIConstants');

const GlobalStyles = StyleSheet.create({
    defaultTextStyle: {fontFamily: UIConstants.DEFAULT_FONT_FAMILY, fontWeight: 'bold'}
})
 
export default GlobalStyles;