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
var {height, width} = Dimensions.get('window');

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

        this.setState({
            stockInfoRowData: [ { transferType: '出金',
            date: '2018-03-01 19:39:12',
            amount: -650,
            color: '#000000' },
          { transferType: '交易金入金',
            date: '2017-06-13 17:03:20',
            amount: 9.92,
            color: '#1c8d13' },
          { transferType: '转账',
            date: '2017-02-16 19:58:01',
            amount: 100,
            color: '#1c8d13' },
          { transferType: '手续费',
            date: '2017-02-16 19:46:39',
            amount: -2.1,
            color: '#000000' },
          { transferType: '入金',
            date: '2017-02-15 22:45:25',
            amount: 210,
            color: '#1c8d13' },
          { transferType: '手续费',
            date: '2017-02-14 17:31:01',
            amount: -1.44,
            color: '#000000' },
          { transferType: '入金',
            date: '2017-02-14 13:46:16',
            amount: 144,
            color: '#1c8d13' },
          { transferType: '出金受理',
            date: '2017-02-13 19:30:44',
            amount: -87.12,
            color: '#1c8d13' } ]
        })
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
        return (
            <View style={styles.rowContainer}>
                <View style={styles.rowHeaderContainer}>
                    <Text style={{fontSize:17}}>{rowData.item.transferType}</Text>
                    <Text style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{rowData.item.date}</Text>
                </View>
                <View style={{alignItems:'flex-end', justifyContent:'center', flex:1, flexDirection:'column'}}>
                    <Text style={{fontSize:17, color: rowData.item.color}}>{rowData.item.amount}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="明细"
                    showBackButton={true}
                    backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                    navigation={this.props.navigation}
                    />
                <View style={{flex:1}}>
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
        width:width
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
    }
});

//make this component available to the app
export default TokenDetailScreen;
