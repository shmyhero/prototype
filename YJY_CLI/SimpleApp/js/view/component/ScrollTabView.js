'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Text,
	Image,
	ScrollView,
	ViewPagerAndroid,
	TouchableHighlight,
	Dimensions,
	ImageBackground,
	Platform,Alert,
} from 'react-native';

var ColorConstants = require('../../ColorConstants')
import CustomStyleText from './CustomStyleText';
var {height, width} = Dimensions.get('window');
 
export default class  ScrollTabView extends React.Component {

	static propTypes = {
		tabNames: PropTypes.array,
		// renderTabView: PropTypes.func,
		viewPages: PropTypes.any,
		onPageSelected: PropTypes.func,
		tabBgStyle:PropTypes.any,
		tabFontSize:PropTypes.any,
	} 

	state = {
		currentSelectedTab : 0,
		skipOnScrollEvent: false,
    }

	constructor(props){
        super() 
	}

	tabClicked (index) {
		if (Platform.OS === 'ios') {
			this.refs.viewPages && this.refs.viewPages.scrollTo({x: index * width, y: 0, animated: true})
		} else {
			this.refs.viewPages && this.refs.viewPages.setPage(index)
		}
		 
		if (index !== this.state.currentSelectedTab) {
			this.setState({
				currentSelectedTab: index,
				skipOnScrollEvent: true,
			})
			this.props.onPageSelected && this.props.onPageSelected(index)
		}
	}

	viewPageScrolled (event) {
		var targetTabPosition = event.nativeEvent.position
		if (this.state.skipOnScrollEvent) {
			if (targetTabPosition == this.state.currentSelectedTab) {
				setTimeout(()=>{
					this.setState({
						skipOnScrollEvent: false,
					})
				}, 500);
				
			}
		}else{			
			if (event.nativeEvent.offset > 0.5) {
				targetTabPosition ++
			} 
	 
			if (targetTabPosition !== this.state.currentSelectedTab) {
				this.setState({
					currentSelectedTab: targetTabPosition
				})
				this.props.onPageSelected && this.props.onPageSelected(targetTabPosition)
			}
		}		
	}

	onScroll (event) {
		var {height, width} = Dimensions.get('window');
		var offsetX = event.nativeEvent.contentOffset.x
		var targetTabPosition = Math.round(offsetX / width)

		if (this.state.skipOnScrollEvent) {
			if (targetTabPosition == this.state.currentSelectedTab) {
				this.setState({
					skipOnScrollEvent: false,
				})
			}
		} else if (targetTabPosition !== this.state.currentSelectedTab){
			this.setState({
				currentSelectedTab: targetTabPosition,
			})
			this.props.onPageSelected && this.props.onPageSelected(targetTabPosition)
		}
	}

  
	renderTabs () { 
		// console.log('renderTabs fontSize = ' + this.props.tabFontSize + "  type="+this.props.tabBgStyle)
		var tabs = this.props.tabNames.map(
			(tabName, i) =>
			<TouchableHighlight style={[styles.tabItemContainer,
				{width: width / this.props.tabNames.length,
				 paddingBottom: 0,
				}
			]} key={i}
					underlayColor={'#00000000'}
					onPress={() => this.tabClicked(i)}>
 
				<View style={{width:80,height:40,alignItems:'center',justifyContent:'center'}}>
					<CustomStyleText style={[this.state.currentSelectedTab==i?styles.tabItemTextSelected:styles.tabItemTextUnSelected,{fontSize:this.props.tabFontSize}]}>
						{tabName}
					</CustomStyleText>
				</View> 
			</TouchableHighlight>
		)

		var bgcolor = this.props.tabBgStyle ==0?'transparent':ColorConstants.BGBLUE;
		return (
			<View>
				<ScrollView horizontal={true} style={[styles.tabs, {paddingTop:10,backgroundColor: bgcolor}]}>
 
					{tabs}
				</ScrollView>
			</View>
		);
	}

	renderSeperate () { 
		var half = (width / this.props.tabNames.length)/2 - 10
		var offsetX = (width / this.props.tabNames.length * this.state.currentSelectedTab)+half
		var imageSource = this.props.tabBgStyle == 0?require('../../../images/icon_control.png'):require('../../../images/icon_control_white.png')
		var lineColor = this.props.tabBgStyle == 0? '#26598e':'white'
		return (
			<View style={styles.lineContainer}>
				<Image style={{width:11.5,height:6.0,marginLeft: offsetX,marginBottom:-0.5,}} source={imageSource}/>
				{/* <View style={[styles.tabItemContainer, {backgroundColor:'#30adf2',height:2,width: width / this.props.tabNames.length, marginLeft: offsetX}]}/> */}
				<View style={[styles.tabItemContainer, {backgroundColor:lineColor,height:1,width: width}]}/>
			</View>
		);
	}

	renderViewPagers () {
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * this.props.tabNames.length}}
						pagingEnabled={true}
						horizontal={true}
						onScroll={(event)=>this.onScroll(event)}
						scrollEventThrottle={10}
						directionalLockEnabled={true} 
						>
					{this.props.viewPages}
				</ScrollView>
			);
		} else {
			return (
				<ViewPagerAndroid style={[styles.viewPage, {flex: 1}]} ref='viewPages'
						onPageScroll={this.viewPageScrolled.bind(this)}>
					{this.props.viewPages}
				</ViewPagerAndroid>
			);
		}
	}

	render () {
		return (
			<View style={[styles.wrapper, {width: width}]}>
				{this.renderTabs()}

				{this.renderSeperate()}

				{this.renderViewPagers()}
			</View>
		)
	}
}

var styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		alignItems: 'stretch',
		alignSelf: 'stretch',
		justifyContent: 'flex-start',
		backgroundColor: 'transparent',
	},

	tabItemContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},

	tabs: {
		flex: 0,
		alignSelf: 'stretch',
	},

	tabItemTextSelected: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		// fontWeight: 'bold',
		marginBottom:2
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
		fontSize: 15,
		color: 'white',
		opacity:0.6,
		marginBottom:2
	},

	lineContainer: {
		justifyContent:'center', 
		backgroundColor:ColorConstants.BGBLUE
	},

	line: {
		alignSelf: 'stretch',
		height: 1,
		borderWidth: 0.5,
		borderColor: '#0f4fba'
	},

	indicator: {
		width: 10,
		height: 5,
		marginTop: -5,
	},

	slide: {
		alignItems: 'stretch',
	},

	viewPage: {
		flex: 1,
	},
});


module.exports = ScrollTabView;
