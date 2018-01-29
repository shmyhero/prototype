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
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from "react-navigation";

var ColorConstants = require('../ColorConstants');
var UIConstants = require('../UIConstants'); 
 
var {height, width} = Dimensions.get('window');

import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
//Tab0:动态
export default class  TabMainScreen extends React.Component {
 

  static navigationOptions = {
    tabBarLabel:'动态',
    tabBarIcon: ({ tintColor }) => (
          <Image
            source={require('../../images/tab0_sel.png')}
            style={[styles.icon, {tintColor: tintColor}]}
          />
        ),
    tabBarOnPress: (scene,jumpToIndex) => {
                         console.log(scene)
                         jumpToIndex(scene.index)
                },
  } 

    constructor(props){
        super()
        this.state = {
            
        }

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            //sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        let dataList = []

        this.state = {
            first: true,
            dataList: dataList,
            dataSource: this._dataSource.cloneWithRows(dataList),
        }
    }
 
    componentDidMount () {
        // this._pullToRefreshListView.beginRefresh()
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

     

    render() {
        console.log('render scene')
        return (
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
        )
    }


    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={styles.thumbnail}>
                <View style={styles.textContainer}>
                    <Text>{rowData.text}</Text>
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
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>下拉刷新</Text>
                    </View>
                )
            case refresh_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>下拉刷新...</Text>
                    </View>
                )
            case will_refresh:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>释放刷新{pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                    </View>
                )
            case refreshing:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
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
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>加载更多</Text>
                    </View>
                )
            case load_more_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>加载更多{pullDistancePercent}%</Text>
                    </View>
                )
            case will_load_more:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>释放加载更多{pullDistancePercent > 100 ? 100 : pullDistancePercent}%</Text>
                    </View>
                )
            case loading_more:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        {this._renderActivityIndicator()}<Text>加载中...</Text>
                    </View>
                )
            case loaded_all:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',}}>
                        <Text>没有更多</Text>
                    </View>
                )
        }
    }

    _onRefresh = () => {
        //console.log('outside _onRefresh start...')

        //simulate request data
        this.timer = setTimeout( () => {

            //console.log('outside _onRefresh end...')
            let addNum = 20
            let refreshedDataList = []
            for(let i = 0; i < addNum; i++) {
                refreshedDataList.push({
                    text: `item-${i}`
                })
            }

            this.setState({
                dataList: refreshedDataList,
                dataSource: this._dataSource.cloneWithRows(refreshedDataList),
            })
            this._pullToRefreshListView.endRefresh()

        }, 1500)
    }

    _onLoadMore = () => {
        //console.log('outside _onLoadMore start...')
        this.timer = setTimeout(
            () => {

                //console.log('outside _onLoadMore end...')
    
                let length = this.state.dataList.length
                let addNum = 20
                let addedDataList = []
                if(length >= 100) {
                    addNum = 3
                }
                for(let i = length; i < length + addNum; i++) {
                    addedDataList.push({
                        text: `item-${i}`
                    })
                }
                let newDataList = this.state.dataList.concat(addedDataList)
                this.setState({
                    dataList: newDataList,
                    dataSource: this._dataSource.cloneWithRows(newDataList),
                })
    
                let loadedAll
                if(length >= 100) {
                    loadedAll = true
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
                else {
                    loadedAll = false
                    this._pullToRefreshListView.endLoadMore(loadedAll)
                }
    
            }, 1500) 
         
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
 
 
  jump2Detail(){ 
    this.props.navigation.navigate('StockDetail', { user: 'Lucy' })
  }

}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor:'#1b9bec'
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
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
        padding: 6,
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        overflow: 'hidden',
    },

    textContainer: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }

})


module.exports = TabMainScreen;

