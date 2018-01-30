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
var ColorConstants = require('../ColorConstants');
var UIConstants = require('../UIConstants'); 
 
var {height, width} = Dimensions.get('window');

import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'

var mkData = [
    {time:'16:32',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续'},
    {time:'16:31',userName:'巴菲特',isTrade:false,isHero:false,text:'500糖果*50倍数'},
    {time:'16:30',userName:'傻子',isTrade:true,isHero:true,text:'平仓盈利+200.12%',tradeid:'001',tradeName:'黄金100'},
    {time:'16:29',userName:'热点',isTrade:false,isHero:false,text:'苹果公司2017年度净利润增长仅5%，不及预期！'},
    {time:'16:28',userName:'王思聪',isTrade:true,isHero:true,text:'2000糖果*10倍数',tradeid:'002',tradeName:'美国科技股100'},
    {time:'16:27',userName:'王思聪',isTrade:true,isHero:true,text:'600糖果*5倍数',tradeid:'003',tradeName:'德国30'},
    {time:'16:26',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续加动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续大，可以适当买涨黄金，倍数在10-20倍左右。'},
    {time:'16:25',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续续加大，可以适当买涨黄金，倍数在10-20倍左右。'},
    {time:'16:24',userName:'巴菲特',isTrade:false,isHero:false,text:'500糖果*50倍数'},
    {time:'16:23',userName:'傻子',isTrade:false,isHero:false,text:'平仓盈利+200.12%'},
    {time:'16:21',userName:'热点',isTrade:false,isHero:false,text:'苹果公司2017年度净利润增长仅5%，不及预期！'},
    {time:'16:20',userName:'王思聪',isTrade:false,isHero:false,text:'2000糖果*10倍数'},
    {time:'16:19',userName:'王思聪',isTrade:false,isHero:false,text:'600糖果*5倍数'},
  ]



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

   
    let dataList = [
        {data:{time:'16:32',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续'}},
        {data:{time:'16:31',userName:'巴菲特',isTrade:false,isHero:false,text:'500糖果*50倍数'}},
        {data:{time:'16:30',userName:'傻子',isTrade:true,isHero:true,text:'平仓盈利+200.12%',tradeid:'001',tradeName:'黄金100'}},
        {data:{time:'16:28',userName:'王思聪',isTrade:true,isHero:true,text:'2000糖果*10倍数',tradeid:'002',tradeName:'美国科技股100'}},
    
        {data:{time:'16:32',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续'}},
        {data:{time:'16:31',userName:'巴菲特',isTrade:false,isHero:false,text:'500糖果*50倍数'}},
        {data:{time:'16:30',userName:'傻子',isTrade:true,isHero:true,text:'平仓盈利+200.12%',tradeid:'001',tradeName:'黄金100'}},
        {data:{time:'16:28',userName:'王思聪',isTrade:true,isHero:true,text:'2000糖果*10倍数',tradeid:'002',tradeName:'美国科技股100'}},
    
        {data:{time:'16:32',userName:'卡尔先生',isTrade:false,isHero:false,text:'@黄金，鉴于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动于朝鲜半岛持续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续动荡，全球不稳定因素继续'}},
        {data:{time:'16:31',userName:'巴菲特',isTrade:false,isHero:false,text:'500糖果*50倍数'}},
        {data:{time:'16:30',userName:'傻子',isTrade:true,isHero:true,text:'平仓盈利+200.12%',tradeid:'001',tradeName:'黄金100'}},
        {data:{time:'16:28',userName:'王思聪',isTrade:true,isHero:true,text:'2000糖果*10倍数',tradeid:'002',tradeName:'美国科技股100'}},
    
    ]

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
            <View style = {styles.mainContainer}>
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
        if(rowData.data.isTrade ){
            return (
                <TouchableOpacity onPress={()=>this._onPressButton(rowData)} style={{marginRight:5,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={require('../../images/icon_me_dynamic.png')} 
                        style={{width:16,height:16}}>
                    </Image>
                    <Text style={{fontSize:10}}>{rowData.data.tradeName}</Text>
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

    _renderRow = (rowData, sectionID, rowID) => {

        var viewHero = rowData.data.isHero ? <Text style={styles.textHero}>达人</Text> : null;
        var swipeoutBtns = [
            {
              backgroundColor:'#ff4240', 
              text:'删除',
              onPress:()=>this._onPressButton(rowData)
            }
          ]

        return ( 
               <View style={styles.thumbnailAll}> 
                    <View>
                        <View style={{marginLeft:20,width:0.5,flex:1,backgroundColor:'#ffffff'}}></View>
                        <View style={{width:40}}>
                            <Text style={{}}>{rowData.data.time}</Text>
                        </View>
                        <View style={{marginLeft:20,width:0.5,flex:2,backgroundColor:'#ffffff'}}></View>
                    </View>
                  
                    <View style={styles.thumbnail}> 
                     <Swipeout right={swipeoutBtns} autoClose={true} style={{backgroundColor:'transparent',flex:1}}>  
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>this._onPressButton(rowData)}>
                                <Image source={require('../../images/head_portrait.png')}
                                    style={{height:32,width:32,margin:10,}} >
                                </Image>
                            </TouchableOpacity> 
                            <View style={styles.textContainer}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.textUserName}>{rowData.data.userName}</Text>
                                    {viewHero}
                                </View>
                                <Text>{rowData.data.text}</Text>
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
        this.timer = setTimeout( () => {

            //console.log('outside _onRefresh end...')
            let addNum = 20
            let refreshedDataList = []
            for(let i = 0; i < addNum; i++) {
                refreshedDataList.push({
                    data:mkData[i%10]
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
                        data:mkData[i%10]
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
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderBottomColor: '#ccc',
        // overflow: 'hidden',
        backgroundColor:'#efefef',
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

