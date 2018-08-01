import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";

export default class  MyHomeScreen3 extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Profile', {name: 'Lucy'})}
        title="MyHomeScreen3"
      />
    );
  }
}


module.exports = MyHomeScreen3;

