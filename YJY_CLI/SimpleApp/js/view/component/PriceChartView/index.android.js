import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes, StyleSheet } from 'react-native';
var ColorPropType = require('ColorPropType');
var ColorConstants = require("../../../ColorConstants");

var LineChartXAxisPosition = require('./LineChartXAxisPosition');
var LineChartYAxisPosition = require('./LineChartYAxisPosition');

var PriceChartPropTypes = {
    data: PropTypes.string,	// JSON format
    noDataText: PropTypes.string,
    noDataTextColor: ColorPropType, 
    drawBackground: PropTypes.bool,
    backgroundColor: ColorPropType,
    lineChartGradient: PropTypes.array,
    xAxisBackground: ColorPropType,
    xAxisDrawLabel: PropTypes.bool,
    leftAxisEnabled: PropTypes.bool,
    rightAxisEnabled: PropTypes.bool,
    dataSetColor: ColorPropType,
    lineWidth: PropTypes.number,
    // colorType: PropTypes.number,

    chartType: PropTypes.string,

    // chartIsActual: PropTypes.bool,

    description: PropTypes.string,

    // descriptionColor: PropTypes.number,

    padding: PropTypes.number,

    xAxisPosition: PropTypes.oneOf(['TOP', 'BOTTOM', 'BOTH_SIDED', 'TOP_INSIDE', 'BOTTOM_INSIDE']),
    xAxisStep: PropTypes.number,
    xAxisLabelCount: PropTypes.number,
    xAxisTextSize: PropTypes.number,
    xAxisPaddingTop: PropTypes.number,
    xAxisPaddingBottom: PropTypes.number,

    // leftAxisMaxValue: PropTypes.number,

    // leftAxisMinValue: PropTypes.number,

    // leftAxisPosition: PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

    // leftAxisLabelCount: PropTypes.number,

    // leftAxisTextSize: PropTypes.number,

    // leftAxisDrawLabel: PropTypes.bool,

    // leftAxisLimitLines: PropTypes.array,

    

    // rightAxisMaxValue: PropTypes.number,

    // rightAxisMinValue: PropTypes.number,

    // rightAxisPosition: PropTypes.oneOf(['OUTSIDE_CHART', 'INSIDE_CHART']),

    rightAxisLabelCount: PropTypes.number,
    rightAxisTextSize: PropTypes.number,
    rightAxisDrawLabel: PropTypes.bool,

    drawDataUnderYAxis: PropTypes.bool,
    drawBorders: PropTypes.bool,
    borderColor: ColorPropType,
    textColor: ColorPropType,

    // preCloseColor: ColorPropType,

    // rightAxisDrawGridLines: PropTypes.bool,

    chartPaddingTop: PropTypes.number,
    chartPaddingBottom: PropTypes.number,
    chartPaddingLeft: PropTypes.number,
    paddingRightAxis: PropTypes.number,

  

    // isLandspace:PropTypes.bool,

    // chartIsPrivate:PropTypes.bool,
    ...ViewPropTypes,
}

var theView = {
    name: 'ChartViewNative',
    propTypes: PriceChartPropTypes,

    
};

var PriceChartNative = requireNativeComponent('RCTPriceChart', theView);

// create a component
class PriceChartView extends Component {
    static propTypes = PriceChartPropTypes;
    static defaultProps = {
        //data: '',
        // colorType: 0,
        chartType: 'stockDetailPage',	//stockDetailPage, userHomePage
        description: '',
        // chartIsActual: false,
        // descriptionColor: 0,
        noDataText: '没有数据',
        noDataTextColor: ColorConstants.WHITE,
        drawBackground: false,
        backgroundColor: 'transparent',
        padding: 2 - 2,
        xAxisPosition: LineChartXAxisPosition.BOTTOM,
        xAxisBackground: "transparent",
        xAxisDrawLabel: true,
        leftAxisEnabled: true,
        rightAxisEnabled: true,
        xAxisLabelCount: 4,
        xAxisTextSize: 12,
        dataSetColor: '#000000',
        lineWidth: 4,
        // leftAxisDrawLabel: false,
        // leftAxisLabelCount: 2 - 2,
        rightAxisDrawLabel: true,
        rightAxisLabelCount: 0,
        drawDataUnderYAxis: false,
        drawBorders: true,
        borderColor: 'white',
        // preCloseColor: 'white',
        textColor: 'white',
        // rightAxisDrawGridLines: false,
        chartPaddingTop: 0,
        chartPaddingBottom: 0,
        chartPaddingLeft: 0,
        paddingRightAxis: 0,
        lineChartGradient: [],
        xAxisPaddingTop: 0,
        xAxisPaddingBottom: 0,
        // isLandspace:false,
        // chartIsPrivate:false,
    }
    
    render() {
        return (
            <PriceChartNative {...this.props}/>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default PriceChartView;
