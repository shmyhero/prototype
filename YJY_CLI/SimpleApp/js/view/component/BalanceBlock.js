import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
var ColorPropType = require('ColorPropType');

import { fetchBalanceData } from "../../redux/actions/balance";

class BalanceBlock extends Component {
    static propTypes = {
        errorTextColor: ColorPropType,
        ...Text.propTypes
    };

    static defaultProps = {
        errorTextColor: null,
    }

    componentDidMount() {
        this.props.fetchBalanceData();
    }

    renderError(){
        return (<Text style={{color:this.props.errorTextColor}}
        {...this.props}>{error}</Text>)
    }
    
    render() {
        const { balance, isLoading, errorMessage } = this.props;
        if(isLoading){
            return (
                <Text {...this.props}>--</Text>
            );
        } else if (errorMessage){
            var style={}
            if(this.props.errorTextColor){
                style={color:this.props.errorTextColor}
            }
            return(
                <Text
                    {...this.props}
                    style={style}>{errorMessage}</Text>
            )
        }else{
            return (
                <Text 
                    {...this.props}>
                        {balance}
                </Text>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    }
});

const mapStateToProps = state => {
    return {
        ...state.balance
    };
};

const mapDispatchToProps = {
    fetchBalanceData
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceBlock);