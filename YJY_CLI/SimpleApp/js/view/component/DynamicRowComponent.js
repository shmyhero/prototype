
import React, { Component } from 'react';
var RN = require('react-native');
import PropTypes from "prop-types";
import {
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert
} from 'react-native';
var {height, width} = Dimensions.get('window');
require('../../utils/dateUtils')
import TweetBlock from '../tweet/TweetBlock';
import Swipeout from 'react-native-swipeout';
var ColorConstants = require('../../ColorConstants');
import { ViewKeys } from '../../../AppNavigatorConfiguration';
var LS = require("../../LS")
 
class DynamicRowComponent extends Component {
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

    renderItemTrede(rowData){
        if(rowData.type=='open' || rowData.type=='close' ){
            return (
                <TouchableOpacity onPress={()=>this._onPressToSecurity(rowData)} style={{marginRight:10,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={rowData.position.isLong ? require('../../../images/stock_detail_direction_up_enabled.png') : require('../../../images/stock_detail_direction_down_enabled.png')}
                        style={{width:22,height:22,marginBottom:-3}}>
                    </Image>
                    <Text style={{marginRight:2,fontSize:9,color:'#a9a9a9'}}>{rowData.security.name}</Text>
                </TouchableOpacity>
            )
        }else{
            return null;
        } 
    }

    jump2Detail(name, id){ 
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, 
            {stockCode: id, stockName: name});
    }

    _onPressButton(){
        
    }

    _onPressToSecurity(rowData){
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, {stockCode: rowData.security.id, stockName: rowData.security.name})
    }

    _onPressToUser(rowData){
        var userData = {
            userId:rowData.user.id,
            nickName:rowData.user.nickname,
        }
        this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE, {userData:userData})
    }

    _onPressToUser(rowData){
        var userData = {
            userId:rowData.user.id,
            nickName:rowData.user.nickname,
        }
        this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE, {userData:userData})
    }

    renderNewsText(rowData){    
        var text = '';

        if(rowData.type == 'status'){
            text = rowData.status
            return (
                <TweetBlock
                style={{fontSize:15,color:'#666666',lineHeight:20}}
                value={text}
                onBlockPressed={(name, id)=>{this.jump2Detail(name, id)}}/>
            )
        }else if(rowData.type == 'open'){ 
            text = rowData.position.invest +" "+ LS.str('MOUNT_X')+" "+rowData.position.leverage+" "+LS.str("MULTIPLE")
            return (
                <Text style={{fontSize:15,color:'#666666',lineHeight:20}}>
                    {text}
                </Text>
            )
        }else if(rowData.type == 'close'){
            var winOrLoss = rowData.position.roi>=0 ? LS.str("PROFIT"):LS.str("LOSS")
            var value = (rowData.position.roi>=0 ? '+':'') + (rowData.position.roi*100).toFixed(2)+'%'
            var valueColor = rowData.position.roi>=0 ? ColorConstants.STOCK_RISE_RED:ColorConstants.STOCK_DOWN_GREEN;
           
            text = LS.str("CLOSE_POSITION")+" "+winOrLoss;

            return (
                <Text style={{fontSize:15,color:'#666666',lineHeight:20}}>
                    {text}
                    <Text style={{color: valueColor}}>
                        {value}
                    </Text>
                </Text>
            )
        }
    } 

    render() { 

        var viewHero = this.props.rowData.isRankedUser ? <Text style={styles.textHero}>{LS.str("EXPERT")}</Text> : null;
          var swipeoutBtns = [
             {
                 backgroundColor:'#ff4240',  
                 text:LS.str("DEL"), 
                 onPress:()=>this._onPressButton(this.props.rowData)
             }
           ]
         var d = new Date(this.props.rowData.time);
         var timeText = d.getDateSimpleString()


        return(  
            <RN.Animated.View style={{transform:[{translateX:this.state.translateX}],flex:1}}> 
                <View style={styles.thumbnailAll}> 
                     <View>
                         <View style={{marginLeft:20,width:0.5,flex:1,backgroundColor:'#1da4f8'}}></View>
                         <View style={{width:40,flexDirection:'row'}}>
                             <Text style={{width:30,color:'#b0dcfe',marginLeft:5,fontSize:10,alignSelf:'center'}}>{timeText}</Text>
                             <Image style={{marginTop:2,marginLeft:4, width:7,height:7.5}} source={require('../../../images/triangle.png')}></Image>
                         </View>
                         <View style={{marginLeft:20,width:0.5,flex:2,backgroundColor:'#1da4f8'}}></View>
                     </View>
                     {/* <View 
                     right={swipeoutBtns} 
                     autoClose={true}   
                     scroll={()=>{}}
                     sensitivity={50}
                     style={{margin:5,borderRadius:8,width:width-60,backgroundColor:'white',flex:1}}
                     >  */}
                     <View style={{margin:5,borderRadius:8,width:width-60,backgroundColor:'white',flex:1}}>
                         <View style={{flexDirection:'row',margin:5}}>
                             <TouchableOpacity onPress={()=>this._onPressToUser(this.props.rowData)}>
                                 <Image source={{uri:this.props.rowData.user.picUrl}}
                                     style={{height:34,width:34,margin:10,borderRadius:17}} >
                                 </Image>
                             </TouchableOpacity> 
                             <View style={styles.textContainer}>
                                 <View style={{flexDirection:'row',marginTop:0}}>
                                     <Text style={styles.textUserName}>{this.props.rowData.user.nickname}</Text>
                                     {viewHero}
                                 </View>
                                 {this.renderNewsText(this.props.rowData)}
                             </View>
                             {this.renderItemTrede(this.props.rowData)}
                         </View>      
                       </View>   
               </View>   
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
        marginTop:5,
        color:'#999999'
    },
    thumbnailAll: {
        marginLeft: 5,
        marginRight:5,
        flexDirection: 'row',  
    }, 

});
 
export default DynamicRowComponent;
