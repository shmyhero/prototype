
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
  ListView,
  Alert,
} from 'react-native'; 
import LogicData from '../LogicData';
import { LIST_HEADER_BAR_HEIGHT } from '../UIConstants';
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window');
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
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(listData),
            rankListData:[
                {   roi: 0,winRate: 0,id: 7,nickname: '--' },
                {   roi: 0, winRate: 0, id: 1, nickname: '--' },
                {   roi: 0,winRate: 0,id: 2,nickname: '--'},
                {   roi: 0,winRate: 0,id: 2,nickname: '--'}
            ],
        };
    }

    componentDidMount () {
         this.onRefresh()
    }

    componentWillUnmount() {
        
    }

    gotoUserProfile(uid,name){ 
        var userData = {
            userId:uid,
            nickName:name,
        }
        this.props.navigation.navigate('UserProfileScreen',{userData:userData})
    }

    onRefresh(){
        this.loadRankData()
        
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
                        }, (responseJson) => { 
                            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                dataSource: ds.cloneWithRows(responseJson),
                            });  
                        },
                        (exception) => {
                            alert(exception.errorMessage)
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
                            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                dataSource: ds.cloneWithRows(responseJson),
                            });  
                        },
                        (exception) => {
                            alert(exception.errorMessage)
                        }
                    );
                })			
            }
     } 

    renderMe(){
        if(this.props.showMeBlock){
            // var roiColor=this.state.rankListData[0].roi > 0?'#ff9999':'green'
            return(
                <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0].id,this.state.rankListData[0].nickname)}>
                    <ImageBackground style={{height:80,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}>
                        <View style={{flexDirection:'row',alignItems:'center'}}> 
                            <View style={{height:34,width:34,marginLeft:28,marginBottom:5,}}>
                                <Image style={{height:34,width:34,borderRadius:17,borderWidth:2,borderColor:ColorConstants.BORDER_LIGHT_BLUE}} source={{uri:this.state.rankListData[0].picUrl}}></Image>
                            </View>    
                            <View style={{marginLeft:10}}>
                                <Text style={{color:'white',fontSize:15,color:'#6693c2'}}>{LS.str("MINE")}</Text>
                                <View style={{flexDirection:'row',marginBottom:5,alignItems:'center'}}>
                                    <Text style={{fontSize:12,color:ColorConstants.BLUETEXT}}>{LS.str("WINRATE")}</Text>
                                    <Text style={{fontSize:16,color:'#d8effc'}}>{(this.state.rankListData[0].winRate*100).toFixed(0)}%</Text>
                                </View>
                            </View>
                        </View>     
                        <View style={{marginRight:30}}>
                            <Text style={{color:'#d8effc',fontWeight: 'bold',}}>{(this.state.rankListData[0].roi*100).toFixed(0)}%</Text>
                        </View> 
                    </ImageBackground>
                </TouchableOpacity>
            )
        }else{
            return <View style={{width:width,height:20}}></View>;
        }
    }

    renderThreeOfOneItem(index,data){
        var bgWidth = (width-39.5)/3;
        var bgHeight = bgWidth;
        var bgHeightLR = bgHeight*201/230;

        var picUri = require('../../images/rank_bg_ag.png')
        if(index == 1){picUri = require('../../images/rank_bg_gd.png')} 
        if(index == 2){picUri = require('../../images/rank_bg_cu.png')} 

        var viewOff = (index == 1)?2:-5
         
        if(data!==null){
            return(
                <TouchableOpacity onPress={()=>this.gotoUserProfile(data.id,data.nickname)} activeOpacity={0.9} style={{flex:1}}>
                    <Image style={styles.headPortrait} source={{uri:data.picUrl}}></Image>
                    <Text style={styles.textTopUserName}>{data.nickname}</Text>
                    <View style={{marginBottom:viewOff, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.textWinRate}>{LS.str("WINRATE")}</Text>
                        <Text style={styles.textTopUserScore}>{(data.winRate*100).toFixed(0)}%</Text>
                    </View>  
                    <ImageBackground style={{marginBottom:-10,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={picUri}>
                        <Text style={styles.textProfit}>{(data.roi*100).toFixed(0)}%</Text>
                    </ImageBackground>
                </TouchableOpacity>
            ) 
        }else{
            return(
                <TouchableOpacity  activeOpacity={0.9} style={{flex:1}}>
                    <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                    <Text style={styles.textTopUserName}>--</Text>
                    <View style={{marginBottom:viewOff, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.textWinRate}>{LS.str("WINRATE")}</Text>
                        <Text style={styles.textTopUserScore}>--</Text>
                    </View>  
                    <ImageBackground style={{marginBottom:-10,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={picUri}>
                        <Text style={styles.textProfit}>--</Text>
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

    _renderRow = (rowData, sectionID, rowID) => {
        var offset = this.props.showMeBlock?1:0;
        if(rowID>=3+offset){
            // var colorRoi = rowData.roi > 0?'#ca3538':'green'
            return( 
                <TouchableOpacity onPress={()=>this.onPressItem(rowData)} style={{height:68,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{height:36,width:36,marginLeft:28,marginBottom:5,borderRadius:18}} source={{uri:rowData.picUrl}}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:15,color:'#454545'}}>{rowData.nickname}</Text>
                            <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</Text>
                                <Text style={{fontSize:14, color:'#454545'}}>{(rowData.winRate*100).toFixed(0)}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginRight:30}}>
                        <Text style={{fontSize:17, fontWeight: 'bold', color:ColorConstants.stock_color(rowData.roi)}}>{(rowData.roi*100).toFixed(0)}%</Text>
                    </View> 
                </TouchableOpacity>
            )
        }else{
            return null
        }
        
    }

    renderFooter(){

    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
      
        if(rowID>=4){
            return (
                <View style={styles.line} key={rowID}>
                    <View style={styles.separator}/>
                </View>
            );
        }else{
            return null;
        }
		
    }
    
    renderHeader(){
        return(
            <View style={{backgroundColor:ColorConstants.BGBLUE}}> 
                {this.renderMe()}
                {this.renderThreeHero()}
            </View>  
        )
    }

    renderListAll(){
        return(
            <View style={{flex:1,width:width,backgroundColor:'white'}}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this.renderSeparator}
                    removeClippedSubviews={false}
                    renderHeader={this.renderHeader.bind(this)}
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
        width:40,
        height:40,
        borderRadius:20,
        alignSelf:'center',
        marginBottom:5,
        borderWidth:2,
        borderColor:ColorConstants.BORDER_LIGHT_BLUE
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:ColorConstants.BLUETEXT,
        fontSize:14,
        marginBottom:2,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'#d8effc',
        fontSize:14,
    },
    textProfit:{
        color:'#ffffff',
        fontSize:15
    },
    textWinRate:{
        fontSize:12,
        color:ColorConstants.BLUETEXT
    },
    separator: {
        marginLeft: 20,
        marginRight:20,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    },
})



module.exports = RankHeroList;



