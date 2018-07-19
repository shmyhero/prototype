
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
var LS = require("../LS")
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window');
import NetworkErrorIndicator from './component/NetworkErrorIndicator';
var listData = []
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var itemOpen=[]
export default class  RankTradeFollowList extends React.Component {
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
            rankListData:[],
            isContentLoaded: false,
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
 

    tabPressed(){ 
		this.onRefresh()
	}

    loadRankData(){  
        if(LogicData.isLoggedIn()){
                var userData = LogicData.getUserData();
                this.setState({
                    isDataLoading: true,
                }, ()=>{
                    NetworkModule.fetchTHUrl(
                        NetConstants.CFD_API.RANK_USER_FOLLOW_TRADE,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            showLoading: true,
                            cache:'offline'
                        }, (responseJson) => { 
                            // console.log(responseJson);
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                isContentLoaded:true,
                                dataSource: ds.cloneWithRows(responseJson),
                            });
                            itemOpen = []
                        },
                        (exception) => {
                            this.setState({
                                isDataLoading: false,
                            });
                            //alert(exception.errorMessage)
                        }
                    );
                })			
            } 
     } 
  
     onPressItemHead(rowData){
        this.gotoUserProfile(rowData.id,rowData.nickname)
     }

    onPressItem(rowData,rowID){
    //    this.gotoUserProfile(rowData.id,rowData.nickname)
       this.setState({ 
            dataSource:ds.cloneWithRows(this.state.rankListData),
       });

       itemOpen[rowID] = itemOpen[rowID] == 1 ? 0:1;
    }

    _renderRow = (rowData, sectionID, rowID) => {
          
        var d = new Date(rowData.followTrade.createAt);
        var createAt = d.getDateStringDay()

        if(rowID>=0){ 
            id = rowID 
            var openView = itemOpen[id]==1?
            <View style={{backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                <View style = {{width:width-60,height:0.5,marginTop:-5, backgroundColor:'#eeeeee'}}></View>
                    <View style={{height:64,width:width-60,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={styles.textItemTitle}>{LS.str("APPLY_COPY")}</Text>
                        <Text style={styles.textItemValue}>{createAt}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.textItemTitle}>{LS.str("AVG_MOUNT_COPY").replace("{1}", LS.getBalanceTypeDisplayText())}</Text>
                        <Text style={styles.textItemValue}>{rowData.followTrade.investFixed}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text style={styles.textItemTitle}>{LS.str("COPY_TIMES")}</Text>
                        <Text style={styles.textItemValue}>{rowData.followTrade.stopAfterCount}</Text>
                    </View>
                </View>
            </View>:null;    
            return( 
                <TouchableOpacity onPress={()=>this.onPressItem(rowData,rowID)} style={{borderRadius:10,width:width-30,backgroundColor:'white',marginLeft:15,marginBottom:15,}}> 
                    <View  style={{height:UIConstants.ITEM_ROW_HEIGHT,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.onPressItemHead(rowData,rowID)} >
                                <Image style={{height:46,width:46,marginLeft:15,marginBottom:5,borderRadius:23}} source={{uri:rowData.picUrl}}></Image>
                            </TouchableOpacity>
                            <View style={{marginLeft:10}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{fontSize:15,color:'#999999'}}>{rowData.nickname}</Text>
                                    {/* <Image style={{width:40,height:15.5,marginLeft:2}} source={require('../../images/following.png')}></Image>  */}
                                </View>
                                <View style={{flexDirection:'row',marginBottom:0,alignItems:'center',justifyContent:'flex-start'}}>
                                    <Text style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</Text>
                                    <Text style={{fontSize:14, color:'#666666',fontWeight:'bold'}}>{rowData.winRate.toFixed(2)}%</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginRight:15}}>
                            <Text style={{fontSize:17,fontWeight:'bold',color:ColorConstants.stock_color(rowData.roi)}}>{rowData.roi.toFixed(2)}%</Text>
                        </View> 
                    </View>
                    {openView}
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
    
    

    renderListAll(){
        return(
            <View style={{flex:1,width:width,backgroundColor:'transparent',marginTop:15}}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    removeClippedSubviews={false}
                />
            </View>
        )
    }
    render() {
            if(!this.state.isContentLoaded){
                return(
                    <NetworkErrorIndicator 
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.isDataLoading}/>
                )
            }else{
                if(this.state.rankListData.length==0){
                    return(
                        <View style={{width:width,height:height-120,alignItems:'center', justifyContent:'center'}}>
                            {/* <Image style={{width:290,height:244,}}source={require('../../images/no_attention.png')}></Image> */}
                            <Text style={{color:'white'}}>{LS.str("NO_COPY")}</Text> 
                        </View>
                    )
                }else{
                    return(
                        <View style={{flex:1}}> 
                            {this.renderListAll()}
                        </View>
                    )
                } 
            } 
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
    },
    separator: {
        marginLeft: 15,
        marginRight:0,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    },
    textItemTitle:{
        fontSize:11,
        color:'#666666'
    },
    textItemValue:{
        fontSize:13,
        marginTop:2,
        color:'#000000'
    }
})



module.exports = RankTradeFollowList;



