//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';

import { getMessageList, setMessageRead } from '../redux/actions'
import { connect } from 'react-redux';
import NetworkErrorIndicator from './component/NetworkErrorIndicator'
//var dateFormat = require('dateformat');
var {height, width} = Dimensions.get('window')
import NavBar from './component/NavBar';
var ColorConstants = require('../ColorConstants');
var LS = require("../LS");
// create a component
class MessageScreen extends Component {

    componentWillMount(){
        this.refreshList();
    }

    refreshList(){
        console.log("refreshList")
        this.props.getMessageList(0, this.props)
    }

    loadNextPage(){
        this.props.getMessageList(this.props.nextPage, this.props);        
    }

    renderDateTime(rowData){
        var datetime = rowData.createAt;
        // TODO: add date format later
        if(datetime){
            var dt = new Date(datetime);
            var month = dt.getMonth()+1;
            var dateString = dt.getFullYear() + "." + month + "." + dt.getDate() + " ";
            var timeString = dt.getHours() + ":" + dt.getMinutes();
            // var dateString = dateFormat(dt, "yyyy.mm.dd");
            // var timeString = dateFormat(dt, "HH:MM")
            return (
                <View style={styles.datetime}>
                    <Text style={styles.date}>
                        {dateString}
                        <Text style={styles.time}>{timeString}</Text>
                    </Text>
                </View>
            );
        }else{
            return (
                <View/>
            );
        }    
    }

    _onSelectNormalRow = (rowIndex) => {
        this.props.setMessageRead(rowIndex, this.props.messageList);
    }

	renderNewHint = (rowData) => {
		if(!rowData.isRead){
			return (
				<Image source={require('../../images/icon_new.png')} style={styles.image}/>
			);
		}else{
			return (
				<View style={styles.image}/>
			)
		}
	}

    renderRow(data) {
        var rowData = data.item;
        var rowID = data.index;

        return(
            <TouchableOpacity 
                style={{}}
                activeOpacity={0.5} onPress={()=>this._onSelectNormalRow(rowID)}>
                <View style={styles.rowWrapper}>
                    {this.renderNewHint(rowData)}
                    <View style={styles.messageWrapper}>
                    <Text style={styles.title}>{rowData.header}</Text>
                        <Text style={styles.message}>{rowData.body}</Text>
                    {this.renderDateTime(rowData)}
                    </View>
                </View>
            </TouchableOpacity>);
    }

    renderContent(){
        if(!this.props.messageList || this.props.messageList.length == 0){
            if(this.props.isRefreshing || this.props.error){
                return (
                    <NetworkErrorIndicator 
                        isBlue={false}
                        onRefresh={()=>this.refreshList()}
                        refreshing={this.props.isRefreshing}/>
                )
            }else{
                return (
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{alignSelf:'center', textAlign:'center', }}>{LS.str("NO_MESSAGES")}</Text>
                    </View>);
            }
		}else{
            return (<FlatList
                        ref={ (component) => this.flatListView = component }
                        style={styles.list}
                        initialListSize={10}
                        data={this.props.messageList}
                        enableEmptySections={true}
                        keyExtractor={(item, index) => index}
                        showsVerticalScrollIndicator={true}
                        renderItem={(data)=>this.renderRow(data)}
                        refreshing={this.props.isRefreshing}
                        onRefresh={()=>this.refreshList()}
                        onEndReachedThreshold={0.5}
                        onEndReached={()=>this.loadNextPage()}/>
            );
        }
    }

    render() {
        console.log("render this.props.isRefreshing", this.props.isRefreshing)
        
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("MY_MESSAGES")} showBackButton={true} navigation={this.props.navigation}/>
                {this.renderContent()}
            </View>
        );
        
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:width,
        height:height,
        backgroundColor: ColorConstants.BACKGROUND_GREY
    },
    list: {
        alignSelf: 'stretch',
        flex: 1,
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
        //borderBottomWidth: StyleSheet.hairlineWidth,
        //borderBottomColor: '#ccc',
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
    },
    wrapper: {
        flex: 1,
        width: width,
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: ColorConstants.BACKGROUND_GREY,
    },
    list: {
        flex: 1,
    },
    rowWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: 9,
        paddingRight: 10,
        paddingTop: 12,
        paddingBottom: 12,
        margin:10,
        marginTop: 15,
        marginBottom: 0,
        borderRadius:10,
        backgroundColor: ColorConstants.WHITE
    },
    messageWrapper:{
        flex:1,
        marginLeft: 8,
        marginRight: 15,
    },
    image: {
        width: 6,
        height: 6,
        marginTop: 6,
    },
    title: {
        fontSize: 17,
        color: '#303030',
    },
    message: {
        fontSize: 14,
        marginTop: 10,
        color: '#44444d',
    },
    datetime: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    date: {
        fontSize: 10,
        color: '#7a7987',
    },
    time: {
        fontSize: 10,
        color: '#4d88be',
    },
    emptyContent: {
        position: 'absolute',
        top: 200,
        left: 0,
        right: 0,
        alignItems:'center',
        justifyContent: 'center'
    },
    emptyText: {
        marginTop: 14,
        color: '#afafaf'
    },
    emptyImage: {
        height: 84,
        width: 84,
    },
    refreshTextStyle: {
        color: '#afafaf',
    },
    refreshItemStyle: {
        color: '#7a7987',
    },
    line: {
        height: 0.5,
        backgroundColor: 'transparent',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#e2e2e2',
        marginLeft: 20
    },
});

const mapStateToProps = state => {
    return {
        ...state.message
    };
};
  
const mapDispatchToProps = {
    getMessageList,
    setMessageRead
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
  
  