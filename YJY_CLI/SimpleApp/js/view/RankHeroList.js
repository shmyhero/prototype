
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  FlatList,
  Alert,
  Platform
} from 'react-native'; 
import LogicData from '../LogicData';
import CustomStyleText from './component/CustomStyleText';
import UserBlock from './component/UserBlock'
import ViewKeys from '../ViewKeys';
import { LIST_HEADER_BAR_HEIGHT } from '../UIConstants';
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window');
import LottieView from 'lottie-react-native';
import anim from '../../images/animation/data.json';
var {EventCenter,EventConst} = require('../EventCenter');

var LS = require("../LS")
var listData = []

export default class  RankHeroList extends React.Component {
    static propTypes = {
        showMeBlock: PropTypes.bool,
    }

    static defaultProps = {
        showMeBlock: false,
    }

    constructor(props){
        super(props);
        this.state = {
            dataSource: listData,
            rankListData:[
                {   roi: 0,winRate: 0,id: 7,nickname: '--' },
                {   roi: 0, winRate: 0, id: 1, nickname: '--' },
                {   roi: 0,winRate: 0,id: 2,nickname: '--'},
                {   roi: 0,winRate: 0,id: 2,nickname: '--'}
            ],
        }; 
    }
    
    componentWillMount(){
        tabSwitchedSubscription = EventCenter.getEventEmitter().addListener(EventConst.RANKING_TAB_PRESS_EVENT, () => {
            console.log("RANKING_TAB_PRESS_EVENT")
            this.tabPressed();
        });
    }

    componentDidMount () {
        this.onRefresh()
    }

    componentWillUnmount(){
        tabSwitchedSubscription && tabSwitchedSubscription.remove();
    }

    gotoUserProfile(uid,name){ 
        var userData = {
            userId:uid,
            nickName:name,
        }
        
        this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE,{userData:userData})
    }

    onRefresh(){
        console.log("onRefresh")
        this.loadRankData()
    }

    tabPressed(){ 
        this.onRefresh()
        
        //this.animation && this.animation.reset()
        if(this.animation){
            console.log("play this.animation", this.animation == null)
            if(Platform.OS == "ios"){
                setTimeout(()=>{
                    console.log("this.animation", this.animation == null)
                    this.animation && this.animation.play();
                }, 1000)
            }else{
                setTimeout(()=>{
                    console.log("this.animation", this.animation == null)
                    this.animation && this.animation.play();
                }, 500)
            }
        }
	}
 

    loadRankData(){   
        if(LogicData.isLoggedIn()){
                var userData = LogicData.getUserData();
                this.setState({
                    isDataLoading: true,
                }, ()=>{
                    NetworkModule.fetchTHUrl(
                        NetConstants.CFD_API.RANK_TWO_WEEKS,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            showLoading: true,
                            cache:'offline'
                        }, (responseJson) => { 
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                dataSource: responseJson,
                            });  
                        },
                        (exception) => {
                            //alert(exception.errorMessage)
                        }
                    );
                })			
            }else {
                this.setState({
                    isDataLoading: true,
                }, ()=>{
                    NetworkModule.fetchTHUrl(
                        NetConstants.CFD_API.RANK_TWO_WEEKS,
                        {
                            method: 'GET', 
                            showLoading: true,
                        }, (responseJson) => { 
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                dataSource: responseJson,
                            });  
                        },
                        (exception) => {
                            //alert(exception.errorMessage)
                        }
                    );
                })			
            }
     } 

    renderMe(rowData, rowID){       
        if(this.props.showMeBlock){
            return (
                <View >
                    {this.renderUserRow(rowData, rowID)}
                    <View style={{height:10, backgroundColor:'#cccccc'}}></View>
                </View>
            )
            // // var roiColor=this.state.rankListData[0].roi > 0?'#ff9999':'green'
            // return(
            //     <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0].id,this.state.rankListData[0].nickname)}>
            //         <View style={{height:80,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            //         {/* <ImageBackground style={{height:80,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}> */}
            //             <View style={{flexDirection:'row',alignItems:'center'}}> 
            //                 <View style={{height:46,width:46,marginLeft:28,marginBottom:5,}}>
            //                     <Image style={{height:46,width:46,borderRadius:23,borderWidth:1,borderColor:ColorConstants.BORDER_LIGHT_BLUE}} source={{uri:this.state.rankListData[0].picUrl}}></Image>
            //                 </View>    
            //                 <View style={{marginLeft:10}}>
            //                     <CustomStyleText style={{color:'white',fontSize:15,color:'#6693c2'}}>{LogicData.getMeData().nickname}</CustomStyleText>
            //                     <View style={{flexDirection:'row',marginBottom:5,alignItems:'center'}}>
            //                         <CustomStyleText style={{fontSize:12,color:ColorConstants.BLUETEXT}}>{LS.str("WINRATE")}</CustomStyleText>
            //                         <CustomStyleText style={{fontSize:16,color:'#d8effc',fontWeight:'bold'}}>{(this.state.rankListData[0].winRate*100).toFixed(0)}%</CustomStyleText>
            //                     </View>
            //                 </View>
            //             </View>     
            //             <View style={{marginRight:30}}>
            //                 <CustomStyleText style={{color:'#d8effc',fontWeight: 'bold',}}>{profit}%</CustomStyleText>
            //             </View> 
            //         {/* </ImageBackground> */}
            //         </View>
            //     </TouchableOpacity>
            // )
        }else{
            return <View style={{width:width,height:20}} ></View>;
        }
    }

    renderThreeOfOneItem(index,data){
        var bgWidth = (width-38)/3;
        var bgHeight = bgWidth;
        var bgHeightLR = bgHeight*204/230;

        var picUri = require('../../images/rank_bg_ag.png')
        if(index == 1){picUri = require('../../images/rank_bg_gd.png')} 
        if(index == 2){picUri = require('../../images/rank_bg_cu.png')} 

        var viewOff = (index == 1)?0:-7
         
        if(data!==null){
            return(
                <TouchableOpacity onPress={()=>this.gotoUserProfile(data.id,data.nickname)} activeOpacity={0.9} style={{flex:1}}>
                    <Image style={styles.headPortrait} source={{uri:data.picUrl}}></Image>
                    <CustomStyleText style={styles.textTopUserName}>{data.nickname}</CustomStyleText>
                    <View style={{marginBottom:viewOff, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <CustomStyleText style={styles.textWinRate}>{LS.str("WINRATE")}</CustomStyleText>
                        <CustomStyleText style={styles.textTopUserScore}>{(data.winRate*100).toFixed(0)}%</CustomStyleText>
                    </View>  
                    <ImageBackground style={{marginBottom:0,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={picUri}>
                        <CustomStyleText style={styles.textProfit}>{(data.roi*100).toFixed(0)}%</CustomStyleText>
                    </ImageBackground>
                </TouchableOpacity>
            ) 
        }else{
            return(
                <TouchableOpacity  activeOpacity={0.9} style={{flex:1}}>
                    <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                    <CustomStyleText style={styles.textTopUserName}>--</CustomStyleText>
                    <View style={{marginBottom:viewOff, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <CustomStyleText style={styles.textWinRate}>{LS.str("WINRATE")}</CustomStyleText>
                        <CustomStyleText style={styles.textTopUserScore}>--</CustomStyleText>
                    </View>  
                    <ImageBackground style={{marginBottom:0,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={picUri}>
                        <CustomStyleText style={styles.textProfit}>--</CustomStyleText>
                    </ImageBackground>
                </TouchableOpacity>
            ) 
        }
        
    }

    renderThreeHero(){ 
        var bgWidth = (width-39.5)/3;
        var bgHeight = bgWidth;
        var bgHeightLR = bgHeight*201/230;
        var offset = this.props.showMeBlock?1:0;
        var length = this.state.rankListData.length
        
        var item0 = (1+offset<=length-1)?this.state.rankListData[1+offset]:null
        var item1 = (0+offset<=length-1)?this.state.rankListData[0+offset]:null
        var item2 = (2+offset<=length-1)?this.state.rankListData[2+offset]:null
        return(
            <View style={{marginTop:0}}>
                <ImageBackground style={styles.containerAll}>
                    {this.renderThreeOfOneItem(0,item0)}
                    {this.renderThreeOfOneItem(1,item1)}
                    {this.renderThreeOfOneItem(2,item2)}
                </ImageBackground>
            </View>
        )
    }

    onPressItem(rowData){
       this.gotoUserProfile(rowData.id,rowData.nickname)
    }

    renderUserRow(rowData, id){
        return (
            <UserBlock 
                style={{width:width}}
                rowData={rowData} 
                key={id}
                onPressItem={(v)=>this.onPressItem(v)}/>
         );
    }

    _renderRow = (data) => {
        var rowData = data.item;
		var rowID = data.index;

        var offset = this.props.showMeBlock?1:0;
        if(rowID == 0 && this.props.showMeBlock){
            return this.renderMe(rowData, rowID);
        }else if(rowID>=offset && rowData.id != this.state.rankListData[0].id){
            return this.renderUserRow(rowData, rowID);
        //     // var colorRoi = rowData.roi > 0?'#ca3538':'green'
        //     return( 
        //         <TouchableOpacity  activeOpacity={0.9} onPress={()=>this.onPressItem(rowData)} style={{height:70,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row',backgroundColor:'white'}}>
        //             <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:2}}>
        //                 <Image style={{height:46,width:46,marginLeft:28,marginBottom:5,borderRadius:23 }} source={{uri:rowData.picUrl}}></Image>
        //                 <View style={{marginLeft:10}}>
        //                     <CustomStyleText style={{fontSize:15,color:'#454545'}}>{rowData.nickname}</CustomStyleText>
        //                     <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
        //                         <CustomStyleText style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</CustomStyleText>
        //                         <CustomStyleText style={{fontSize:14, color:'#454545'}}>{(rowData.winRate*100).toFixed(0)}%</CustomStyleText>
        //                     </View>
        //                 </View>
        //             </View>
        //             <View style={{marginRight:30}}>
        //                 <CustomStyleText style={{fontSize:17, fontWeight: 'bold', color:ColorConstants.stock_color(profit)}}>{profit}%</CustomStyleText>
        //             </View> 
        //         </TouchableOpacity>
        //     )
        }else{
            return null
        }
    }

    renderFooter(){

    }

    renderSeparator(data) {
        var rowData = data.item;
		var rowID = data.index;
        return (
            <View style={styles.line}>
                <View style={styles.separator}>
                    {/* <View style={styles.separatorShort}/> */}
                </View>
            </View>
        );
    }
    
    showMarket(){
        this.props.navigation.navigate(ViewKeys.TAB_MARKET)
    }

    renderHeaderImage(){
        var imageHeight = width/75*42;
        return (
            <View style={{height: imageHeight, width:width}}>               
                <LottieView 
                    ref={animation => {
                        this.animation = animation;
                        console.log("set this.animation", this.animation == null)
                    }}
                    //progress={0.1}
                    loop={false}
                    style={{height: imageHeight, width:width}}
                    source={require('../../images/animation/soda_loader.json')}
                    //source={anim}
                />
                <TouchableOpacity style={{position:'absolute', top:0, left:0}} onPress={()=>this.showMarket()}>
                    <CustomStyleText style={{color:'white', fontSize:50}}>TRADE STOCK WITH CRYPO</CustomStyleText>
                </TouchableOpacity>
            </View>
        )
    }

    renderHeader(){
        return(
            <View style={{backgroundColor:ColorConstants.BGBLUE}}> 
                {this.renderHeaderImage()}
                {/* <View style={{height:10}}></View>
                {this.renderThreeHero()} */}
            </View>  
        )
    }

    renderListAll(){
        console.log("this.state.dataSource")
        return(
            <View style={{flex:1,width:width,marginTop:5}}>
                <FlatList
                    style={{backgroundColor:'white'}}
                    enableEmptySections={true}
                    data={this.state.dataSource}
                    renderItem={(data)=>this._renderRow(data)}
                    ItemSeparatorComponent={(data)=>this.renderSeparator(data)}
                    removeClippedSubviews={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
    render() {
        return (
            <View style={{flex:1}}> 
                 {this.renderListAll()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    list: {
		flex: 1, 
	},
    containerAll:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end', 
        height:198,
        width:width,
        paddingLeft:20,
        paddingRight:20,
    },
    headPortrait:{
        width:46,
        height:46,
        borderRadius:23,
        alignSelf:'center',
        marginBottom:10,
        borderWidth:1,
        borderColor:ColorConstants.BORDER_LIGHT_BLUE
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:ColorConstants.BLUETEXT,
        fontSize:12,
        marginBottom:0,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'#d8effc',
        fontSize:14,
        fontWeight:'bold'
    },
    textProfit:{
        color:'#ffffff',
        fontSize:15,
        fontWeight:'bold'
    },
    textWinRate:{
        fontSize:12,
        color:ColorConstants.BLUETEXT,
        
    },
    separator: {
        marginLeft: 20,
        marginRight:20,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    }, 
    
})



module.exports = RankHeroList;



