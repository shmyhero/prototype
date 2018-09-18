//import liraries
import React, { Component } from 'react';
import { View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    Slider,
    StatusBar,
    Switch,
    Keyboard,
    TextInput,
    TouchableHighlight,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';
//https://github.com/oblador/react-native-animatable

// create a component
export default class HelpScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            value : false,
        }
    } 

    renderTest(){
        return( 
            <View> 
                 <Animatable.Text animation="rubberBand">Zoom me up, Scotty</Animatable.Text>
                 {/* <Animatable.Text animation="slideInDown" iterationCount={7} direction="alternate">Up and down you go</Animatable.Text>
                 <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ textAlign: 'center' }}>❤️</Animatable.Text>
                 <TouchableOpacity onPress={() => this.setState({fontSize: (this.state.fontSize || 10) + 5 })}>
                    <Animatable.Text transition="fontSize" style={{fontSize: this.state.fontSize || 10}}>Size me up, Scotty</Animatable.Text>
                 </TouchableOpacity> */}
            </View> 
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_CENTER_TITLE")} showBackButton={true} navigation={this.props.navigation}/>
                <ScrollView style={{flex:1}}>
                    {this.renderTest()}
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