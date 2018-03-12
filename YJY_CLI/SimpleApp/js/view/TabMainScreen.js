import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    Button,
    View,
    StyleSheet,
    Platform, 
    Alert,
    ScrollView,
    Dimensions,
    TouchableOpacity, 
    ListView,
    Image,
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    TouchableHighlight,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import Swipeout from 'react-native-swipeout';
import NavBar from './component/NavBar';

import TweetBlock from './tweet/TweetBlock';
import { ViewKeys } from '../../AppNavigatorConfiguration';


var ColorConstants = require('../ColorConstants');
var UIConstants = require('../UIConstants'); 
require('../utils/dateUtils')
var {height, width} = Dimensions.get('window');
var {EventCenter, EventConst} = require('../EventCenter');
var WebSocketModule = require('../module/WebSocketModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule');


import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
 

  /*
  { time: '2018-03-05T01:58:31.263',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 45, roi: -0.06526041005 } },
    { time: '2018-03-02T07:52:30.857',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 48, roi: 0.0035087719 } },
    { time: '2018-03-02T07:51:49.377',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 47, roi: 0.00701754385 } },
    { time: '2018-03-02T07:51:05.24',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 46, roi: 0.00842069805 } },
    { time: '2018-03-02T07:50:17.643',
    type: 'open',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 50, invest: 200, leverage: 50 } },
  */


//Tab0:动态
export default class TabMainScreen extends React.Component {
    
    tabSwitchedSubscription = null;

    constructor(props){
        super()
         

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2, 
        });
 

        this.state = {
            first: true,
            // dataList: dataList,
            // dataSource: this._dataSource.cloneWithRows(dataList),
        }


        this.loadData()
    }
 
    componentDidMount () {
        // this._pullToRefreshListView.beginRefresh()
        this.tabSwitchedSubscription = EventCenter.getEventEmitter().addListener(EventConst.HOME_TAB_RESS_EVENT, () => {
            console.log("HOME_TAB_RESS_EVENT")
            WebSocketModule.cleanRegisteredCallbacks();
        });
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.tabSwitchedSubscription && this.tabSwitchedSubscription.remove();
        this.timer && clearTimeout(this.timer);
    }

     

    render() {
        console.log('render scene')
        return (
            <View style = {styles.mainContainer}>
                <NavBar onlyShowStatusBar={true}/>
                <PullToRefreshListView
                    ref={ (component) => this._pullToRefreshListView = component }
                    viewType={PullToRefreshListView.constants.viewType.listView}
                    contentContainerStyle={{backgroundColor: 'transparent', }}
                    style={{marginTop: Platform.OS == 'ios' ? 0 : 0, }}
                    initialListSize={20}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    pageSize={20}
                    renderRow={this._renderRow}
                    renderHeader={this._renderHeader}
                    renderFooter={this._renderFooter}
                    //renderSeparator={(sectionID, rowID) => <View style={styles.separator} />}
                    onRefresh={this._onRefresh}
                    onLoadMore={this._onLoadMore}
                    pullUpDistance={35}
                    pullUpStayDistance={50}
                    pullDownDistance={35}
                    pullDownStayDistance={50}
                />
            </View>
        )
    }

    renderItemTrede(rowData){
        if(rowData.data.type=='open' || rowData.data.type=='close' ){
            return (
                <TouchableOpacity onPress={()=>this._onPressToSecurity(rowData)} style={{marginRight:10,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={require('../../images/stock_detail_direction_up_enabled.png')} 
                        style={{width:22,height:22,marginBottom:-3}}>
                    </Image>
                    <Text style={{marginRight:2,fontSize:9,color:'#a9a9a9'}}>{rowData.data.security.name}</Text>
                </TouchableOpacity>
            )
        }else{
            return null;
        } 
    }

    // onPressedDeleteItem(rowData){
    //     Alert.alert(rowData.data.userName)
    // }

    // renderDeleteButton(rowData){
    //     return(
    //         <TouchableOpacity onPress={this.onPressedDeleteItem(rowData)} style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
    //             <Text style={{color:'white',fontSize:13}}>删除</Text>
    //         </TouchableOpacity>
    //     )
    // }

    _onPressButton(rowData){
        Alert.alert('onPressButton'+rowData.data.userName)
    }

    _onPressToSecurity(rowData){
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, {stockCode: rowData.data.security.id, stockName: rowData.data.security.name})
    }

    _onPressToUser(rowData){
        var userData = {
            userId:rowData.data.user.id,
            nickName:rowData.data.user.nickname,
        }
        this.props.navigation.navigate(ViewKeys.SCREEN_USER_PROFILE, {userData:userData})
    }

    _renderRow = (rowData, sectionID, rowID) => {

        var viewHero = rowData.data.isRankedUser ? <Text style={styles.textHero}>达人</Text> : null;
        var swipeoutBtns = [
            {
              backgroundColor:'#ff4240', 
              text:'删除',
              onPress:()=>this._onPressButton(rowData)
            }
          ]
 
        var d = new Date(rowData.data.time);
        var timeText = d.getDateSimpleString()
         
        var text = '';

        if(rowData.data.type == 'status'){
            text = rowData.data.status
        }else if(rowData.data.type == 'open'){ 
            text = rowData.data.position.invest + '糖果x'+rowData.data.position.leverage+'倍数'
        }else if(rowData.data.type == 'close'){
            winOrLoss = rowData.data.position.roi>=0?'盈利+':'亏损'
            text = '平仓'+winOrLoss+(rowData.data.position.roi*100).toFixed(2)+'%'
        }

        return ( 
               <View style={styles.thumbnailAll}> 
                    <View>
                        <View style={{marginLeft:20,width:0.5,flex:1,backgroundColor:'#1da4f8'}}></View>
                        <View style={{width:40,flexDirection:'row'}}>
                            <Text style={{width:30,color:'#b0dcfe',marginLeft:5,fontSize:10,alignSelf:'center'}}>{timeText}</Text>
                            <Image style={{marginTop:2,marginLeft:4, width:7,height:7.5}} source={require('../../images/triangle.png')}></Image>
                        </View>
                        <View style={{marginLeft:20,width:0.5,flex:2,backgroundColor:'#1da4f8'}}></View>
                    </View>
                    
                    <View style={styles.thumbnail}> 
                     <Swipeout right={swipeoutBtns} autoClose={true} style={{backgroundColor:'transparent',flex:1}}>  
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>this._onPressToUser(rowData)}>
                                <Image source={require('../../images/head_portrait.png')}
                                    style={{height:34,width:34,margin:10,}} >
                                </Image>
                            </TouchableOpacity> 
                            <View style={styles.textContainer}>
                                <View style={{flexDirection:'row',marginTop:0}}>
                                    <Text style={styles.textUserName}>{rowData.data.user.nickname}</Text>
                                    {viewHero}
                                </View>
                                <TweetBlock
                                    style={{fontSize:15,color:'#666666'}}
                                    value={text}
                                    onBlockPressed={(name, id)=>{this.jump2Detail(name, id)}}/>
                            </View>
                            {this.renderItemTrede(rowData)}
                        </View>      
                      </Swipeout>

                    </View>
                
              </View>  
        )
    }



    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case refresh_none:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>下拉刷新</Text>
                    </View>
                )
            case refresh_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>下拉刷新...</Text>
                    </View>
                )
            case will_refresh:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>释放刷新</Text>
                    </View>
                )
            case refreshing:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}<Text>刷新中...</Text>
                    </View>
                )
        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case load_more_none:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载更多</Text>
                    </View>
                )
            case load_more_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>加载更多</Text>
                    </View>
                )
            case will_load_more:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>释放加载更多</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}<Text>加载中...</Text>
                    </View>
                )
            case loaded_all:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <Text>没有更多</Text>
                    </View>
                )
        }
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        // this.timer = setTimeout( () => {

        //     //console.log('outside _onRefresh end...')
        //     let addNum = 20
        //     let refreshedDataList = []
        //     for(let i = 0; i < addNum; i++) {
        //         refreshedDataList.push({
        //             data:mkData[i%10]
        //         })
        //     }

        //     this.setState({
        //         dataList: refreshedDataList,
        //         dataSource: this._dataSource.cloneWithRows(refreshedDataList),
        //     })
        //     this._pullToRefreshListView.endRefresh()

        // }, 1500)

        
        this.loadData()

    }

    loadData(){
        NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.MAIN_FEED_DEFAULT,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}, 
			},
			(responseJson) => {
                let arr = Array.from(responseJson);
                let length = arr.length;
                let refreshedDataList = []
                for(let i = 0;i < length;i++){
                    refreshedDataList.push({
                       data:responseJson[i]
                    })
                } 
                this.setState({
                            dataList: refreshedDataList,
                            dataSource: this._dataSource.cloneWithRows(refreshedDataList),
                        })
                this._pullToRefreshListView.endRefresh()
			},
			(result) => {
				Alert.alert('提示', result.errorMessage);
			}
		)
    }

    _onLoadMore = () => {

        this.loadData()


        //console.log('outside _onLoadMore start...')
        // this.timer = setTimeout(
        //     () => {

        //         //console.log('outside _onLoadMore end...')
    
        //         let length = this.state.dataList.length
        //         let addNum = 20
        //         let addedDataList = []
        //         if(length >= 100) {
        //             addNum = 3
        //         }
        //         for(let i = length; i < length + addNum; i++) {
        //             addedDataList.push({
        //                 data:mkData[i%10]
        //             })
        //         }
        //         let newDataList = this.state.dataList.concat(addedDataList)
        //         this.setState({
        //             dataList: newDataList,
        //             dataSource: this._dataSource.cloneWithRows(newDataList),
        //         })
    
        //         let loadedAll
        //         if(length >= 100) {
        //             loadedAll = true
        //             this._pullToRefreshListView.endLoadMore(loadedAll)
        //         }
        //         else {
        //             loadedAll = false
        //             this._pullToRefreshListView.endLoadMore(loadedAll)
        //         }
    
        //     }, 1500) 
         
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={'#000000'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    color={'#000000'}
                    styleAttr={'Small'}/>

            ) :  (
            <ActivityIndicatorIOS
                style={{marginRight: 10,}}
                animating={true}
                color={'#000000'}
                size={'small'}/>
        )
    }
 
 
    jump2Detail(name, id){ 
        this.props.navigation.navigate(ViewKeys.SCREEN_STOCK_DETAIL, 
            {stockCode: id, stockName: name});
    }

}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:ColorConstants.BGBLUE
    },
     
    icon: {
      width: 26,
      height: 26,
    },
    title: {
        fontSize: 24,
        margin: 10
    }, 

    itemHeader: {
        height: 35,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderBottomColor: '#ccc',
        backgroundColor: 'blue',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        height: 60, 
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        paddingTop: 20 + 44,
    },

    thumbnail: {
        margin: 5,
        flexDirection: 'row',
        width:width-60, 
        backgroundColor:'white',
        paddingTop:10,
        paddingBottom:10,
        borderRadius:10,
    },
     
    thumbnailAll: {
        marginLeft: 5,
        marginRight:5,
        flexDirection: 'row',  
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
    textHero:{
        fontSize:8,
        alignSelf:'center',
        marginTop:5,
        marginLeft:2,
        paddingTop:1,
        paddingBottom:1,
        backgroundColor:'#f9b82f',
        borderRadius:2,
    }

})


module.exports = TabMainScreen;

