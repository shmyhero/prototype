'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

var ColorConstants = require('../../ColorConstants')
var LS = require('../../LS');

class NetworkErrorIndicator extends Component {

  static propTypes = {
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    isBlue: PropTypes.bool,
  }

  static defaultProps = {
    onRefresh: null,
    refreshing: false,
    isBlue: true,
  }

  constructor(props) {
    super(props);

    console.log("NetworkErrorIndicator this.props.refreshing " + this.props.refreshing)
    this.state = {
      isLoading: this.props.refreshing ? true : false,
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        isLoading: nextProps.refreshing,
      })
    }
  }

  doRefresh(){
    this.setState({
      isLoading: true,
    })
    if(this.props.onRefresh){
      this.props.onRefresh();
    }
  }

  stopRefresh(){
    this.setState({
      isLoading: false,
    })
  }

  renderRefreshButton() {
    if(this.props.onRefresh){
      return (
        <TouchableOpacity style={[styles.refreshButton, {borderColor: ColorConstants.TITLE_BLUE,}]} onPress={()=>this.doRefresh()}>
          <View>
            <Text style={[styles.refreshButtonText,{color: ColorConstants.TITLE_BLUE,}]} >
              刷新
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    else{
      return (<View/>)
    }
  }

  render() {
    if(this.state.isLoading){
      var loadingImage = this.props.isBlue ? require('../../../images/loading_animation_blue.gif') : require('../../../images/loading_animation_white.gif');
      
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.loadingImage} source={loadingImage}/>
          </View>
        </View>
      );
    }else{
      //color: '#6288b0',
      var loadingImage = this.props.isBlue ? require('../../../images/network_connection_error_hint_blue.png') : require('../../../images/network_connection_error_hint_white.png');
      var additionalText = {color: this.props.isBlue ? '#6288b0' : '#b4b3b3'}
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.noNetworkImage} source={loadingImage}/>
            <Text style={[styles.hintText, additionalText]}>
              {LS.str("NETWORK_ERROR")}
            </Text>
            {this.renderRefreshButton()}
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  contentWrapper:{
    height: 260,
    flexDirection: 'column',
  },

  hintText:{
    color: '#b4b3b3',
    fontSize: 12,
  },

  refreshButton:{
    borderRadius: 3,
    borderWidth: 1,
    borderColor: ColorConstants.TITLE_BLUE,
    width: 115,
    height: 43,
    marginTop: 31,
    marginBottom: 20,
    alignSelf: 'center',
  },

  refreshButtonText:{
    padding: 10,
    alignItems: 'stretch',
    textAlign: 'center',
    fontSize: 18,
    color: ColorConstants.TITLE_BLUE,
  },

  noNetworkImage:{
    height: 164,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  },

  loadingImage:{
    height: 191,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  }
});

export default NetworkErrorIndicator;
