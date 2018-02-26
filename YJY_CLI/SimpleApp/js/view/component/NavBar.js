//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
var ColorPropType = require('ColorPropType');
import {
    View, 
    Text,
	StyleSheet,
	ViewPropTypes,
    Platform,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
var ColorConstants = require('../../ColorConstants');
var UIConstants = require('../../UIConstants');

// create a component
class NavBar extends Component {

    static propTypes = {
		showBackButton: PropTypes.bool,
		showSearchButton: PropTypes.bool,
		imageOnLeft: PropTypes.number,
		textOnLeft: PropTypes.string,
		textOnRight: PropTypes.string,
		imageOnRight: PropTypes.number,
		rightImageStyle: ViewPropTypes.style,
		viewOnRight: PropTypes.element,
		viewOnLeft: PropTypes.element,
		leftTextOnClick: PropTypes.func,
		leftButtonOnClick: PropTypes.func,
		rightTextOnClick: PropTypes.func,
		rightImageOnClick: PropTypes.func,
        backButtonOnClick: PropTypes.func,
        title: PropTypes.string,
		subTitle: PropTypes.string,
		subTitleStyle: ViewPropTypes.style,
		backgroundColor: ColorPropType,
		rightCustomContent: PropTypes.func,
		barStyle: ViewPropTypes.style,
		titleStyle: ViewPropTypes.style,
		enableRightText: PropTypes.bool,
		hideStatusBar: PropTypes.bool,
		onlyShowStatusBar: PropTypes.bool,
		titleOpacity: PropTypes.number,
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
        leftTextOnClick: null,
        leftButtonOnClick: null,
        rightTextOnClick: null,
        rightImageOnClick: null,
        backButtonOnClick: null,
        title: "详情",
        subTitle: null,
        backgroundColor: null,
        rightCustomContent: null,
        enableRightText: true,
        hideStatusBar: false,
        onlyShowStatusBar: false,
        titleOpacity: 1,
    }

    backOnClick(){
		if(this.props.navigation &&  this.props.navigation.goBack){
			this.props.navigation.goBack(null);
		}
    }

    render() {
        var {height,width} = Dimensions.get('window');

        var backgroundColor = ColorConstants.COLOR_MAIN_THEME_BLUE;
		if(this.props.backgroundColor){
			backgroundColor = this.props.backgroundColor;
        }
        var navBarColor = ColorConstants.COLOR_MAIN_THEME_BLUE;
		if(this.props.backgroundColor && this.props.backgroundColor !== "transparent"){
			//Which means the background doesn't have an alpha channel
			navBarColor = this.props.backgroundColor;
		}

		console.log("backgroundColor " + backgroundColor)
		if(this.props.onlyShowStatusBar){
			return this.renderStatusBar(navBarColor);
		}else{
			return (
				<View style={[
					styles.container, 
					{
						backgroundColor: backgroundColor,
						width: width,
					},]}>
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
				<View style={{height:24}}>
					<StatusBar
						backgroundColor={bgColor}
						translucent={true}/>
				</View>)
		}else{
			return (<View style={{height:20}}/>);
		}
    }
    
    renderTitle(){
		if(this.props.titleOpacity > 0){
			return(
				<View style={styles.centerContainer}>
					<Text style={[styles.title, this.props.titleStyle, {opacity: this.props.titleOpacity}]}>
						{this.props.title}
					</Text>
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
			return this.props.viewOnLeft;
		}else{
			return (
				<View style={styles.leftContainer}>
					{this.renderBackButton()}
					{this.renderLeftText()}
				</View>)
		}
	}

	renderRightPart(){
		//viewOnRight
		if(this.props.viewOnRight){
			return this.props.viewOnRight;
		}else{
			return (
				<View style={styles.rightContainer}>
					{this.renderSearchButton()}
					{this.renderRightText()}
					{this.renderRightImage()}
					{this.renderRightCustomContent()}
				</View>);
		}
	}

	renderBackButton() {
		if(this.props.navigation &&  this.props.navigation.goBack && this.props.showBackButton) {
			var imageOnLeft = require('../../../images/back.png');
			if(this.props.imageOnLeft){
				imageOnLeft = this.props.imageOnLeft;
			}

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
					onPress={this.leftTextOnClick}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Text style={styles.textOnLeft}>
						{this.props.textOnLeft}
					</Text>

				</TouchableOpacity>
			);
		}
	}

	renderSearchButton() {
		if (this.props.showSearchButton) {
			return (
				<TouchableOpacity
					onPress={this.searchButtonClicked}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Image
						style={styles.rightImage}
						source={require('../../../images/search.png')}/>

				</TouchableOpacity>
			);
		}
	}

	renderRightText() {
		if (this.props.textOnRight !== null) {
			if(this.props.enableRightText) {
				return (
					<TouchableOpacity
						onPress={this.rightTextOnClick}
						// underlayColor={ColorConstants.title_blue()}
						>

						<Text style={styles.textOnRight}>
							{this.props.textOnRight}
						</Text>

					</TouchableOpacity>
				);
			}
			else {
				return (
					<Text style={[styles.disabledTextOnRight,{color:'#6a9bee'}]}>
						{this.props.textOnRight}
					</Text>
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

			return (
				<TouchableOpacity
					onPress={()=> this.props.rightImageOnClick && this.props.rightImageOnClick()}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Image
						style={imageStyles}
						source={this.props.imageOnRight}/>

				</TouchableOpacity>
			);
		}
	}

	renderSubTitle() {
		if (this.props.subTitle !== null) {
			return (
				<Text style={this.props.subTitleStyle}>
					{this.props.subTitle}
				</Text>
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
	left: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	title: {
		fontSize: 18,
		textAlign: 'center',
		color: '#b7e1f8',
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
		marginRight: 10,
	},
	disabledTextOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#3e86ff',
		marginRight: 10,
	},
});

//make this component available to the app
export default NavBar;
