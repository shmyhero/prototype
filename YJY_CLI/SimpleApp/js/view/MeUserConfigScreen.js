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

import { setNickName, setPortrait } from '../redux/actions'
import { connect } from 'react-redux';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window')
import { ViewKeys } from '../../AppNavigatorConfiguration';
var ImagePicker = require('react-native-image-picker');
var Toast = require('@remobile/react-native-toast');

var configListData = [
    {'type':'normal','title':'SETTINGS_PORTRAIT', 'subtype': 'portrait'},
    {'type':'normal','title':'SETTINGS_NICKNAME', 'subtype': 'nickname'},
    {'type':'normal','title':'SETTINGS_MOBILE', 'subtype': 'mobile'},
];

// create a component
class MeUserConfigScreen extends Component {
    componentWillReceiveProps(props){
        console.log("componentWillReceiveProps", props)
        if(!props.userLoggedin){
            this.props.navigation.goBack(null)
        }
    }

    onSelectNormalRow(rowData){
        switch(rowData.item.subtype){
            case "portrait":
                this.selectPortrait();
                break
            case "nickname":
                this.props.navigation.navigate(ViewKeys.SCREEN_SET_NICKNAME);
                break
            case "mobile":
                break
        }
    }

    selectPortrait(){
        var Options = {
            title: null, // specify null or empty string to remove the title
            cancelButtonTitle: LS.str('CANCLE'),
            takePhotoButtonTitle: LS.str('IMPORT_FROM_PHOTO'), // specify null or empty string to remove this button
            chooseFromLibraryButtonTitle: LS.str('IMPORT_FROM_ALBUM'), // specify null or empty string to remove this button
            cameraType: 'back', // 'front' or 'back'
            mediaType: 'photo', // 'photo' or 'video'
            maxWidth: Math.floor(width), // photos only
            maxHeight: Math.floor(height), // photos only
            aspectX: 3, // android only - aspectX:aspectY, the cropping image's ratio of width to height
            aspectY: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
            quality: 0.7, // 0 to 1, photos only
            angle: 0, // android only, photos only
            allowsEditing: false, // Built in functionality to resize/reposition the image after selection
            noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
            storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
            skipBackup: true, // ios only - image will NOT be backed up to icloud
            path: 'images' // ios only - will save image at /Documents/images rather than the root
            },
        };

        ImagePicker.showImagePicker(Options, (response) => {
            //console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                Toast.show(response.error)
            }
            else {
                // You can display the image using either data:                
                this.props.setPortrait(response.data);
            }
        });
    }

    renderSeparator(){
        return <View style={styles.separator}></View>
    }

    renderRightItem(rowData){

        var view = null;
        if(rowData.item.subtype == "portrait"){
            view = (<Image style={styles.headPortrait} source={this.props.avatarSource}></Image>);
        }else if(rowData.item.subtype == "nickname"){
            view = (<Text >{this.props.nickname}</Text>);
        }else if(rowData.item.subtype == "mobile"){
            view = (<Text >{this.props.nickname}</Text>);
        }

        return (
            <View style={styles.rowRightPart}>
                {view}
                <Image source={require("../../images/icon_arrow_right.png")}
                    style={styles.arrowIcon}/>
            </View>
        );
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
                        {this.renderRightItem(rowData)}
                    </View>
                    {this.renderSeparator()}
                </View>
            </TouchableOpacity>);
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_USER_CONFIG")} showBackButton={true} navigation={this.props.navigation}/>
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
    rowRightPart:{
        flexDirection: 'row'
    },
    headPortrait:{
        width:40,
        height:40,
        borderRadius:20,
        alignSelf:'center'
    },
});

//make this component available to the app

const mapStateToProps = state => {
    return {
        ...state.meData
    };
};
  
const mapDispatchToProps = {
    setNickName,
    setPortrait
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MeUserConfigScreen);
  
  