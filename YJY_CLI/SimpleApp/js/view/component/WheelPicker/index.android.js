'use strict';

import React from 'react';
import PropTypes from 'prop-types'
import {
	View,
	ColorPropType,
	requireNativeComponent,
} from 'react-native';

const WheelCurvedPickerNativeInterface = {
	name: 'WheelPicker',
	propTypes: {
		...View.propTypes,
		data: PropTypes.array,
		textColor: ColorPropType,
		textSize: PropTypes.number,
		selectedTextColor: ColorPropType,
		itemStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		onValueChange: PropTypes.func,
		selectedValue: PropTypes.any,
		selectedIndex: PropTypes.number,
	}
}

const WheelCurvedPickerNative = requireNativeComponent('WheelPicker', WheelCurvedPickerNativeInterface);

class WheelPicker extends React.Component {

	static propTypes = {
		...View.propTypes,
		data: PropTypes.array,
		textColor: ColorPropType,
		textSize: PropTypes.number,
		selectedTextColor: ColorPropType,
		itemStyle: PropTypes.object,
		itemSpace: PropTypes.number,
		onValueChange: PropTypes.func,
		selectedValue: PropTypes.any,
		selectedIndex: PropTypes.number,
	}

	constructor(props){
		super(props)
		this.state = this._stateFromProps(props)
	}

	static defaultProps = {
		itemStyle : {color:"white", fontSize:26},
		itemSpace: 20
	}

	componentWillReceiveProps (props) {
		this.setState(this._stateFromProps(props));
	}

	_stateFromProps (props) {
		var selectedIndex = 0;
		var items = [];
		React.Children.forEach(props.children, function (child, index) {
			if (child.props.value === props.selectedValue) {
				selectedIndex = index;
			}
			items.push({value: child.props.value, label: child.props.label});
		});

		var textSize = props.itemStyle.fontSize
		var textColor = props.itemStyle.color
		var selectedTextColor = props.selectedTextColor;

		return {selectedIndex, items, textSize, textColor, selectedTextColor};
	}

	_onValueChange = (e) => {
		if (this.props.onValueChange) {
			this.props.onValueChange(e.nativeEvent.data);
		}
	}

	render() {
		return <WheelCurvedPickerNative
				{...this.props}
				onValueChange={this._onValueChange}
				data={this.state.items}
				textColor={this.state.textColor}
				textSize={this.state.textSize}
				selectedTextColor={this.state.selectedTextColor}
				selectedIndex={parseInt(this.state.selectedIndex)} />;
	}
}

class Item extends React.Component {
	static propTypes = {
		value: PropTypes.any, // string or integer basically
		label: PropTypes.string,
	}

	render () {
		// These items don't get rendered directly.
		return null;
	}
}

WheelPicker.Item = Item;

module.exports = WheelPicker;
