//import liraries
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, 
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';

// create a component
class JumpBeanText extends PureComponent {
    static propTypes = {
        text: PropTypes.string,
        jumpDistance: PropTypes.number,
        textStyle: Text.propTypes.style,
    }

    static defaultProps = {
        text: "Please wait...",
        jumpDistance: 10,
        textStyle: {fontSize:20},
    }

    constructor(props){
        super(props)

        console.log("Text.propTypes", Text.propTypes)
        console.log("Text.propTypes.style", Text.propTypes.style)

        this.state = this.generateState(this.props);
    }

    componentWillReceiveProps(newProps){
        if(newProps && newProps.text != this.props.text){
            var state = this.generateState(newProps);
            this.setState(state);
        }
    }

    componentWillUnmount(){
        this.stop();
    }

    generateState(props){
        var state = {charArray: []};
        for(var i = 0; i < props.text.length; i++) {
            state.charArray.push(props.text.charAt(i));
            state["transformY"+i] = new Animated.Value(0);
        }
        return state;
    }

    generateAnimation(toValue, duration, staggerDuration){
        var upAnimation = [];
        for(var i = 0; i < this.state.charArray.length; i++){
            upAnimation.push(Animated.timing(
                this.state["transformY"+(i)],
                {
                    toValue: toValue,
                    duration: duration,
                    easing: Easing.sin,
                }
            ));
        }
        var staggerAnimated = Animated.stagger(staggerDuration,
            upAnimation
        );
        return staggerAnimated
    }

    start(force) {
        if(!this.startAnimation || force){
            this.startAnimation = true
            var animationDuration = 300;
            var staggerDuration = 100;            
            this.upAnimation = this.generateAnimation(1, animationDuration, staggerDuration);
            this.upAnimation.start();
            setTimeout(()=>{
                this.downAnimation = this.generateAnimation(0, animationDuration, staggerDuration);
                this.downAnimation.start(()=>{
                    setTimeout(()=>{
                        if(this.startAnimation){
                            this.start(true)
                        }
                    }, 1000);
                });
            },animationDuration+50);
        }
    }

    startAnimation = false;

    stop(){
        this.startAnimation = false;
    }

    render() {
        var interpolation = {inputRange: [0, 1], outputRange: [0, -this.props.jumpDistance]}

        var view = this.state.charArray.map((char, index, array)=>{
            return <Animated.Text 
                key={index}
                style={[{
                    transform:[{translateY: this.state["transformY"+index].interpolate(interpolation)}],
                    fontSize:20,
                },
                this.props.textStyle]}>{char}</Animated.Text>
        })

        return (
            <View style={styles.container}>                
                {view}
                {/* <TouchableOpacity style={styles.touchStyle} onPress={()=>this.start()}>
                    <Text style={{width:200,height:100,textAlign:'center',lineHeight:100}}>点击开始动画</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchStyle} onPress={this.stop.bind(this)}>
                    <Text style={{width:200,height:100,textAlign:'center',lineHeight:100}}>点击停止动画</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        // height:100,
        // width:500,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default JumpBeanText;
