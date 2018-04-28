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
    Clipboard,
} from 'react-native';
import NavBar from '../component/NavBar';
var ColorConstants = require('../../ColorConstants')
var {height,width} = Dimensions.get('window');
import SubmitButton from '../component/SubmitButton';
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");
import LogicData from '../../LogicData';
// create a component
class DepositScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            tokenAddress: "",
        }
    }

    componentWillMount(){
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.TH_PURSE_ADDRESS,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                },
            },(responseJson)=>{
                this.setState({
                    tokenAddress: responseJson.address,
                });
            },()=>{
                
            });
    }
    
    copyAddress(){
        Clipboard.setString(this.state.tokenAddress)
        alert("复制成功")
    }

    renderTopPart(){
        var imageHeight = width/15*16;
        var imageWidth = width;

        return (
            <ImageBackground style={{height:imageHeight, width:imageWidth}} source={require("../../../images/deposit_token_image.jpg")}>
                <View style={{position:'absolute', top: imageHeight* 0.6, left: imageWidth * 0.15, flex:1}}>
                    <Text style={styles.titleText}>注册以太坊钱包</Text>
                    <Text style={styles.bodyText}>
                        以太坊官网：
                        <Text style={styles.linkText}>{"https://wallet.ethereum.org"}</Text>
                    </Text>
                </View>
                <View style={{position:'absolute', top: imageHeight* 0.8, left: imageWidth * 0.15, 
                    width:imageWidth * 0.8, flex:1}}>
                    <Text style={styles.titleText}>用户把自己的Token转入盈交易</Text>
                    <Text style={styles.bodyText} numberOfLines={3}>
                        盈交易收款地址: 
                        <Text style={styles.linkText}>{this.state.tokenAddress}</Text>
                    </Text>
                </View>
            </ImageBackground>);
    }

    render() {
        
        return (
            <View style={styles.container}>
                <NavBar title="入金"
                        showBackButton={true}
                        backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}                       
                        navigation={this.props.navigation}
                        />
                <View style={styles.contentContainer}>
                    {this.renderTopPart()}
                    <SubmitButton onPress={()=>this.copyAddress()}
                        text={"复制盈交易收款地址"} />
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
    titleText:{
        fontSize: 17,
        color:'#333333'
    },
    bodyText: {
        fontSize: 15,
        color:'#666666',
    },
    linkText: {
        fontSize: 15,
        color:'#0099ff',
    }
});

//make this component available to the app
export default DepositScreen;
