'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	Animated,
	Dimensions,
	PanResponder,
	Modal,
    TouchableOpacity,
	Platform,
} from 'react-native';

var merge = require('merge');
var ColorConstants = require('../ColorConstants')
var UIConstants = require('../UIConstants');
var NetworkModule = require('../module/NetworkModule');
var StockOrderInfoBar = require('./StockOrderInfoBar')
var {height, width} = Dimensions.get('window');
import {ViewKeys} from '../../AppNavigatorConfiguration';

const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_TOP_MARGIN = 0;
const BODY_BOTTOM_MARGIN = 30;
const CONTENT_WIDTH = width - BODY_HORIZON_MARGIN * 2 - 2 - BODY_BOTTOM_MARGIN * 2;

// create a component
class StockOrderInfoModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            modalVisible: false,
            orderData: null,
        };
    }

    show(orderData, callback) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
		};
		if (orderData !== null) {
			state.orderData = orderData;
		}
		this.setState(state);
	}

	hide() {
		this.setState({
			modalVisible: false,
		});
		this.state.hideCallback && this.state.hideCallback();
	}

	onContainerPress(){
		this.props.onContainerPress && this.props.onContainerPress();
	}


	_setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

	renderContent(){
		return (
            <StockOrderInfoBar 
                orderData={this.state.orderData}				
                width={CONTENT_WIDTH}
                bigMargin={false}/>
        );
	}

    render() {
        return (        
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                animationType={"slide"}
                style={{height: height, width: width}}
                onRequestClose={() => {this._setModalVisible(false)}}>
                    <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={()=>this.hide()}>
                        <View style={styles.modalContainer}>
                            <TouchableOpacity onPress={()=>this.onContainerPress()}>
                                {this.renderContent()}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
            </Modal>
		);
    }
}

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},

    modalBackground: {
        width:width,
        height:height,
		backgroundColor:'rgba(0, 0, 0, 0.7)',
    },

	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: height + (Platform.OS === 'android' ? 20 : 0),
		width: width,
	},
});


export default StockOrderInfoModal;
