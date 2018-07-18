//import liraries
import React, { Component } from 'react';
import {
    View,
    Text, 
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
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window')
import ViewKeys from '../ViewKeys';

var configListData = [
    {'type':'normal','title':'SETTINGS_CENTER_TITLE', 'subtype': 'helpCenter'},
    {'type':'normal','title':'SETTINGS_ABOUT_TITLE', 'subtype': 'aboutUs'},
    {'type':'normal','title':'SETTINGS_SWITCH_LANGUAGE', 'subtype': 'language'},
    {'type':'normal','title':'SETTINGS_VERSION', 'subtype': 'version'},
    {'type':'normal','title':'SETTINGS_LOG_OUT', 'subtype': 'logOut'},
    {'type':'normal','title':'SETTINGS_BALANCE_TYPE', 'subtype': 'balanceType'},
];

var balanceType = [
    {'type': 'BTH', displayText: 'BTH'},
    {'type': 'ETH', displayText: 'ETH'}
]

// create a component
class MeSettingsScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            displayBalanceTypePicker: false,
        }
    }

    componentWillMount(){
        if(this.props.version == ""){
            this.props.getVersion()
            this.props.getBalanceType();
        }
    }

    componentWillReceiveProps(props){
        if(!props.userLoggedin){
            this.props.navigation.goBack(null)
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
                    displayBalanceTypePicker: true
                })
                break
            case "logOut":
                this.props.logOut();
                break
        }
    }

    renderPicker(){
        if(this.state.displayBalanceTypePicker){
            var items = balanceType.map((item, index)=>{
                return (<Picker.Item label={item.displayText} value={item.type} key={index}/>)
            })

            return (
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
                    <Picker
                        style={{position:'absolute', backgroundColor:'white', bottom:0, height: 200, width: width}}
                        selectedValue={this.props.balanceType}
                        
                        onValueChange={(itemValue, itemIndex) => {
                            this.props.setBalanceType(itemValue);

                            this.setState({
                                displayBalanceTypePicker: false
                            })
                        }}>
                        {items}
                    </Picker>
                </TouchableOpacity>
            );
        }
    }

    renderSeparator(){
        return <View style={styles.separator}></View>
    }

    renderRightPart(rowData){
        if(rowData.item.subtype == "version"){
            return (
                <Text style={styles.value}>{this.props.version}</Text>
            )
        }else if(rowData.item.subtype == "balanceType"){
            return (
                <Text style={styles.value}>{this.props.balanceType}</Text>
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
                            <Text style={styles.title}>{LS.str(rowData.item.title)}</Text>
                        </View>
                        {this.renderRightPart(rowData)}
                    </View>
                    {this.renderSeparator()}
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
        backgroundColor: 'white',
    },
    rowContainer: {
        height: 64,
        width: width,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        alignSelf:'stretch',
    },
    rowLeftTextContainer:{
        flexDirection:'row',
        paddingLeft: 20,
    },
    title:{
        fontSize:15,
        color:'black'
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    arrowIcon:{
        height:15,
        width:15,
        marginRight:20,
        alignSelf:'center',
    },
    value:{       
        marginRight:20,
    },
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