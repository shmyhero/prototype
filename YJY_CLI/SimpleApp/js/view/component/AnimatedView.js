//import liraries
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet,Animated, Dimensions } from 'react-native';
var {height, width} = Dimensions.get("window");
// create a component

class AnimatedView extends React.Component {
    static propTypes = {
        opacity: PropTypes.number,
        transformY: PropTypes.number,
    };

    static defaultProps = {
        opacity: 1,
        transformY: 0,
    }

    constructor(props){
        super(props)

        this.state = {
            fadeAnim: new Animated.Value(props.opacity),  // Initial value for opacity: 0
            transformAnim: new Animated.Value(props.transformY),  // Initial value for opacity: 0
        }  
    }

    fadeIn(duration){
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: duration,              // Make it take a while
            }
        ).start();
    }
  
    fadeOut(duration, onFinish){
        if(onFinish){
            var callbackId = this.state.fadeAnim.addListener(()=>{
                if(this.state.fadeAnim._value == 0){
                    this.state.fadeAnim.removeListener(callbackId)
                    onFinish();
                }
            })
        }
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 0,                   // Animate to opacity: 1 (opaque)
                duration: duration,              // Make it take a while
            }
        ).start();
    }

    slideUp(duration, easing){
        console.log("slideUp")
        console.log("duration: ", duration)
        var animationSetting = {
            toValue: 0,                   // Animate to opacity: 1 (opaque)
            duration: duration,              // Make it take a while
        }
        if(easing){
            animationSetting.easing = easing;
        }

        Animated.timing(this.state.transformAnim, animationSetting).start();
    }

    slideDown(){
        Animated.timing(                  // Animate over time
            this.state.transformAnim,            // The animated value to drive
            {
                toValue: height,                   // Animate to opacity: 1 (opaque)
                duration: duration,              // Make it take a while
            }
        ).start();
    }

    render() {
        let { fadeAnim } = this.state;
    
        return (
            <Animated.View                 // Special animatable View
                style={{
                    ...this.props.style,
                    opacity: fadeAnim,         // Bind opacity to animated value
                    transform: [{
                        translateY: this.state.transformAnim,
                    }],
                }}>
            {this.props.children}
            </Animated.View>
        );
    }
}
  
// You can then use your `FadeInView` in place of a `View` in your components:

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default AnimatedView;

