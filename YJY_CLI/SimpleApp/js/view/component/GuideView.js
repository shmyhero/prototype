import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, StyleSheet, 
    Dimensions, 
    Modal,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
 
const {height, width} = Dimensions.get("window");
var Swiper = require('react-native-swiper')
var ColorConstants = require('../../ColorConstants');
class GuideView extends Component {

    static propTypes = {
         
    };

    static defaultProps = {
         callback:()=>{}
    }

    constructor(props){
        super(props)
    }   

    closeGuide(){
        this.props.callback&&this.props.callback()
    }

    render() { 
        imageStyle = {width:width,height:890/750*width}
        return ( 
            <View style={styles.guideWapper}> 
                  <Swiper style={styles.wrapper} loop={false}>
                        <View style={styles.slide}> 
                            <Image 
                                resizeMethod={'resize'}
                                style={imageStyle} 
                                source={require('./../../../images/Guide-page01.png')}/>
                        </View>
                        <View style={styles.slide}> 
                            <Image 
                                style={imageStyle} 
                                source={require('./../../../images/Guide-page02.png')}/>
                        </View>
                        <View style={styles.slide}> 
                            <Image 
                                style={imageStyle} 
                                source={require('./../../../images/Guide-page03.png')}/>
                        </View>
                        <View style={styles.slide}> 
                            <Image 
                                style={imageStyle} 
                                source={require('./../../../images/Guide-page04.png')}/>
                                <TouchableOpacity style={styles.enterArea} onPress={()=>{this.closeGuide()}}>
                                    <Text>进入</Text>
                                </TouchableOpacity> 
                        </View>
                    </Swiper>
            </View>
        );
    }
}   
 
const styles = StyleSheet.create({ 
    guideWapper:{
        paddingTop:20,
        height: height, 
        width: width,
        backgroundColor:ColorConstants.BORDER_LIGHT_BLUE,
        justifyContent:'center',
        alignItems:'center' 
    },
    wrapper: { 
    },
    slide: { 
          flex:1,
          justifyContent:'center'  
    },
    enterArea:{
        position:'absolute',
        top:height-100, 
        left:width/2-15, 
    }
});
 
export default GuideView;
