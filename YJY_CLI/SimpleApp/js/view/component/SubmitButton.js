//import liraries
import React, {
    Component,
} from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet,
    TouchableOpacity,
    ImageBackground,
	ViewPropTypes,
    Image,
    Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
var ColorPropType = require('ColorPropType');
var LS = require("../../LS");
var {height, width} = Dimensions.get("window");
var ColorConstants = require("../../ColorConstants");

// create a component
class SubmitButton extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        enable: PropTypes.bool,
        enableImage: Image.propTypes.source,
        disableImage: Image.propTypes.source,
        text: PropTypes.string,
        isImportant: PropTypes.bool,
        enableTextColor: ColorPropType,
        disableTextColor: ColorPropType,
        enableColorGradient: PropTypes.arrayOf(ColorPropType),
        disableColorGradient: PropTypes.arrayOf(ColorPropType),
        style: ViewPropTypes.style,
    }

    static defaultProps = {
        onPress: ()=>{},
        enable: true,
        enableImage: require("../../../images/position_confirm_button_enabled.png"),
        disableImage: require("../../../images/position_confirm_button_disabled.png"),
        text: LS.str("FINISH"),
        isImportant: false,
        style: {}
    }

    importantColorGradientEnable = ["#f0bd0a", "#fcdc45"]
    importantTextColorEnable = '#917202'
    unimportantColorGradientEnable = ["#0f96ea",  "#22bdfc"]
    unimportantTextColorEnable = 'white'
    colorGradientDisable = ["#999999", "#AAAAAA"]
    textColorDisable = "white"

    constructor(props){
        super(props)
        this.state = this.props
    }

    componentWillReceiveProps(props){
        var newProps = {}
        if(props.enable != undefined){
            newProps.enable = props.enable
        }
        this.setState(newProps);
    }
    onButtonPressed(){
        if(this.state.enable){
            this.props.onPress && this.props.onPress();
        }
    }

    render() {
        var colorGradient = [];

        var textColor = "";
        if(this.state.enable){
            if(this.props.enableColorGradient){
                colorGradient = this.props.enableColorGradient;
            }else{
                colorGradient = this.props.isImportant ? this.importantColorGradientEnable : this.unimportantColorGradientEnable;
            }
            if(this.props.enableTextColor){
                textColor = this.props.enableTextColor;
            }else{
                textColor = this.props.isImportant ? this.importantTextColorEnable : this.unimportantTextColorEnable;
            }
        }else{
            if(this.props.disableColorGradient){
                colorGradient = this.props.disableColorGradient
            }else{
                colorGradient = this.colorGradientDisable
            }
            if(this.props.disableTextColor){
                textColor = this.props.disableTextColor;
            }else{
                textColor = this.textColorDisable;
            }
        }
        
        return (
            <TouchableOpacity
                onPress={()=>this.onButtonPressed()}
                style={[styles.backgroundImageStyle, this.props.style]}>
                <LinearGradient start={{x:0.0, y:0}}
                    end={{x:1.0, y:0.0}}
                    style={[styles.okView]}
                    colors={colorGradient}>
                    <Text style={[styles.okButton, {color: textColor}]}>
                        {this.props.text}
                    </Text>
                </LinearGradient>
                {/* <ImageBackground source={buttonImage}
                    resizeMode={"stretch"}
                    style={styles.okView}>
                    
                </ImageBackground> */}
            </TouchableOpacity>
        );
       
        // var buttonImage = this.state.enable ? this.state.enableImage : this.state.disableImage
        
        // return (
        //     <TouchableOpacity
        //         onPress={()=>this.onButtonPressed()}
        //         style={styles.backgroundImageStyle}>
        //         <ImageBackground source={buttonImage}
        //             resizeMode={"stretch"}
        //             style={styles.okView}>
        //             <Text style={styles.okButton}>
        //                 {this.props.text}
        //             </Text>
        //         </ImageBackground>
        //     </TouchableOpacity>
        // );
    }
}

// define your styles
const styles = StyleSheet.create({
    okView: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
    },
    okButton: {
		color: 'white',
		textAlign: 'center',
        fontSize: 17,
    },
    backgroundImageStyle: {
        alignSelf:'center',
        alignItems:'stretch',
        justifyContent:"center",
        height:43,
        width:315
    }
});

//make this component available to the app
export default SubmitButton;
