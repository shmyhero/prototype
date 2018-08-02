//import liraries
import React, { Component } from 'react';
import { View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView
} from 'react-native';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window');

// create a component
export default class HelpScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_CENTER_TITLE")} showBackButton={true} navigation={this.props.navigation}/>
                <ScrollView style={{flex:1}}>
                    <Image style={{width:width, height: width / 750 * 9456}} resizeMode="contain" source={require('../../images/instruction.png')}/>
                </ScrollView>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

//make this component available to the app
module.exports = HelpScreen;