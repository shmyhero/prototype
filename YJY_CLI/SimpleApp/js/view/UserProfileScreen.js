import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var NavBar = require('./component/NavBar')

export default class  UserProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'UserProfileScreen',

  }
//   leftButtonOnClick={()=>{this.props.navigation.goBack()}} 
  render() {
    return (
      <View>
          <NavBar title={'盈利8888'} showBackButton={true} navigation={this.props.navigation}/>
          <Text>UserProfileScreen</Text>
      </View>

    );
  }
}


module.exports = UserProfileScreen;

