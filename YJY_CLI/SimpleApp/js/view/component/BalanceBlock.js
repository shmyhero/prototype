import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
var ColorPropType = require('ColorPropType');
import CustomStyleText from './CustomStyleText'

import { fetchBalanceData } from "../../redux/actions/balance";

class BalanceBlock extends Component {
    static propTypes = {
        errorTextColor: ColorPropType,
        ...CustomStyleText.propTypes
    };

    static defaultProps = {
        errorTextColor: null,
    }

    componentDidMount() {
        this.props.fetchBalanceData();
    }
    
    render() {
        const { balance, isLoading, errorMessage } = this.props;
        if(isLoading){
            return (
                <CustomStyleText {...this.props}>--</CustomStyleText>
            );
        } else if (errorMessage){
            var style={}
            if(this.props.errorTextColor){
                style={color:this.props.errorTextColor}
            }
            return(
                // <CustomStyleText
                //     {...this.props}
                //     style={style}>{errorMessage}</CustomStyleText>
                <CustomStyleText
                    {...this.props}>--</CustomStyleText>
            )
        }else{
            //balance.maxDecimal(2)
            return (
                <CustomStyleText 
                    {...this.props}>
                        {balance.toFixed(2)}
                </CustomStyleText>
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