//import liraries
import React, { Component } from 'react';
import {
    View, 
    Text,
    StyleSheet,
    ImageBackground,
    TextInput,
    Image } from 'react-native';
import NavBar from './component/NavBar';

// create a component
class DepositScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            balance: 100,
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="在线充值"
                        showBackButton={true}
                        backgroundColor="transparent"
                        titleStyle={{color: '#666666'}}
                        navigation={this.props.navigation}/>
                <View style={styles.contentContainer}>
                    <View>
                        <Image source={{}}/>
                        <Text style={styles.hintText}>糖果可用于产品交易及服务，1元=1糖果</Text>
                    </View>
                    <Text style={styles.rowTitle}>当前剩余糖果: {+ this.state.balance}</Text>

                    <View style={{height: 180, alignSelf: 'stretch', marginLeft:10, marginRight: 10,
                                    flexDirection:'column'}}>
                        <ImageBackground style={{width:"100%", height:"100%"}}
                                            source={require("../../images/me_balance_border.png")}>
                            <View style={{padding:20,flexDirection:'row'}}>
                                <Text style={styles.rowHeader}>糖果数量: </Text>
                                <TextInput style={styles.rowValue}></TextInput>
                            </View>
                            <View style={{padding:20,flexDirection:'row'}}>
                                <Text style={styles.rowHeader}>待支付金额</Text>
                                <TextInput style={styles.rowValue}></TextInput>
                            </View>
                        </ImageBackground>
                    </View>
                    <Text style={styles.rowTitle}>选择支付方式</Text>
                    <View style={{
                        flex:1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        }}>
                        
                    </View>
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
        padding:20
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
        color:'#8c8d90'
    }
});

//make this component available to the app
export default DepositScreen;
