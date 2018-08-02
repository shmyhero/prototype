//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from "prop-types";
var UIConstants = require("../../UIConstants");
import GlobalStyles from '../../GlobleStyles';
// create a component
class CustomStyleText extends Component {
    static propTypes = {
        ...Text.propTypes
    }

    static defaultProps = {
        style: {}
    }

    render() {       
        return (
            <Text             
                {...this.props}
                style={[
                    GlobalStyles.defaultTextStyle,
                    this.props.style]}
                >
                {this.props.children}
            </Text>
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
export default CustomStyleText;
