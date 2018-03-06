
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
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');

var {height, width} = Dimensions.get('window');
 
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
            }
        } 

    renderMe(){
        if(this.props.showMeBlock){
            return(
                <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0].id,this.state.rankListData[0].nickname)}>
                    <ImageBackground style={{height:86,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image style={{height:34,width:34,marginLeft:28,marginBottom:5}} source={require('../../images/head_portrait.png')}></Image>
                            <View style={{marginLeft:10}}>
                                <Text style={{color:'white',fontSize:15,color:'#a1dcfd'}}>我的</Text>
                                <View style={{flexDirection:'row',marginBottom:5,alignItems:'center'}}>
                                    <Text style={{fontSize:12,color:'#6dcafe'}}>胜率：</Text>
                                    <Text style={{fontSize:16,color:'#d8effc'}}>{this.state.rankListData[0].winRate.toFixed(2)}%</Text>
                                </View>
                            </View>
                        </View>     
                        <View style={{marginRight:30}}>
                            <Text style={{color:'#ff9999'}}>{this.state.rankListData[0].roi.toFixed(2)}%</Text>
                        </View> 
                    </ImageBackground>
                </TouchableOpacity>
            )
        }else{
            return null;
        }
    }

    renderThreeHero(){
        rate = width/345*0.75;
        return(
            <View>
                <ImageBackground style={styles.containerAll} source={require('../../images/rank_bg_all.png')}>
                    <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[1].id,this.state.rankListData[1].nickname)} activeOpacity={0.9} style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[1].nickname}</Text>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{this.state.rankListData[1].winRate.toFixed(2)}%</Text>
                        </View>    
                        
                        <ImageBackground style={{height:85*rate,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_ag.png')}>
                            <Text style={styles.textProfit}>{this.state.rankListData[1].roi.toFixed(2)}%</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0].id,this.state.rankListData[0].nickname)} activeOpacity={0.9}  style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[0].nickname}</Text>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{this.state.rankListData[0].winRate.toFixed(2)}%</Text>
                        </View>    
                        <ImageBackground style={{height:99*rate ,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_gd.png')}>
                            <Text style={styles.textProfit}>{this.state.rankListData[0].roi.toFixed(2)}%</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>this.gotoUserProfile(this.state.rankListData[2].id,this.state.rankListData[2].nickname)} activeOpacity={0.9}  style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[2].nickname}</Text>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{this.state.rankListData[2].winRate.toFixed(2)}%</Text>
                        </View>    
                        <ImageBackground style={{height:85*rate ,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_cu.png')}>
                            <Text style={styles.textProfit}>{this.state.rankListData[2].roi.toFixed(2)}%</Text>
                        </ImageBackground>  
                    </TouchableOpacity> 
                </ImageBackground>
            </View>
        )
    }

    onPressItem(rowData){
       this.gotoUserProfile(rowData.id,rowData.nickname)
    }

    _renderRow = (rowData, sectionID, rowID) => {
        if(rowID>=0){
            return( 
                <TouchableOpacity onPress={()=>this.onPressItem(rowData)} style={{height:68,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{height:34,width:34,marginLeft:28,marginBottom:5}} source={require('../../images/head_portrait.png')}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:15,color:'#999999'}}>{rowData.nickname}</Text>
                            <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:12, color:'#999999'}}>胜率：</Text>
                                <Text style={{fontSize:14, color:'#666666'}}>{rowData.winRate.toFixed(2)}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginRight:30}}>
                        <Text style={{fontSize:17, color:'#ca3538'}}>{rowData.roi.toFixed(2)}%</Text>
                    </View> 
                </TouchableOpacity>
            )
        }else{
            return null
        }
        
    }

    renderFooter(){

    }

    renderSeparator(){

    }

    renderListAll(){
        return(
            <View style={{flex:1,width:width,backgroundColor:'white'}}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </View>
        )
    }
    render() {
        return (
            <View style={{flex:1}}>
                 {this.renderMe()}
                 {this.renderThreeHero()}
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
        height:188,
        width:width,
        paddingLeft:20,
        paddingRight:20,
    },
    headPortrait:{
        width:48,
        height:48,
        alignSelf:'center'
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:'#0278c1',
        fontSize:15,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'#d8effc',
        fontSize:15,
    },
    textProfit:{
        color:'#ffffff',
        fontSize:15
    },
    textWinRate:{
        fontSize:12,
        color:'#0278c1'
    }
})



module.exports = RankHeroList;



