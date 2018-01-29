import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";

export default class  StockDetailScreen extends React.Component {
  static navigationOptions = {
    title: '详情',
    headerMode:'none',
  }

  render() {
    return (
    <View style={styles.mainContainer}>

      <Button
        onPress={() => this.props.navigation.goBack()}
        title="返回"
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'black', 
    },
    icon: {
      width: 26,
      height: 26,
    },
})


module.exports = StockDetailScreen;

