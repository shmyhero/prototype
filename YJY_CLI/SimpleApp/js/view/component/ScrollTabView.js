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

var {height, width} = Dimensions.get('window');
 
export default class  ScrollTabView extends React.Component {

	static propTypes = {
		tabNames: PropTypes.array,
		viewPages: PropTypes.any,
		onPageSelected: PropTypes.func,
		tabBgStyle: PropTypes.any,
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
			this.refs.viewPages && this.refs.viewPages.scrollTo({x: index * width, y: 0, animated: false})
		} else {
			this.refs.viewPages && this.refs.viewPages.setPageWithoutAnimation(index)
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
		var tabs = this.props.tabNames.map(
			(tabName, i) =>
			<TouchableHighlight style={[styles.tabItemContainer,
				{width: width / this.props.tabNames.length,
				 paddingBottom: 10,
				}
			]} key={i}
					underlayColor={'#00000000'}
					onPress={() => this.tabClicked(i)}>
 
				<ImageBackground style={{width:80,height:41,alignItems:'center',justifyContent:'center'}} source={this.state.currentSelectedTab == i?(this.props.tabBgStyle==0?require('../../../images/bg_btn_white.png'):require('../../../images/bg_btn_blue.png')):(this.props.tabBgStyle==0?require('../../../images/bg_btn_blue.png'):require('../../../images/bg_btn_white.png'))}>
					<Text style={this.state.currentSelectedTab == i ? (this.props.tabBgStyle==0?styles.tabItemTextSelected:[styles.tabItemTextUnSelected]): (this.props.tabBgStyle==0?[styles.tabItemTextUnSelected]:styles.tabItemTextSelected)}>
						{tabName}
					</Text>
				</ImageBackground> 
			</TouchableHighlight>
		)

		return (
			<View>
				<ScrollView horizontal={true} style={[styles.tabs, {paddingTop:10,backgroundColor: 'transparent'}]}>
					{tabs}
				</ScrollView>
			</View>
		);
	}

	renderSeperate () { 
		var offsetX = width / this.props.tabNames.length * this.state.currentSelectedTab

		return (
			<View style={styles.lineContainer}>

				<View style={[styles.tabItemContainer, {backgroundColor:'#1962dd',height:2,width: width / this.props.tabNames.length, marginLeft: offsetX}]}>

				</View>

			</View>
		);
	}

	renderViewPagers () {
		if (Platform.OS === 'ios') {
			return (
				<ScrollView style={styles.viewPage} ref='viewPages'
						contentContainerStyle={{width: width * this.props.tabNames.length, flex:1}}
						pagingEnabled={true}
						horizontal={true}
						onScroll={(event)=>this.onScroll(event)}
						scrollEventThrottle={10}
						directionalLockEnabled={true} >
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

				{/* {this.renderSeperate()} */}

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
		color: '#279fe8',
		fontSize: 13,
		// fontWeight: 'bold',
		marginBottom:2
	},

	tabItemTextUnSelected: {
		textAlign: 'center',
		fontSize: 13,
		color: 'white',
		marginBottom:2
	},

	lineContainer: {
		alignSelf: 'stretch',
		flexDirection: 'row',
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
