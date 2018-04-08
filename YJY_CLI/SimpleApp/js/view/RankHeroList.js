
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
var ColorConstants = require('../ColorConstants')
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
            var roiColor=this.state.rankListData[0].roi > 0?'#ff9999':'green'
            return(
                <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0].id,this.state.rankListData[0].nickname)}>
                    <ImageBackground style={{height:86,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image style={{height:34,width:34,marginLeft:28,marginBottom:5,borderRadius:17}} source={{uri:this.state.rankListData[0].picUrl}}></Image>
                            <View style={{marginLeft:10}}>
                                <Text style={{color:'white',fontSize:15,color:'#a1dcfd'}}>我的</Text>
                                <View style={{flexDirection:'row',marginBottom:5,alignItems:'center'}}>
                                    <Text style={{fontSize:12,color:'#6dcafe'}}>胜率：</Text>
                                    <Text style={{fontSize:16,color:'#d8effc'}}>{this.state.rankListData[0].winRate.toFixed(2)}%</Text>
                                </View>
                            </View>
                        </View>     
                        <View style={{marginRight:30}}>
                            <Text style={{color:roiColor}}>{(this.state.rankListData[0].roi*100).toFixed(2)}%</Text>
                        </View> 
                    </ImageBackground>
                </TouchableOpacity>
            )
        }else{
            return <View style={{width:width,height:20}}></View>;
        }
    }

    renderThreeHero(){ 
        var bgWidth = (width-39.5)/3;
        var bgHeight = bgWidth;
        var bgHeightLR = bgHeight*201/230;
        var offset = this.props.showMeBlock?1:0;
        return(
            <View style={{marginTop:0}}>
                <ImageBackground style={styles.containerAll}>
                    <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[1+offset].id,this.state.rankListData[1].nickname)} activeOpacity={0.9} style={{flex:1}}>
                        <Image style={styles.headPortrait} source={{uri:this.state.rankListData[1+offset].picUrl}}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[1+offset].nickname}</Text>
                        <View style={{marginBottom:-5, flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{(this.state.rankListData[1+offset].winRate*100).toFixed(2)}%</Text>
                        </View>    
                        
                        <ImageBackground style={{marginBottom:-10,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_ag.png')}>
                            <Text style={styles.textProfit}>{(this.state.rankListData[1+offset].roi*100).toFixed(2)}%</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.gotoUserProfile(this.state.rankListData[0+offset].id,this.state.rankListData[0].nickname)} activeOpacity={0.9}  style={{flex:1}}>
                        <Image style={styles.headPortrait} source={{uri:this.state.rankListData[0+offset].picUrl}}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[0+offset].nickname}</Text>
                        <View style={{marginBottom:-5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{(this.state.rankListData[0+offset].winRate*100).toFixed(2)}%</Text>
                        </View>    
                        <ImageBackground style={{marginBottom:-10,width:bgWidth,height:bgHeight ,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_gd.png')}>
                            <Text style={styles.textProfit}>{(this.state.rankListData[0+offset].roi*100).toFixed(2)}%</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>this.gotoUserProfile(this.state.rankListData[2+offset].id,this.state.rankListData[2].nickname)} activeOpacity={0.9}  style={{flex:1}}>
                        <Image style={styles.headPortrait} source={{uri:this.state.rankListData[2+offset].picUrl}}></Image>
                        <Text style={styles.textTopUserName}>{this.state.rankListData[2+offset].nickname}</Text>
                        <View style={{marginBottom:-5,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.textWinRate}>胜率: </Text>
                            <Text style={styles.textTopUserScore}>{(this.state.rankListData[2+offset].winRate*100).toFixed(2)}%</Text>
                        </View>    
                        <ImageBackground style={{marginBottom:-10,width:bgWidth,height:bgHeightLR,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_cu.png')}>
                            <Text style={styles.textProfit}>{(this.state.rankListData[2+offset].roi*100).toFixed(2)}%</Text>
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
        var offset = this.props.showMeBlock?1:0;
        if(rowID>=3+offset){
            var colorRoi = rowData.roi > 0?'#ca3538':'green'
            return( 
                <TouchableOpacity onPress={()=>this.onPressItem(rowData)} style={{height:68,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{height:34,width:34,marginLeft:28,marginBottom:5,borderRadius:17}} source={{uri:rowData.picUrl}}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:15,color:'#999999'}}>{rowData.nickname}</Text>
                            <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:12, color:'#999999'}}>胜率：</Text>
                                <Text style={{fontSize:14, color:'#666666'}}>{(rowData.winRate*100).toFixed(2)}%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginRight:30}}>
                        <Text style={{fontSize:17, color:colorRoi}}>{(rowData.roi*100).toFixed(2)}%</Text>
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
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
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
                 {/* {this.renderMe()}
                 {this.renderThreeHero()} */}
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
        width:48,
        height:48,
        borderRadius:24,
        alignSelf:'center',
        marginBottom:5,
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:'#0278c1',
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
        color:'#0278c1'
    },
    separator: {
        marginLeft: 20,
        marginRight:20,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    },
})



module.exports = RankHeroList;



