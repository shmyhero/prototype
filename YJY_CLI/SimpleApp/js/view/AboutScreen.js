//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView,Dimensions} from 'react-native';

import NavBar from "./component/NavBar"
var LS = require('../LS')
var {height, width} = Dimensions.get('window')

// create a component
class AboutScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavBar title={LS.str("SETTINGS_ABOUT_TITLE")} showBackButton={true} navigation={this.props.navigation}/>
                <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <ScrollView style={styles.scrollView}>
                    <Text style={styles.textLine}>BitHero is the “spiritual successor” of the original pioneering “gamied” mobile nanceapp, TradeHero.</Text>
                    <Text style={styles.textLine}>On the iOS platform, TradeHero has been ranked #1 in the nancecategory, in over 90countries.</Text>
                    <Text style={styles.textLine}>As a pioneering mobile market leader, TradeHero successfully brokethrough traditionalparadigms of boring trading apps, and mergednance with gaming and social media.</Text>
                    <Text style={styles.textLine}>But as this new era of cutting edge nancial technology (Fintech)emerged, bringing with it Blockchain and cryptocurrencies, TradeHerowas starting to show its age and risked becoming obsolete. Therefore,it was decided to build a new mobile app, from the ground up,optimizing the best features and best practices learned fromTradeHero’s success, while adding the key missing piece。</Text>
                    <Text style={styles.textLine}>The result of this evolution is BitHero.BitHero has everything great aboutTradeHero, and through this ICO,BitHero is ready to take things to the next level.</Text>
                    <Text style={styles.textLine}>A phrase that perfectly describesBitHero is:“Fun, Frictionless Fintech.”</Text> 
                    </ScrollView>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    },

    scrollView:{
        width:width,
        height:height,
        backgroundColor:'white',
        paddingLeft:10,
        paddingRight:10,
    },
    textLine:{
        marginTop:10,
        fontSize:15,

    }
});

//make this component available to the app
export default AboutScreen;
