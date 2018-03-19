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
    PanResponder,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";
import Swipeout from 'react-native-swipeout';
import NavBar from './component/NavBar';
import DynamicRowComponent from './component/DynamicRowComponent';
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
        } 

        this.loadData()

        this.timer = setInterval(
            () => {  
             console.log('time Interval...')

             var responseJson = this.state.dataResponse;
             responseJson.splice(0, 0, responseJson[0]);
            //  responseJson.push(responseJson[0])
             this.setState({ 
                dataResponse: responseJson,
                dataSource: this._dataSource.cloneWithRows(responseJson),
              })
            },
            5000
        );
    }

     
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
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


    _panResponder={}
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onShouldBlockNativeResponder: (event, gestureState) => false,
            onMoveShouldSetPanResponder: (e, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (e, gestureState) => false,
            onStartShouldSetPanResponder: (e, gestureState) => false,
            onStartShouldSetPanResponderCapture: (e, gestureState) => false,
        });
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
                    removeClippedSubviews={false}
                    pullDownDistance={35}
                    pullDownStayDistance={50} 
                    scrollEnabled={this.state.isAllowScroll}  
                />
            </View>
        )
    }
  

    _renderRow = (rowData, sectionID, rowID) => {
        
        return(
            <DynamicRowComponent navigation={this.props.navigation} rowData={rowData}/>
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
        //     let addNum = 1
        //     let refreshedDataList = []
        //     for(let i = 0; i < addNum; i++) {
        //         refreshedDataList.push({
        //             data:this.state.dataList[0].data
        //         })
        //     }

        //     this.setState({
        //         dataList: refreshedDataList,
        //         dataSource: this._dataSource.cloneWithRows(refreshedDataList),
        //     })
        //     this._pullToRefreshListView.endRefresh()

        // }, 1500)
 
        this.loadData(true) 
    }

    loadData(isRefresh){
        NetworkModule.fetchTHUrl(
			NetConstants.CFD_API.MAIN_FEED_DEFAULT,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}, 
			},
			(responseJson) => {  
                this.setState({ 
                            dataResponse: responseJson,
                            dataSource: this._dataSource.cloneWithRows(responseJson),
                        })
                if(isRefresh){
                    this._pullToRefreshListView.endRefresh()
                }
			},
			(result) => {
				Alert.alert('提示', result.errorMessage);
			}
		)
    }

    _onLoadMore = () => {
        this._pullToRefreshListView.endLoadMore()
        // this.loadData()


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

    

})


module.exports = TabMainScreen;

