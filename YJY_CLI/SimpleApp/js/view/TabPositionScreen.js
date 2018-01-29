import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
var ColorConstants = require('../ColorConstants');

//Tab3:仓位
export default class  TabPositionScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel:'仓位',
    tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('../../images/tab3_sel.png')}
            style={[styles.icon, {tintColor: tintColor}]}
          />
        ),
    tabBarOnPress: (scene,jumpToIndex) => {
                         console.log(scene)
                         jumpToIndex(scene.index)
                },
  }

  render() {
    return (
    <View style={styles.mainContainer}>
      <Text>仓位</Text>
    </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.WHITE
    },
    icon: {
      width: 26,
      height: 26,
    },
})

module.exports = TabPositionScreen;

