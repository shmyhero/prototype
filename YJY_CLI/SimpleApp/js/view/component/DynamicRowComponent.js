
import React, { Component } from 'react';
var RN = require('react-native');
import PropTypes from "prop-types";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    Alert
} from 'react-native';
var {height, width} = Dimensions.get('window');
require('../../utils/dateUtils')
import TweetBlock from '../tweet/TweetBlock';
import Swipeout from 'react-native-swipeout';
var ColorConstants = require('../../ColorConstants');
import ViewKeys from '../../ViewKeys';
var LS = require("../../LS")
import CustomStyleText from './CustomStyleText';

class DynamicRowComponentContent extends Component {
    static propTypes = {
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onRowPress: PropTypes.func,
        allowScroll: PropTypes.func,
        close: PropTypes.bool,
        delCallBack: PropTypes.func,
        rowData: PropTypes.object
    }
    
    static defaultProps = {
        onOpen: ()=>{},
        onClose: ()=>{},
        allowScroll: (v)=>{},
        onRowPress: ()=>{},
        close: false,
        delCallBack:()=>{},
        rowData: {},
    }

    shouldComponentUpdate(nextProps, nextState){
        //For better performance
        if(this.props.rowData!=nextProps.rowData || this.props.close!=nextProps.close) {     
            return true;
        }
        return false;
    }

    jump2Detail(name, id){ 
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, 
            {stockCode: id, stockName: name});

        this.props.onRowPress && this.props.onRowPress();
    }

    _onPressButton(rowData){ 
        console.log('this.props.delCallBack = ' + this.props.delCallBack)
        if(this.props.delCallBack){
            console.log('_onPressButton'+rowData.time)
             this.props.delCallBack(rowData.time)
        }
     }

    _onPressToSecurity(rowData){
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, {stockCode: rowData.security.id, stockName: rowData.security.name})
        this.props.onRowPress && this.props.onRowPress();
    } 

    _onPressToUser(rowData){
        this.props.onRowPress && this.props.onRowPress();
        if(rowData.type == 'system'){return}
        var userData = {
            userId:rowData.user.id,
            nickName:rowData.user.nickname,
        }
        this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE, {userData:userData})
    }

    renderItemTrede(rowData){
        if(rowData.type=='open' || rowData.type=='close' ){
            return (
                <TouchableOpacity 
                    onPress={()=>this._onPressToSecurity(rowData)} style={{marginRight:10,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={rowData.position.isLong ? require('../../../images/stock_detail_direction_up_enabled.png') : require('../../../images/stock_detail_direction_down_enabled.png')}
                        style={{width:22,height:22,marginBottom:-3}}>
                    </Image>
                    <CustomStyleText style={{marginRight:2,fontSize:9,color:'#a9a9a9'}}>{rowData.security.name}</CustomStyleText>
                </TouchableOpacity>
            )
        }else{
            return null;
        } 
    }

    renderNewsText(rowData){    
        var text = '';

        if(rowData.type == 'status'){
            text = rowData.status
            return (
                <TweetBlock
                style={{fontSize:15,color:'white',lineHeight:20}}
                value={text} 
                onBlockPressed={(name, id)=>{this.jump2Detail(name, id)}}/>
            )
        }else if(rowData.type == 'open'){ 
            text = rowData.position.invest +" "+ LS.str("MOUNT_X").replace("{1}", LS.getBalanceTypeDisplayText())+" "+rowData.position.leverage
            return (
                <CustomStyleText style={{fontSize:15,color:'white',lineHeight:20}}>
                    {text}
                </CustomStyleText>
            )
        }else if(rowData.type == 'close'){
            var winOrLoss = rowData.position.roi>=0 ? LS.str("PROFIT"):LS.str("LOSS")
            var value = (rowData.position.roi>=0 ? '+':'') + (rowData.position.roi*100).toFixed(2)+'%'
            var valueColor = rowData.position.roi>=0 ? ColorConstants.STOCK_RISE:ColorConstants.STOCK_DOWN;
           
            text = LS.str("CLOSE_POSITION")+" "+winOrLoss;

            return (
                <CustomStyleText style={{fontSize:15,color:'white',lineHeight:20}}>
                    {text+' '}
                    <CustomStyleText style={{color: valueColor}}>
                         {value}
                    </CustomStyleText>
                </CustomStyleText>
            )
        }else if(rowData.type == 'system'){
            text = rowData.body
            text2 = rowData.title

            // console.log('text = ' + text)
            if(text == text2){
                return null
            }else{
                return (
                    <TweetBlock  
                        style={{marginTop:8,marginBottom:5, fontSize:13,color:ColorConstants.SUB_MAIN_COLOR,lineHeight:16}}
                        value={text}
                        onBlockPressed={(name, id)=>{this.jump2Detail(name, id)}} 
                        onPressed={()=>{
                            this.props.onRowPress && this.props.onRowPress();
                        }}/>
                ) 
            } 
        }
    }

    render(){
        var viewHero = this.props.rowData.isRankedUser ? <Image style={{width:21,height:12}} source={LS.loadImage("expert")}/> : null;
        var swipeoutBtns = [{
            backgroundColor:'#ff4240',  
            text:LS.str("DEL"), 
            onPress:()=>this._onPressButton(this.props.rowData)
        }];
        var d = new Date(this.props.rowData.time);
        var timeText = d.getDateSimpleString();

        var title = this.props.rowData.user.nickname;
        var titleStyle = null
        if(this.props.rowData.type == 'system'){
            title = this.props.rowData.title
            titleStyle = {fontSize:15,color:'white'}
        }

        return (
            <View style={styles.thumbnailAll}> 
                <View> 
                    <View style={{marginLeft:20,width:0.5,flex:1,backgroundColor:ColorConstants.TIMER_COLOR}}></View>
                    <View style={{width:40,flexDirection:'row'}}>
                        <CustomStyleText style={{width:30,color:ColorConstants.TIMER_COLOR,marginLeft:7,fontSize:10,alignSelf:'center'}}>{timeText}</CustomStyleText>
                        <Image style={{marginTop:2,marginLeft:4, width:7,height:7.5}} source={require('../../../images/triangle.png')}></Image>
                    </View>
                    <View style={{marginLeft:20,width:0.5,flex:2,backgroundColor:ColorConstants.TIMER_COLOR}}></View>
                </View>
                <Swipeout
                    ref={(ref)=>{this.swipeoutComponent = ref}}
                    // right={swipeoutBtns}
                    autoClose={true}   
                    sensitivity={50}                        
                    close={this.props.close}
                    onOpen={()=>{
                        this.props.onOpen && this.props.onOpen();
                        //console.log("onOpen()")
                    }}
                    scroll={(value)=>{
                        this.props.allowScroll && this.props.allowScroll(value);
                    }}
                    onClose={()=>{
                        this.props.onClose && this.props.onClose();
                        //console.log("onClose()");
                    }}
                    style={{margin:5,borderRadius:8,marginRight:10, width:width-60,backgroundColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG,flex:1}}> 
                    <View style={{margin:5,borderRadius:8,width:width-60,/*backgroundColor:'white',*/flex:1}}>
                        <View style={{flexDirection:'row',margin:5}}>
                            <TouchableOpacity onPress={()=>this._onPressToUser(this.props.rowData)}>
                                <Image source={{uri:this.props.rowData.user.picUrl}}
                                    style={{height:34,width:34,marginTop:10,marginBottom:10,marginRight:10,borderRadius:17}} >
                                </Image>
                            </TouchableOpacity> 
                            <View style={styles.textContainer}>
                                <View style={{flexDirection:'row',marginTop:0,justifyContent:'center',alignItems:'center'}}>
                                    <CustomStyleText style={[styles.textUserName,titleStyle]}>{title}</CustomStyleText>
                                    {viewHero}
                                </View>
                                 
                                {this.renderNewsText(this.props.rowData)}
                            </View>
                            {this.renderItemTrede(this.props.rowData)}
                        </View>      
                    </View>   
                </Swipeout> 
            </View>   
        )
    }
}

class DynamicRowComponent extends Component {
    static propTypes = {
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onRowPress: PropTypes.func,
        allowScroll: PropTypes.func,
        close: PropTypes.bool,
        delCallBack: PropTypes.func,
    }
    
    static defaultProps = {
        onOpen: ()=>{},
        onClose: ()=>{},
        allowScroll: (v)=>{},
        onRowPress: ()=>{},
        delCallBack: ()=>{},
        close: false,
    }    

    constructor(props) {
        super(props); 
         
        this.state={
            translateX: new RN.Animated.Value(0-width*2), 
        }
    }
    
    initAnimate(){
        this.setState( {
            translateX: new RN.Animated.Value(0-width*2), 
        });
    }

    componentDidMount() { 
        if(this.props.rowData.isNew){
            this.animate() 
        }else{
            this.setState( {
                translateX: new RN.Animated.Value(0), 
            });
        }
    } 

    componentWillReceiveProps(props){ 
        // console.log('componentWillReceiveProps + '+this.props.rowData.user.id)
        //console.log("componentWillReceiveProps", props)
        if(props.rowData.isNew){
            this.setState( {
                translateX: new RN.Animated.Value(0-width*2), 
            }, ()=>{
                this.animate()
            });
        }
    }

    componentWillUpdate(){
        // this.initAnimate()
        // this.animate() 
    }

    animate(){ 
        RN.Animated.timing(this.state.translateX, {
            toValue: 0,
            duration: 500,
            easing: RN.Easing.linear
        }).start();
    }

    render() {          
        return(  
            <RN.Animated.View style={{transform:[{translateX:this.state.translateX}],flex:1}}> 
                <DynamicRowComponentContent
                    rowData={this.props.rowData}
                    onOpen={this.props.onOpen}
                    onClose={this.props.onClose}
                    onRowPress={this.props.onRowPress}
                    allowScroll={this.props.allowScroll}
                    delCallBack={this.props.delCallBack}
                    close={this.props.close}
                    navigation={this.props.navigation}
                />
            </RN.Animated.View>
        )
    }
}
 
const styles = StyleSheet.create({
    textHero:{
        fontSize:8,
        alignSelf:'center',
        marginTop:5,
        marginLeft:2,
        paddingTop:1.5,
        paddingBottom:1.5,
        paddingLeft:2,
        paddingRight:2,
        backgroundColor:'#f9b82f',
        borderRadius:2, 
    },
    textContainer: {
        paddingRight: 10,
        flex:1,
        justifyContent: 'center', 
        alignItems: 'flex-start',   
    },
    textUserName:{
        fontSize:12,
        alignSelf:'flex-start', 
        color:'#999999',
        marginRight:2
    },
    thumbnailAll: {
        marginLeft:5,
        marginRight:5,
        marginTop:3,
        flexDirection: 'row',  
    }, 

});
 
export default DynamicRowComponent;
