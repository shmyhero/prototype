//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
var ColorPropType = require('ColorPropType');
import LinearGradient from 'react-native-linear-gradient'
import {
    View,     
	StyleSheet,
	ViewPropTypes,
    Platform,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import CustomStyleText from './CustomStyleText'
var ColorConstants = require('../../ColorConstants');
var UIConstants = require('../../UIConstants');
import * as Animatable from 'react-native-animatable';

// create a component
class NavBar extends Component {

    static propTypes = {
		showBackButton: PropTypes.bool,
		showSearchButton: PropTypes.bool,
		imageOnLeft: PropTypes.number,
		imageOnRight: PropTypes.number,
		textOnLeft: PropTypes.string,
		textOnRight: PropTypes.string,
		rightTextColor: ColorPropType,
		leftPartOnClick: PropTypes.func,
		rightImageStyle: ViewPropTypes.style,
		rightPartOnClick: PropTypes.func,
		rightCustomContent: PropTypes.func,
		enableRightText: PropTypes.bool,
		viewOnRight: PropTypes.element,
		viewOnLeft: PropTypes.element,
        backButtonOnClick: PropTypes.func,
        title: PropTypes.string,
        titleColor: ColorPropType,
		titleStyle: CustomStyleText.propTypes.style,
		titleOpacity: PropTypes.number,
		subTitle: PropTypes.string,
		subTitleStyle: CustomStyleText.propTypes.style,
		barStyle: ViewPropTypes.style,		
		hideStatusBar: PropTypes.bool,
		onlyShowStatusBar: PropTypes.bool,
		backgroundColor: ColorPropType,
		backgroundGradientColor:PropTypes.arrayOf(ColorPropType),
    }
    
    static defaultProps = {
        showBackButton: true,
        showSearchButton: false,
        imageOnLeft: null,
        textOnLeft: null,
        textOnRight: null,
        imageOnRight: null,
        rightImageStyle: null,
        viewOnRight: null,
        viewOnLeft: null,
        leftPartOnClick: null,
        rightPartOnClick: null,
        backButtonOnClick: null,
        title: "详情",
        subTitle: null,
        rightCustomContent: null,
        enableRightText: true,
        hideStatusBar: false,
        onlyShowStatusBar: false,
		titleOpacity: 1,
        backgroundColor: null,
		backgroundGradientColor: null,
		titleColor: ColorConstants.NAVBAR_TEXT_COLOR,
    }

    backOnClick(){
		console.log("backOnClick")
		console.log(this.props.rightPartOnClick)
		console.log(this.props.leftPartOnClick)
		if(this.props.leftPartOnClick){
			console.log("this.props.leftPartOnClick")
			this.props.leftPartOnClick();
		}
		else if(this.props.navigation && this.props.navigation.goBack){
			console.log("this.props.navigation.goBack")
			if(this.props.navigation.state.params && this.props.navigation.state.params.backFrom){
				this.props.navigation.goBack(this.props.navigation.state.params.backFrom)
			}else{                            
				this.props.navigation.goBack(null)
			}
		}
    }

    render() {
        var {height,width} = Dimensions.get('window');

		var colorList = null
        var backgroundColor = ColorConstants.COLOR_MAIN_THEME_BLUE;
		if(this.props.backgroundColor){
			backgroundColor = this.props.backgroundColor;
		}
		
		var navBarColor = ColorConstants.COLOR_MAIN_THEME_BLUE;
		if(this.props.backgroundColor && this.props.backgroundColor !== "transparent"){
			//Which means the background doesn't have an alpha channel
			navBarColor = backgroundColor;
		}

		if (this.props.backgroundGradientColor != null){
			return (
				<LinearGradient start={{x: 0.0, y: 0}} end={{x: 1.0, y: 0}} colors={this.props.backgroundGradientColor} 
					style={[styles.container, {width: width}]}>
					{this.renderStatusBar("transparent")}
					{this.renderLeftPart()}
					{this.renderTitle()}
					{this.renderRightPart()}
				</LinearGradient>
			);
		} else if(this.props.onlyShowStatusBar){
			return this.renderStatusBar(navBarColor);
		} else{
			return (
			<View colors={colorList} style={[styles.container, 
				{backgroundColor: backgroundColor, width: width}]}>
				{this.renderStatusBar(navBarColor)}
				{this.renderLeftPart()}
				{this.renderTitle()}
				{this.renderRightPart()}
			</View>
			);
		}     
	}	

    renderStatusBar(navBarColor){
		if (Platform.OS === "android"){
			var bgColor = Platform.Version >= 21 ? "transparent" : navBarColor;
			var translucent = Platform.OS === "android";
			// StatusBar.setBackgroundColor(bgColor);
			//StatusBar.setTranslucent(true)
			//StatusBar.setBackgroundColor(bgColor);
			//StatusBar.setBarStyle('light-content');
            return (
				<View style={{height:24, backgroundColor:navBarColor}}>
					<StatusBar
						backgroundColor={bgColor}
						translucent={true}/>
				</View>)
		}else{
			return (<View style={{height:20, backgroundColor:navBarColor}}/>);
		}
    }
    
    renderTitle(){
		if(this.props.titleOpacity > 0){
			var titleStyle={}
			if(this.props.titleColor){
				titleStyle.color = this.props.titleColor;
			}
			return(
				<View style={styles.centerContainer}>
					<CustomStyleText style={[styles.title, titleStyle, this.props.titleStyle, {opacity: this.props.titleOpacity}]}>
						{this.props.title}
					</CustomStyleText>
					{this.renderSubTitle()}
				</View>
			);
		}else{
			return ( <View style={styles.centerContainer}/>)
		}
    }

	renderLeftPart(){
		//viewOnRight
		if(this.props.viewOnLeft){
			return (
				<TouchableOpacity
					onPress={()=>this.props.leftPartOnClick && this.props.leftPartOnClick()}>
					{this.props.viewOnLeft}
				</TouchableOpacity>
				);
		}else{
			return (
				<View style={styles.leftContainer}>
					{this.renderBackButton()}
					{this.renderLeftImage()}
					{this.renderLeftText()}
				</View>)
		}
	}

	renderLeftImage(){
		//leftImage
		if(this.props.imageOnLeft){
			var imageOnLeft = this.props.imageOnLeft;

			var imageStyles = [styles.leftImage];
			if(this.props.leftImageStyle){
				imageStyles.push(this.props.leftImageStyle);
			}
			return (
				<TouchableOpacity
					onPress={()=> this.props.leftPartOnClick && this.props.leftPartOnClick()}>
					<Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" 
						style={imageStyles}
						source={this.props.imageOnLeft}/>
				</TouchableOpacity>);
		}
	}
	
	renderRightPart(){
		//viewOnRight
		if(this.props.viewOnRight){
			return (
				<TouchableOpacity
					onPress={()=>this.props.rightPartOnClick && this.props.rightPartOnClick()}>
					{this.props.viewOnRight}
				</TouchableOpacity>
			);
		}else{
			return (
				<View style={styles.rightContainer}>
					{this.renderSearchButton()}
					{this.renderRightText()} 
					{this.renderRightCustomContent()}
					{this.renderRightImage()}
				</View>
			);
		}
	}

	renderBackButton() {
		if(!this.props.imageOnLeft && this.props.navigation &&  this.props.navigation.goBack && this.props.showBackButton) {
			var imageOnLeft = require('../../../images/back.png');

			return (
				<TouchableOpacity
					onPress={()=>this.backOnClick()}
					// underlayColor={ColorConstants.title_blue()}
					>
					<View style={{padding: 5}}>
						<Image
							style={styles.backButton}
							source={imageOnLeft}/>
					</View>
				</TouchableOpacity>
			);
		}
	}

	renderLeftText() {
		if (this.props.textOnLeft !== null) {
			return (
				<TouchableOpacity
					onPress={()=>this.backOnClick()}>

					<CustomStyleText style={styles.textOnLeft}>
						{this.props.textOnLeft}
					</CustomStyleText>

				</TouchableOpacity>
			);
		}
	}

	renderSearchButton() {
		if (this.props.showSearchButton) {
			return (
				<TouchableOpacity
					onPress={this.searchButtonClicked}>

					<Image
						style={styles.rightImage}
						source={require('../../../images/search.png')}/>

				</TouchableOpacity>
			);
		}
	}

	renderRightText() {
		if (this.props.textOnRight !== null) {
			var textOnRightStyle = {}
			if(this.props.rightTextColor){
				textOnRightStyle.color = this.props.rightTextColor;
			}
			if(this.props.enableRightText) {
				return (
					<TouchableOpacity
						onPress={()=> this.props.rightPartOnClick && this.props.rightPartOnClick()}>
						<CustomStyleText style={[styles.textOnRight, textOnRightStyle]}>
							{this.props.textOnRight}
						</CustomStyleText>
					</TouchableOpacity>
				);
			}
			else {
				return (
					<CustomStyleText style={[styles.disabledTextOnRight,textOnRightStyle]}>
						{this.props.textOnRight}
					</CustomStyleText>
					)
			}
		}
	}

	renderRightImage() {
		if (this.props.imageOnRight !== null) {
			var imageStyles = [styles.rightImage];
			if(this.props.rightImageStyle){
				imageStyles.push(this.props.rightImageStyle);
			}

			console.log("this.props.rightPartOnClick ", this.props.rightPartOnClick)
			return (
				<TouchableOpacity
					onPress={()=> this.props.rightPartOnClick && this.props.rightPartOnClick()}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" 
						style={imageStyles}
						source={this.props.imageOnRight}/>
				     

				</TouchableOpacity>
			);
		}
	}

	renderSubTitle() {
		if (this.props.subTitle !== null) {
			return (
				<CustomStyleText style={this.props.subTitleStyle}>
					{this.props.subTitle}
				</CustomStyleText>
			)
		}
	}

	renderRightCustomContent() {
		if (this.props.rightCustomContent !== null) {
			return (
				<View>
					{this.props.rightCustomContent()}
				</View>
			);
		}
	}
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: UIConstants.HEADER_HEIGHT,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : UIConstants.STATUS_BAR_ACTUAL_HEIGHT,
    },
    leftContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	centerContainer: {
		flex: 2,
	},
	rightContainer: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	backButton: {
		width: 20,
		height: 14,
		marginLeft: 10,
		resizeMode: Image.resizeMode.contain,
	},
	rightImage: {
		width: 21,
		height: 21,
		marginRight: 20,
		resizeMode: Image.resizeMode.contain,
	},
	leftImage: {
		width: 21,
		height: 21,
		marginLeft: 20,
		resizeMode: Image.resizeMode.contain,
	},
	left: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	title: {
		fontSize: 18,
		textAlign: 'center', 
	},
	textOnLeft: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		marginLeft: 20,
	},
	textOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 15,
	},
	disabledTextOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		opacity:0.6,
		marginRight: 15,
	},
});

//make this component available to the app
export default NavBar;
