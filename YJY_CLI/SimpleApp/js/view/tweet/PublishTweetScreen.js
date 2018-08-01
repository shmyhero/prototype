//import liraries
import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet,
    Dimensions,
    TextInput, 
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    Alert,
    Keyboard
} from 'react-native';
import CustomStyleText from '../component/CustomStyleText';
import KeyboardSpacer from '../component/KeyboardSpacer';
import NavBar from '../component/NavBar';
import TweetComponent from './TweetComponent';
import ViewKeys from '../../ViewKeys';
import LogicData from '../../LogicData';

var LS = require("../../LS");
var NetConstants = require('../../NetConstants');
var NetworkModule = require('../../module/NetworkModule');
var ColorConstants = require('../../ColorConstants');
var UIConstants = require('../../UIConstants')

var {height, width} = Dimensions.get('window')
const TWEET_WRITER = "TweetWriter"
// create a component
class PublishTweetScreen extends Component {
    constructor(props){
        super(props)

        var state = {
            text: "",
            contentHeight: height-60-UIConstants.HEADER_HEIGHT
        };

        if(this.props.navigation && this.props.navigation.state && this.props.navigation.state.params){
            var params = this.props.navigation.state.params;
            state.onPopOut = params.onPopOut;
        }
        
        this.state = state;
    }

    addLinkBlock() {
        Keyboard.dismiss();
        this.props.navigation.navigate(
            ViewKeys.SCREEN_STOCK_SEARCH,{
            onGetItem: (item)=>{
                this.refs[TWEET_WRITER].insertItem(item)
            }
        });
    }

    handleTextChange(event) {
        const {name, type, value} = event.nativeEvent;
        let processedData = value;
        if(type==='text') {
            processedData = value.toUpperCase();
        } else if (type==='number') {
            processedData = value * 2;
        }
        //this.setState({[name]: processedData})
    }

    pressCommitButton(){
        Keyboard.dismiss();

        var userData = LogicData.getUserData()

        var body = {'text': this.state.text}
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.PUBLISH_TWEET,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
            (responseJson) => {
                if(this.state.onPopOut){
                    this.state.onPopOut();
                }
                this.props.navigation.goBack();
            },
            (result) => {
                Alert.alert(LS.str("TWEET_PUBLISH_FAILED_TITLE"), result.errorMessage);
            }
        )
    }

    renderKeyboardSpacer(){
        if(Platform.OS == "ios"){
            return (<KeyboardSpacer style={{backgroundColor: "white"}}/>)
        }
    }

    contentHeight = 0;

    render() {
        var {height, width} = Dimensions.get('window');

        var containerViewStyle = {};
        if (this.state.contentHeight !=0){
            containerViewStyle.height = this.state.contentHeight;
        }
        
        return (
            <View style={[styles.container]} onLayout={(event)=>{
                    //On Android, if the keyboard shows up, this function will be triggered and will 
                    //recieve the correct view height. But on iOS this way doesn't work. 
                    //So let's use KeyboardSpacer only for iOS. 
                    console.log("event.nativeEvent.layout.height " + event.nativeEvent.layout.height)
                    console.log("height " + height)
                    this.setState({
                        contentHeight: event.nativeEvent.layout.height
                    })
                }}>
                <View style={[{position:'absolute', top:0, left:0, right:0, bottom: 0}, containerViewStyle]}>
                    <NavBar 
                        title={LS.str("TWEET_PUBLISH_TITLE")} showBackButton={true} navigation={this.props.navigation}
                        leftPartOnClick={()=>{
                            Keyboard.dismiss();
                            this.props.navigation.goBack(null);
                        }}
                        textOnRight={LS.str("TWEET_PUBLISH")}
                        rightPartOnClick={()=>this.pressCommitButton()}
                        enableRightText={this.state.text.length>0}/>
                        
                    <TweetComponent ref={TWEET_WRITER}
                        value={this.state.text}
                        onValueChanged={(value)=> {
                            console.log("onValueChanged "  + value)
                            this.setState({text:value})}
                    }/>
                
                    <TouchableHighlight onPress={()=>this.addLinkBlock()} >
                        <View style={styles.bottomActionBar}>
                            <CustomStyleText style={{color:'#666666', fontSize:30}}>@</CustomStyleText>
                            <CustomStyleText style={{color:'#666666'}}>{LS.str("TWEET_PUBLISH_PRODUCTS")}</CustomStyleText>
                        </View>
                    </TouchableHighlight>

                    {this.renderKeyboardSpacer()}
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor:'white',
    },
    bottomActionBar: {
        width:width, 
        height:60,
        backgroundColor:'white', 
        justifyContent: 'center',
        flexDirection:'column', 
        alignItems:'center',
        borderTopWidth: 0.5,
        borderColor: ColorConstants.SEPARATOR_GRAY,

    }
});

//make this component available to the app
module.exports = PublishTweetScreen;
