
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PropTypes,
  Image,
  TouchableOpacity,
} from 'react-native';
import Pie from 'react-native-pie'

/*<Image source={require('../../../images/bannerIntro.jpg')}/>  <Text style={{padding:15,fontSize:10,backgroundColor: 'blue', flex:1}}>NEW TOPIC</Text>*/

export default class  BannerIntro extends React.Component {

    static defaultProps = {
        imgUrl:'',
        title:'大盘连连猜|美国科技股大盘明日走势',
        category:'NEW TOPIC',
        buttonText:'参与竞猜',
        buttonClicked:()=>{},
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'blue'}}>
                 <View style={{}}>
                    <Text style={{padding:10,color:'white',fontSize:12}}>{this.props.title}</Text>
                 </View>
                 <View style={{flexDirection:'row'}}>
                    <Text style={{padding:10,color:'white',fontSize:10}}>{this.props.category}</Text>

                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end',paddingRight:15}}>
                        <TouchableOpacity onPress={()=>{this.props.buttonClicked()}}>
                        <Text style={{fontSize:10,color:'white',borderWidth:1,borderColor:'white',paddingLeft:10,paddingRight:10,paddingTop:4,paddingBottom:4}}>{this.props.buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                 </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

})



module.exports = BannerIntro;



