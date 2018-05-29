//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
var ColorPropType = require('ColorPropType');
var ColorConstants = require('../../ColorConstants');

const triangleHeight = 7;
const triangleWidth = 7;
// create a component
class TriangleShapeTabBarItem extends Component {
    static propTypes = {
        triangleColor: ColorPropType,
        bottomLineColor: ColorPropType,
        tabName: PropTypes.string,
        isSelected: PropTypes.bool
    }

    defaultProps = {
        isSelected: false,
    }

    constructor(props){
        super(props)
    }

    renderTriangleShape(){
        if(this.props.isSelected){
            return <View style={[styles.TriangleShapeCSS, 
                {borderBottomColor: this.props.triangleColor}
            ]}/>;
        }else{
            return <View style={{height: triangleHeight,backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,}}></View>
        }
    }

    renderBottomLine(){
        if(this.props.bottomLineColor == "transparent"){
            return null;
        }else{
            return (<View style={[styles.bottomLine, {borderColor: this.props.bottomLineColor}]}/>);
        }
    }

    render() {
        return (<View style={{
            backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
            alignSelf:'stretch',
            alignItems:'center',
            paddingTop: 10}}>
            <Text style={{color:"white", marginBottom:10}}>
              {this.props.tabName}
            </Text>
            {this.renderTriangleShape()}
            {this.renderBottomLine()}
        </View>);
    }    
}

// define your styles
const styles = StyleSheet.create({
    bottomLine:{          
        alignSelf:'stretch',
        height:1,
        borderColor:ColorConstants.STOCK_TAB_BLUE,
        borderWidth:1
    },
    TriangleShapeCSS: {
        width: 0,
        height: 0,
        borderLeftWidth: triangleWidth,
        borderRightWidth: triangleWidth,
        borderBottomWidth: triangleHeight,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: ColorConstants.STOCK_TAB_BLUE
    }
});

//make this component available to the app
export default TriangleShapeTabBarItem;
