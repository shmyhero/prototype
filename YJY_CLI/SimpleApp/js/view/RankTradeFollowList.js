
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
var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window');
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
                        NetConstants.CFD_API.RANK_FOLLOWING,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            showLoading: true,
                        }, (responseJson) => { 
                             
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                dataSource: ds.cloneWithRows(responseJson),
                            });
                            itemOpen = []
                        },
                        (exception) => {
                            alert(exception.errorMessage)
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
        if(rowID>=0){ 
            id = rowID 
            var openView = itemOpen[id]==1?
            <View style={{backgroundColor:'transparent',justifyContent:'center',alignItems:'center'}}>
                <View style = {{width:width-60,height:0.5,marginTop:-5, backgroundColor:'#eeeeee'}}></View>
                    <View style={{height:58,width:width-60,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-start'}}>
                        <Text style={styles.textItemTitle}>{LS.str("APPLY_FOLLOW")}</Text>
                        <Text style={styles.textItemValue}>2018.05.01</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.textItemTitle}>{LS.str("AVG_MOUNT_FOLLOW")}</Text>
                        <Text style={styles.textItemValue}>20</Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text style={styles.textItemTitle}>{LS.str("FOLLOW_TIMES")}</Text>
                        <Text style={styles.textItemValue}>2</Text>
                    </View>
                </View>
            </View>:null;    
            return( 
                <TouchableOpacity onPress={()=>this.onPressItem(rowData,rowID)} style={{borderRadius:16,width:width-30,backgroundColor:'white',marginLeft:15,marginBottom:10,}}> 
                    <View  style={{height:68,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.onPressItemHead(rowData,rowID)} >
                                <Image style={{height:34,width:34,marginLeft:15,marginBottom:5,borderRadius:17}} source={{uri:rowData.picUrl}}></Image>
                            </TouchableOpacity>
                            <View style={{marginLeft:10}}>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Text style={{fontSize:15,color:'#999999'}}>{rowData.nickname}</Text>
                                    <Image style={{width:40,height:15.5,marginLeft:2}} source={require('../../images/following.png')}></Image> 
                                </View>
                                <View style={{flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'flex-start'}}>
                                    <Text style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</Text>
                                    <Text style={{fontSize:14, color:'#666666'}}>{rowData.winRate.toFixed(2)}%</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginRight:15}}>
                            <Text style={{fontSize:17, color:'#ca3538'}}>{rowData.roi.toFixed(2)}%</Text>
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
            <View style={{flex:1,width:width,backgroundColor:'transparent'}}>
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
            if(this.state.isDataLoading){
                return(<View style={{flex:1,backgroundColor:'transparent'}}></View>)
            }else{
                if(this.state.rankListData.length==0){
                    return(
                        <View style={{width:width,height:height-120,alignItems:'center', justifyContent:'center'}}>
                            <Image style={{width:290,height:244,}}source={require('../../images/no_attention.png')}></Image>
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



