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
    TouchableOpacity,
    Alert
} from 'react-native';
import NavBar from './component/NavBar';
var LS = require("../LS");
var {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';//https://github.com/oblador/react-native-animatable
import BottomDialog from './component/Dialog/BottomDialog';


// create a component
export default class HelpScreen extends Component {

    constructor(props){
        super(props)
        this.state = {
            value : false, 
        }
    } 

    helloworldPressed(){
        Alert.alert('helloworldPressed');
    }

    renderTest(){
        var contentHeight = 300
        var contentView = <View style={{width:width,height:contentHeight,backgroundColor:'yellow'}}>
            <TouchableOpacity onPress={()=>{this.helloworldPressed()}}>
                <Text>Hello World2</Text>
            </TouchableOpacity> 
        </View>

        return( 
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{
                    this.refs['bottomDialog'].show()
                }}> 
                    <Animatable.Text animation="rubberBand">Zoom me up, Scotty</Animatable.Text> 
                </TouchableOpacity> 
                <BottomDialog  
                    ref='bottomDialog'
                    content={contentView}
                    contentHeight={contentHeight}
                    contentWidth={width}
                    closeModal={()=>{
                        console.log('BottomDialog closeModal!')
                    }}/>
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