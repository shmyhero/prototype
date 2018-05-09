//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent, View, Text, StyleSheet } from 'react-native';
var ColorPropType = require('ColorPropType');

// create a component
class PriceChartView extends Component {
    static propTypes = {
        data: PropTypes.string,
        colorType: PropTypes.number,
        chartType: PropTypes.string,
        isPrivate: PropTypes.bool,
        backgroundColor: ColorPropType,
    }

    static defaultProps = {
        colorType: 0,
        chartType: 'today',	//today, week, month
        isPrivate: false,
        backgroundColor: 'transparent',
    }

    render() {
        return (
            <PriceChartNative {...this.props} />
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

var PriceChartNative = requireNativeComponent('StockChartView', PriceChartView)
//make this component available to the app
export default PriceChartView;
