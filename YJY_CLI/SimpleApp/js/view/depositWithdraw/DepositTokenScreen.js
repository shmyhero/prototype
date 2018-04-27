//import liraries
import React, { Component } from 'react';
import {
    View, 
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    Clipboard
} from 'react-native';
import NavBar from '../component/NavBar';
var ColorConstants = require('../../ColorConstants')
var {height,width} = Dimensions.get('window');

// create a component
class DepositScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            tokenAddress: "tokenAddress",
        }
    }
    
    copyAddress(){
        Clipboard.setString(this.state.tokenAddress)
        alert("复制成功")
    }

    renderConfirmButton(){
        var buttonEnabled = true;
        var buttonImage = buttonEnabled ? require("../../../images/position_confirm_button_enabled.png") : require("../../../images/position_confirm_button_disabled.png")
        return (
            <TouchableOpacity
                onPress={()=>this.copyAddress()}
                style={styles.okView}>
                <ImageBackground source={buttonImage}
                    style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                    <Text style={styles.okButton}>
                        复制盈交易收款地址
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="入金"
                        showBackButton={true}
                        backgroundColor="transparent"
                        titleColor={'#0066cc'}
                        navigation={this.props.navigation}
                        />
                <View style={styles.contentContainer}>
                    <Image style={{height:width/15*16, width:width}} source={require("../../../images/deposit_token_image.jpg")}/>
                    {this.renderConfirmButton()}
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
        backgroundColor: 'white',
    },
    contentContainer:{
        flex: 1,
    },
    hintText:{
        fontSize: 11,
        color: '#666666',
    },
    rowHeader:{
        flex: 2,
        fontSize: 15,
        color:'#8c8d90'
    },
    rowValue:{
        flex: 3,
        fontSize: 15,
        color:'#269cee'
    },
    rowTitle:{
        fontSize:20,
        color:'#8c8d90',
        marginTop:15,
        marginBottom:10,
    },
    blockContainer:{
        height: 144,
        alignSelf: 'stretch',
        flexDirection:'column'
    },
    rowContainer:{
        padding:20,
        flexDirection:'row',
        height:68,
        alignItems:'center'
    },
    darkSeparator: {
        height: 0.5,
        marginLeft:4,
        marginRight:4,
		backgroundColor: '#eeeeee',
    },
    paymentIcon:{
        height:30,
        width:30
    },
    okView: {
		width: 332,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
		alignSelf: 'center',
    },
	okButton: {
		color: 'white',
		textAlign: 'center',
        fontSize: 17,
        position:'absolute',
        top:17
	},

});

//make this component available to the app
export default DepositScreen;
