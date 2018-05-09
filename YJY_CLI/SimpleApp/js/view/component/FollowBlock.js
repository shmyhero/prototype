//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
    Alert,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import LogicData from '../../LogicData';
var LS = require('../../LS')
import {resetUserInfo, showFollowDialog, sendUnFollowRequest} from "../../redux/actions/follow";
import LinearGradient from 'react-native-linear-gradient';
var ColorConstants = require("../../ColorConstants");
var {height, width} = Dimensions.get('window');
import { connect } from 'react-redux';
// create a component
class FollowBlock extends Component {
    static propTypes = {
        currentFollowTrade: PropTypes.object,
        currentUserId: PropTypes.number
    }

    constructor(props){
        super(props)
    }

    componentDidMount(){
        this.props.resetUserInfo(this.props.currentUserId, this.props.currentFollowTrade);
    }

    componentWillReceiveProps(props){
        if(props.currentUserId != 0 
            && (props.currentFollowTrade != this.props.currentFollowTrade
                || props.currentUserId != this.props.currentUserId)){
            this.props.resetUserInfo(props.currentUserId, props.currentFollowTrade);
        }
    }

    onUnFollowPressed(){
        Alert.alert(
            LS.str("UNFOLLOW_ALERT_TITLE"),
            LS.str("UNFOLLOW_ALERT_MESSAGE"),
            [
                {
                    text: LS.str("UNFOLLOW_ALERT_OK"), 
                    onPress: () => {
                        this.props.sendUnFollowRequest(this.props.currentUserId);
                    }},
                {
                    text: LS.str("UNFOLLOW_ALERT_CANCLE"), 
                    onPress: () => console.log('Cancel Pressed'), 
                    style: 'cancel'
                },
            ]            
        );
    }    
  
    onFollowPressed(){
        console.log("onFollowPressed this.props.userId", this.props.userId);

        
        this.props.showFollowDialog(true, this.props.userId, this.props.followTrade);
    }  

    renderFollow(){
        return (
            <TouchableOpacity style={{height: 60, width:width, backgroundColor:ColorConstants.TITLE_BLUE}}
            onPress={()=>this.onFollowPressed()}>
                <LinearGradient 
                start={{x:0.0, y:0}}
                end={{x:1.0, y:0.0}}
                style={{flex:1, alignItems:'center', justifyContent:'center'}}
                colors={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}>
                <Text style={{color:'white', fontSize:20}}>
                    {LS.str("FOLLOW")}
                </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    renderUnFollow(){
        //Undo Follow
        return (
            <TouchableOpacity style={{height: 60, width:width, backgroundColor:ColorConstants.TITLE_BLUE}}
            onPress={()=>this.onUnFollowPressed()}>
                <LinearGradient 
                    start={{x:0.0, y:0}}
                    end={{x:1.0, y:0.0}}
                    style={{flex:1, alignItems:'center', justifyContent:'center'}}
                    colors={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}>
                    <Text style={{color:'white', fontSize:20}}>
                    {LS.str("UNFOLLOW").replace("{1}", this.props.followTrade.stopAfterCount)}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    render() {
        var userData = LogicData.getUserData();
        if(this.props.userId == userData.userId){
            return null;
        }
        if(this.props.followTrade 
            && this.props.followTrade.investFixed > 0 
            && this.props.followTrade.stopAfterCount > 0 ){
            return this.renderUnFollow()
        }
        return this.renderFollow()
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
const mapStateToProps = (state, ownProps) => {
    return {
        ...state.follow,
        ...ownProps
    };
};
  
const mapDispatchToProps = {
    resetUserInfo,
    showFollowDialog,
    sendUnFollowRequest,
};
  
export default connect(mapStateToProps, mapDispatchToProps)(FollowBlock);
