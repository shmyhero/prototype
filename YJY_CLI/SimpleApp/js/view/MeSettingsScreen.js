//import liraries
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image,
    Picker,
} from 'react-native';

import { logOut, switchLanguage, getVersion, 
    getBalanceType, 
    setBalanceType } from '../redux/actions'
import { connect } from 'react-redux';
import CustomStyleText from './component/CustomStyleText';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window')
var ColorConstants = require('../ColorConstants')
import ViewKeys from '../ViewKeys';
var NetConstants = require("../NetConstants");
var NetworkModule = require("../module/NetworkModule");

var configListData = [
    {'type':'normal','title':'SETTINGS_CENTER_TITLE', 'subtype': 'helpCenter'},
    {'type':'normal','title':'SETTINGS_ABOUT_TITLE', 'subtype': 'aboutUs'},
    // {'type':'normal','title':'SETTINGS_SWITCH_LANGUAGE', 'subtype': 'language'},
    // {'type':'normal','title':'SETTINGS_BALANCE_TYPE', 'subtype': 'balanceType'},
    {'type':'normal','title':'SETTINGS_GROUP_NUMBER', 'subtype': 'group'},
    {'type':'normal','title':'SETTINGS_VERSION', 'subtype': 'version'},
    {'type':'normal','title':'SETTINGS_LOG_OUT', 'subtype': 'logOut'},
];

var balanceType = [
    {'type': 'BTH', displayText: 'BTH',icon:require('../../images/icon_bth.png')},
    {'type': 'ETH', displayText: 'ETH',icon:require('../../images/icon_eth.png')}
]

// create a component
class MeSettingsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            displayBalanceTypePicker: false,
            groupNumber:''
        }
    }

    componentDidMount(){
        this.loadWechatGroup();
    }

    componentWillMount(){
        if(this.props.version == ""){
            this.props.getVersion()
        }
        this.props.getBalanceType();
    }

    componentWillReceiveProps(props){
        if(!props.userLoggedin){
            this.props.navigation.goBack(null)
        }
    } 

    componentWillUnmount(){
        if(this.props.navigation.state.params.onGoBack){
            this.props.navigation.state.params.onGoBack();
        } 
    }

    onSelectNormalRow(rowData){
        switch(rowData.item.subtype){
            case "helpCenter":
                this.props.navigation.navigate(ViewKeys.SCREEN_HELP);
                break
            case "aboutUs":
                this.props.navigation.navigate(ViewKeys.SCREEN_ABOUT);
                break
            case "language":
                this.props.switchLanguage();
                break
            case "version":
                break
            case "balanceType":
                this.setState({
                    displayBalanceTypePicker: true,
                    coinType : this.props.balanceType
                })
                break
            case "logOut":
                this.props.logOut();
                break
        }
    }

    confirm(){
        this.props.setBalanceType(this.state.coinType);
        this.setState({
            displayBalanceTypePicker: false
        })
    }

    renderPicker(){
        if(this.state.displayBalanceTypePicker){
            var items = balanceType.map((item, index)=>{
                            return ( 
                                    <TouchableOpacity onPress={()=>{
                                        // this.props.setBalanceType(item.type);
                                        this.setState({
                                            coinType:item.type
                                        }) 
                                    }} style={styles.itemLine} key={index}>
                                        <View style={{flexDirection:'row', alignItems:'center',}}>
                                            <Image style={{width:28,height:28}} source={item.icon}></Image>
                                            <CustomStyleText style={styles.itemText}>{item.displayText}</CustomStyleText>
                                        </View>     
                                        <Image style={{width:22,height:22}} source={this.state.coinType==item.type?require('../../images/selector_selected.png'):require('../../images/selector_unselected.png')}></Image>
                                    </TouchableOpacity>   
                            )
                        })
            return(
                <View>
                    <TouchableOpacity style={{
                        position:'absolute', 
                        bottom:0,
                        backgroundColor:'rgba(0,0,0,0.7)', 
                        height: height,
                        width: width}}
                        onPress={()=>{
                        this.setState({
                            displayBalanceTypePicker: false,
                        })
                    }}>
                    <View style={{position:'absolute', backgroundColor:'white', bottom:0, height: 188, width: width}}>
                        
                        {items}
                        <View style={{width:width,height:68,justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.confirm()} style={{width:width-20,height:44,justifyContent:'center',alignItems:'center',backgroundColor:ColorConstants.BGBLUE}}>
                                <CustomStyleText style={{fontSize:15,color:'white'}}>{LS.str('CONFIRM')}</CustomStyleText>
                            </TouchableOpacity>    
                        </View>
                    </View>

                    </TouchableOpacity>
                    
                </View>    
            )
        }
    }

    loadWechatGroup(){ 
        var url = NetConstants.CFD_API.GET_WECHAT_GROUP;
        NetworkModule.fetchTHUrl(
            url,
            {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json; charset=utf-8',
                },  
            }, (responseJson) => { 

                console.log(responseJson);

                this.setState({
                    groupNumber:responseJson
                })

            },
            (exception) => { 
                    
            }) 
    }

    // renderPicker(){
    //     if(this.state.displayBalanceTypePicker){
    //         var items = balanceType.map((item, index)=>{
    //             return (<Picker.Item label={item.displayText} value={item.type} key={index}/>)
    //         })

    //         return (
    //             <TouchableOpacity style={{
    //                     position:'absolute', 
    //                     bottom:0,
    //                     backgroundColor:'rgba(0,0,0,0.7)', 
    //                     height: height,
    //                     width: width}}
    //                 onPress={()=>{
    //                     this.setState({
    //                         displayBalanceTypePicker: false,
    //                     })
    //                 }}>
    //                 <Picker
    //                     style={{position:'absolute', backgroundColor:'white', bottom:0, height: 200, width: width}}
    //                     selectedValue={this.props.balanceType}
                        
    //                     onValueChange={(itemValue, itemIndex) => {
    //                         this.props.setBalanceType(itemValue);

    //                         this.setState({
    //                             displayBalanceTypePicker: false
    //                         })
    //                     }}>
    //                     {items}
    //                 </Picker>
    //             </TouchableOpacity>
    //         );
    //     }
    // }

    renderSeparator(){
        return <View style={styles.separator}></View>
    }

    renderRightPart(rowData){
        if(rowData.item.subtype == "version"){
            return (
                <CustomStyleText style={styles.value}>{this.props.version}</CustomStyleText>
            )
        }else if(rowData.item.subtype=='group'){
            return (
                <CustomStyleText style={styles.value}>{this.state.groupNumber}</CustomStyleText>
            )
        }else if(rowData.item.subtype == "balanceType"){
            return (
                <View style={{flexDirection:'row'}}>
                    <CustomStyleText style={[styles.balanceTypeValue]}>{this.props.balanceType}</CustomStyleText>
                    <Image source={require("../../images/icon_arrow_right.png")}
                            style={styles.arrowIcon}/>
                </View>
            )
        }else{
            return (
                <Image source={require("../../images/icon_arrow_right.png")}
                            style={styles.arrowIcon}/>
            )
        }
    }

    renderItem(rowData){
        return (
            <TouchableOpacity
                style={styles.rowContainer}
                activeOpacity={0.5}
                onPress={()=>this.onSelectNormalRow(rowData)}>
                <View>
                    <View style={styles.rowContainer}>
                        <View style={styles.rowLeftTextContainer}>
                            <CustomStyleText style={styles.title}>{LS.str(rowData.item.title)}</CustomStyleText>
                        </View>
                        {this.renderRightPart(rowData)}
                    </View>
                    {/* {this.renderSeparator()} */}
                </View>
            </TouchableOpacity>);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_TITLE")}
                    showBackButton={true}
                    navigation={this.props.navigation}/>
                <FlatList
                    style={{flex:1, width:width}}
                    data={configListData}
                    keyExtractor={(item, index) => index}
                    renderItem={(data)=>this.renderItem(data)} 
                    />
                {this.renderPicker()}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
    },
    rowContainer: {
        height: 74,
        width: width-30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        alignSelf:'stretch',
        marginLeft:15,
        // marginRight:15,
        backgroundColor:ColorConstants.COLOR_LIST_VIEW_ITEM_BG,
        borderRadius:15,
        marginTop:5,
        marginBottom:5,

    },
    rowLeftTextContainer:{
        flexDirection:'row',
        paddingLeft: 20,
    },
    title:{
        fontSize:15,
        color:'white'
    },
    separator: {
        height: 20,
        backgroundColor: '#f0f0f0',
        marginTop:10, 
    },
    arrowIcon:{
        height:15,
        width:15,
        marginRight:20,
        alignSelf:'center',
    },
    value:{       
        marginRight:20,
        color:'white'
    },
    balanceTypeValue: {
        color: ColorConstants.COLOR_MAIN_THEME_BLUE
    },
    itemLine:{
        height:60,
        width:width, 
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:'space-between'
    },
    itemText:{
        marginLeft:10,
        fontSize:15
    }
});

//make this component available to the app

const mapStateToProps = state => {
    return {
        ...state.meData,
        ...state.settings,
    };
};
  
const mapDispatchToProps = {
    logOut,
    switchLanguage,
    getVersion,
    getBalanceType,
    setBalanceType,
};

var connectedComponent = connect(mapStateToProps, mapDispatchToProps)(MeSettingsScreen);

export default connectedComponent;
module.exports = connectedComponent;