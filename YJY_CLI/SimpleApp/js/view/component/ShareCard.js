
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PropTypes,
  Image,
  TouchableOpacity,
} from 'react-native';

export default class ShareCard extends React.Component {

    static defaultProps = {
        cardWidth:20,
        cardHeight:20,
        cardId:'',
    }

    render() {
        return (
            <View style={{borderWidth:1,borderColor:'white',borderRadius:4,padding:5,height:this.props.cardHeight,width:this.props.cardWidth}}>
                <Text style={{color:'white'}}>{this.props.cardId}</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({

})



module.exports = ShareCard;



