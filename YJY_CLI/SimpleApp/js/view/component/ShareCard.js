
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomStyleText from './CustomStyleText';

export default class ShareCard extends React.Component {
    static propTypes = {
        cardWidth: PropTypes.number,
        cardHeight: PropTypes.number,
        cardId: PropTypes.string,
    }

    static defaultProps = {
        cardWidth:20,
        cardHeight:20,
        cardId:'',
    }

    render() {
        return (
            <View style={{borderWidth:1,borderColor:'white',borderRadius:4,padding:5,height:this.props.cardHeight,width:this.props.cardWidth}}>
                <CustomStyleText style={{color:'white'}}>{this.props.cardId}</CustomStyleText>
            </View>
        );
    }
}


const styles = StyleSheet.create({

})



module.exports = ShareCard;



