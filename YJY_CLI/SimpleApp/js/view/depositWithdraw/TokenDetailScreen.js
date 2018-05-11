//import liraries
import React, { Component } from 'react';
import {
    View, 
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
} from 'react-native';
import NavBar from '../component/NavBar';
var ColorConstants = require('../../ColorConstants')
import LogicData from "../../LogicData";
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");
var {height, width} = Dimensions.get('window');
var LS = require("../../LS");
// create a component
class TokenDetailScreen extends Component {

    constructor(props){
        super(props)
        var state = this.getInitialState();
        state.stockInfoRowData = [];
        this.state = state;
    }

    componentDidMount(){
        this.fetchData();
    }
    
    getInitialState(){
        return {
            isRefreshing: false,
            isDataLoading: false,
        };
    }

    fetchData(){
        //TODO: use real data
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.TOKEN_DETAIL,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                    'Content-Type': 'application/json; charset=UTF-8'
                },
            },(responseJson)=>{
                this.setState({
                    stockInfoRowData:responseJson
                });

                console.log("responseJson", responseJson)
            },()=>{

            });      
    }

	refresh(){
		var state = this.getInitialState();

		if(LogicData.isLoggedIn()){
			state.isRefreshing = true;
			this.setState(state, ()=>{
				this.fetchData();
			});
		}else{
			state.isDataLoading = false;
			state.stockInfoRowData = [];
			this.setState(state);
		}
	}

    getItemLayout(data, index){
		var smallItemHeight = SIMPLE_ROW_HEIGHT;
		var bigItemHeight = 277 + ROW_PADDING;
		var itemHeight = smallItemHeight;
		if(this.state.selectedSubItem === SUB_ACTION_STOP_LOSS_PROFIT){
			bigItemHeight += STOP_PROFIT_LOSS_SMALL_HEIGHT;
		}
		if(this.state.stopLossSwitchIsOn){
			bigItemHeight += 55;
		}
		if(this.state.stopProfitSwitchIsOn){
			bigItemHeight += 55;
		}

		if (index == this.state.selectedRow){
			itemHeight = bigItemHeight;
		}
		
		var offset = smallItemHeight * index;
		// if (index >= this.state.selectedRow){
		// 	offset += bigItemHeight - smallItemHeight;
		// }
		//console.log("index " + index + ", height: " + itemHeight);
		return {
			length: itemHeight, 
			offset: offset - 4,
			index: index};
    }

    renderItem(rowData){
        console.log("rowData", rowData)
        var date = new Date(rowData.item.time);
        var dateString = date.Format('yy/MM/dd hh:mm');
        return (
            <View style={styles.rowContainer}>
                <View style={styles.rowHeaderContainer}>
                    <Text style={{fontSize:17}}>{rowData.item.type}</Text>
                    <Text style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{dateString}</Text>
                </View>
                <View style={{alignItems:'flex-end', justifyContent:'center', flex:1, flexDirection:'column'}}>
                    <Text style={{fontSize:17, color: rowData.item.color}}>{rowData.item.amount.toFixed(2)}</Text>
                </View>
            </View>
        )
    }

    renderContent(){
        if(this.state.stockInfoRowData == undefined || this.state.stockInfoRowData.length == 0){
            return (
                <View style={styles.loadingTextView}>
                    <Text style={styles.loadingText}>{LS.str("NO_TRANSACTIONS")}</Text>
                </View>);
        }else{
            
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("ME_DETAIL_TITLE")}
                    showBackButton={true}
                    backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                    navigation={this.props.navigation}
                    />
                <View style={{flex:1}}>
                    {this.renderContent()}
                    <FlatList
                        style={{flex:1, width:width}}
                        ref={(ref) => { this.flatListRef = ref;}}
                        data={this.state.stockInfoRowData}
                        refreshing={this.state.isRefreshing}
                        onRefresh={()=>this.refresh()}
                        //getItemLayout={(data, index) => this.getItemLayout(data, index)}
                        keyExtractor={(item, index) => index}
                        renderItem={(data)=>this.renderItem(data)}/>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:width,
        backgroundColor: 'white'
    },
    rowContainer: {
        padding: 15, 
        borderWidth: 1, 
        borderColor: "#dddddd",
        borderRadius: 10,
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        flexDirection:'row',
        flex:1,
    },
    rowHeaderContainer:{
        flexDirection:'column',
    },
    loadingTextView: {
		position: 'absolute',
		top:0,
		left:0,
		right:0,
		bottom:0,
		alignItems: 'center',
        justifyContent: 'center',
	},
	loadingText: {
		fontSize: 13,
		color: '#9f9f9f'
	},
});

//make this component available to the app
export default TokenDetailScreen;
