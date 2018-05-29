//import liraries
import React, { Component } from 'react';
import {
    View,
    Text, 
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';

import { logOut, switchLanguage } from '../redux/actions'
import { connect } from 'react-redux';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window')
import { ViewKeys } from '../../AppNavigatorConfiguration';

var configListData = [
    {'type':'normal','title':'SETTINGS_CENTER_TITLE', 'subtype': 'helpCenter'},
    {'type':'normal','title':'SETTINGS_ABOUT_TITLE', 'subtype': 'aboutUs'},
    {'type':'normal','title':'SETTINGS_SWITCH_LANGUAGE', 'subtype': 'language'},
    {'type':'normal','title':'SETTINGS_VERSION', 'subtype': 'version'},
    {'type':'normal','title':'SETTINGS_LOG_OUT', 'subtype': 'logOut'},
];

// create a component
class SettingsScreen extends Component {
    componentWillReceiveProps(props){
        console.log("componentWillReceiveProps", props)
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
            case "logOut":
                this.props.logOut();
                break
        }
    }

    renderSeparator(){
        return <View style={styles.separator}></View>
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
                        <Image source={require("../../images/icon_arrow_right.png")}
                            style={styles.arrowIcon}/>
                    </View>
                    {this.renderSeparator()}
                </View>
            </TouchableOpacity>);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_TITLE")} showBackButton={true} navigation={this.props.navigation}/>
                <FlatList
                    style={{flex:1, width:width}}
                    data={configListData}
                    keyExtractor={(item, index) => index}
                    renderItem={(data)=>this.renderItem(data)}
                    />
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
});

//make this component available to the app

const mapStateToProps = state => {
    return {
        ...state.meData
    };
};
  
const mapDispatchToProps = {
    logOut,
    switchLanguage,
};
  
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
  
  