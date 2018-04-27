//import liraries
import React, { Component } from 'react';
import { View, 
    Text, 
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import NavBar from "../component/NavBar";
var ColorConstants = require("../../ColorConstants");
var {height,width} = Dimensions.get('window');
import { ViewKeys } from '../../../AppNavigatorConfiguration';

// create a component
class BindPurseScreen extends Component {

    constructor(props){
        super(props)

        this.state = {
            purseAddress: ""
        }
    }

    isReadyToBind(){
        if(this.state.purseAddress && this.state.purseAddress.length > 0){
            return true;
        }else{
            return false;
        }
    }

    updateAddress(purseAddress){
        var state = {
            purseAddress: purseAddress
        };        
        this.setState(state)
    }

    bindCard(){
        //TODO: bind card API
        if(this.isReadyToBind()){
            this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT, {backFrom: this.props.navigation.state.key});
        }
    }

    renderConfirmButton(){
        var buttonEnabled = this.isReadyToBind();
        var buttonImage = buttonEnabled ? require("../../../images/position_confirm_button_enabled.png") : require("../../../images/position_confirm_button_disabled.png")
        return (
            <TouchableOpacity
                onPress={()=>this.bindCard()}
                style={styles.okView}>
                <ImageBackground source={buttonImage}
                    style={{width: '100%', height: '100%', alignItems:'center', justifyContent:"center"}}>
                    <Text style={styles.okButton}>
                        确认绑定
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
    
    render() {
        return (
            <View style={styles.container}>                
                <View style={{flex:1}}>
                    <Image style={styles.headerBackground} source={require('../../../images/rank_bg_all.png')}/>
                    <View style={styles.contentContainer}>
                        <View style={styles.rowContainer}>
                            <Text style={{fontSize:15, color:"#7d7d7d"}}>请输入/粘贴钱包地址</Text>
                            <TextInput 
                                underlineColorAndroid={"transparent"}
                                style={{height: 50, }}
                                multiline={true}
                                onChangeText={(purseAddress)=>this.updateAddress(purseAddress)}
                                value={this.state.purseAddress}/>
                        </View>
                        <View style={styles.hintContainer}>
                            <Text style={{fontSize:15, color:"#7d7d7d"}}>
                                绑定须知：入金前需要绑定您的钱包地址，钱包地址绑定后，入金才能和糖果账户关联起来！
                            </Text>
                        </View>
                        <View style={{flex:1}}></View>
                        {this.renderConfirmButton()}
                    </View>
                </View>
                <View style={{position:'absolute', top:0, left:0, right:0, width: width, height:100}}>
                    <NavBar 
                        title="绑定钱包地址"
                        showBackButton={true}
                        backgroundColor="transparent"
                        navigation={this.props.navigation}
                    />
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
        backgroundColor: 'white'
    },
    contentContainer:{
        padding: 15, 
        flex:1,
    },
    headerBackground:{
        width:width, 
        height: 150
    },
    rowContainer: {
        padding: 15, 
        borderWidth: 1, 
        borderColor: "#dddddd",
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'column'
    },
    hintContainer:{
        marginTop: 30,
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
export default BindPurseScreen;
