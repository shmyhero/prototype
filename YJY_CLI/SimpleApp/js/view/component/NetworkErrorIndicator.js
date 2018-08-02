'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';
import CustomStyleText from './CustomStyleText';
var ColorConstants = require('../../ColorConstants')
import JumpBeanText from './JumpBeanText';
var LS = require('../../LS');

class NetworkErrorIndicator extends Component {

  refreshIntervalId = null;

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

    this.state = {
      isLoading: this.props.refreshing ? true : false,
      //loadingDot: 0,
    }

    //this.runAnimation();
  }

  componentDidMount(){
    if(this.state.isLoading){
      this.runAnimation();
    }
  }

  componentWillUnmount(){
    this.stopAnimation();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps){
      if(nextProps.refreshing != this.state.isLoading){
        if(nextProps.refreshing){
          this.runAnimation();
        }else{
          this.stopAnimation();
        }
        
        this.setState({
          isLoading: nextProps.refreshing,
        }, ()=>{
          if(this.state.isLoading){
            this.runAnimation();
          }
        })
      }     
    }
  }

  runAnimation(){
    // if(this.refreshIntervalId == null){
    //   this.refreshIntervalId = setInterval(() => {
    //     var newLoadingDot = this.state.loadingDot;
    //     if(this.state.loadingDot == 3){
    //       newLoadingDot = 0
    //     }else{
    //       newLoadingDot++;
    //     }
    //     this.setState({loadingDot: newLoadingDot})
    //   }, 500);
    // }

    if(this.JumpBeanTextRef){
      this.JumpBeanTextRef.start();
    }
  }

  stopAnimation(){
    // clearInterval(this.refreshIntervalId);
    // this.refreshIntervalId = null;
    if(this.JumpBeanTextRef){
      this.JumpBeanTextRef.stop();
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
      var borderStyle = this.props.isBlue ? {borderColor: '#647e99'} : {};
      var textStyle = this.props.isBlue ? {color: '#dfe3e8'} : {};
      return (
        <TouchableOpacity style={[styles.refreshButton, borderStyle ]} onPress={()=>this.doRefresh()}>
            <CustomStyleText style={[styles.refreshButtonText, textStyle]} >
              {LS.str("REFRESH")}
            </CustomStyleText>
        </TouchableOpacity>
      );
    }
    else{
      return (<View/>)
    }
  }

  // renderLoadingDot(textColor){
  //   return (<View style={{flexDirection:'row'}}>
  //     <View style={[styles.dot, {backgroundColor: this.state.loadingDot > 0 ? textColor: 'transparent'}]}></View>
  //     <View style={[styles.dot, {backgroundColor: this.state.loadingDot > 1 ? textColor: 'transparent'}]}></View>
  //     <View style={[styles.dot, {backgroundColor: this.state.loadingDot > 2 ? textColor: 'transparent'}]}></View>
  //   </View>)
  // }

  render() {
    var textColor = this.props.isBlue ? "#4f81b6" : "#acacac";
    var textStyle = {color: textColor}
    if(this.state.isLoading){
      var loadingImage = this.props.isBlue ? require('../../../images/loading_animation_blue.gif') : require('../../../images/loading_animation_white.gif');
      
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.loadingImage} source={loadingImage}/>
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <JumpBeanText ref={(ref)=>this.JumpBeanTextRef = ref} style={styles.refreshButtonContainer} textStyle={[styles.refreshButtonText, textStyle]}
                text={LS.str("LOADING")}/> 
            </View>
            
          </View>
        </View>
      );
    }else{
      //color: '#6288b0',
      var loadingImage = this.props.isBlue ? require('../../../images/network_connection_error_hint_blue.png') : require('../../../images/network_connection_error_hint_white.png');
      var textColor = this.props.isBlue ? '#6288b0' : '#b4b3b3'
      var additionalText = {color: textColor}
      return (
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Image style={styles.noNetworkImage} source={loadingImage}/>
            <CustomStyleText style={[styles.hintText, additionalText]}>
              {LS.str("NETWORK_ERROR")}
            </CustomStyleText>
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
    fontSize: 17,
    textAlign: 'center',
  },

  refreshButton:{
    borderRadius: 3,
    borderWidth: 1,
    borderColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    width: 115,
    height: 43,
    marginTop: 31,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent:'center',
  },

  refreshButtonContainer:{
    padding: 10,
  },

  refreshButtonText:{
    alignItems: 'stretch',
    textAlign: 'center',
    fontSize: 18,
    color: ColorConstants.COLOR_MAIN_THEME_BLUE,
  },

  noNetworkImage:{
    height: 191,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  },

  loadingImage:{
    height: 191,
    width: 200,
    alignSelf: 'center',
    resizeMode: "stretch",
  },
  dotContainer:{
    flexDirection:'row',
  },
  dot:{
    borderRadius:2,
    height:4,
    width:4,
    margin: 8
  },
});

export default NetworkErrorIndicator;
