'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Modal,
    TouchableOpacity,
	Platform,
	Image,
	Easing,
} from 'react-native';

var StockOrderInfoBar = require('./StockOrderInfoBar')
var {height, width} = Dimensions.get('screen');
import AnimatedView from './component/AnimatedView';
//import AnimatedCoinView from './component/AnimatedCoinView';

var UIConstants = require('../UIConstants');
const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_BOTTOM_MARGIN = 30;
const CONTENT_WIDTH = width - BODY_HORIZON_MARGIN * 2 - 2 - BODY_BOTTOM_MARGIN * 2;


/*下单完成后弹出的 下单详情框*/ 
// create a component
class StockOrderInfoModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            modalVisible: false,
			orderData: null,
			showCoinView: false,
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
		this.setState(state, ()=>{
			this.fadeViewRef && this.fadeViewRef.fadeIn(300);
			this.heroAnimatedViewRef && this.heroAnimatedViewRef.slideUp(500);
			this.slideUpRef && this.slideUpRef.slideUp(500, Easing.ease);
			setTimeout(()=>{
				this.strideAnimatedViewRef && this.strideAnimatedViewRef.fadeOut(300);
			},200)
			setTimeout(()=>{
				this.heroAnimatedViewRef && this.heroAnimatedViewRef.fadeOut(500);
			}, 500);
		
		});
	}

	hide() {
		this.state.hideCallback && this.state.hideCallback();
		this.setState({
			modalVisible: false,
		});
	}

	onContainerPress(){
		this.props.onContainerPress && this.props.onContainerPress();
	}


	_setModalVisible(visible) {
        this.setState({modalVisible: visible});
	}
	
	renderHero(){
		return (
			<AnimatedView transformY={height/2} 
				ref={(ref)=> this.heroAnimatedViewRef = ref}
				style={{position:'absolute', top:0,left:0,right:0, 
					flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
				<Image source={require("../../images/hero.png")} 
					resizeMode={"contain"}
					style={{width: width/12, marginTop:30}}/>

				<AnimatedView 
					ref={(ref)=> this.strideAnimatedViewRef = ref}
					style={{position:'absolute', top:0,left:0,right:0, 
						flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
					<Image source={require("../../images/light.png")}
						resizeMode={"contain"}
						style={{
							position:'absolute', 
							top:0,
							bottom:0,
							left:0,
							right:0,
							width: width,
							marginTop: height/3,
							height: height/3*2
						}}/>
				</AnimatedView>
			</AnimatedView>
		)
	}

	renderDialog(){
		return(
			<AnimatedView 
				opacity={0} 
				style={{backgroundColor:'rgba(0, 0, 0, 0.7)', width: width, height: height}}
				ref={(ref)=> this.fadeViewRef = ref}>
				<TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={()=>this.hide()}>						
					{this.renderHero()}
					<AnimatedView style={{flex:1, width: width}}
						transformY={height / 2}
						ref={(ref)=> this.slideUpRef = ref}>
						<View style={styles.modalBackground} activeOpacity={1} onPress={()=>this.hide()}>						
							<View style={styles.modalContainer}>							
								<TouchableOpacity onPress={()=>this.onContainerPress()}>
									{this.renderContent()}
								</TouchableOpacity>
								{/* {this.renderCoinView()} */}
							</View>
						</View>
					</AnimatedView>
				</TouchableOpacity>
			</AnimatedView>
		)
	}

	// renderCoinView(){
    //     if(this.state.showCoinView){
	// 		console.log("renderCoinView")
	// 		return (
	// 			<AnimatedCoinView 
	// 				style={{position:'absolute', top:0, left:0, right:0, bottom:0}}
    //             	onAnimationFinished={()=>{
    //                 	console.log("renderCoinView onAnimationFinished")
    //                 	this.setState({
    //                     	showCoinView:false,
	//                     })
	// 				}}
	// 				contentHeight={height - UIConstants.STATUS_BAR_ACTUAL_HEIGHT}
	// 			/>);
	// 	}
    // }

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
                style={{height: height, width: width}}
                onRequestClose={() => {this._setModalVisible(false)}}>
				{this.state.modalVisible ? this.renderDialog() : null}
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
