//import liraries
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet,
    Animated,
    Dimensions,
    Easing,
    TouchableOpacity
} from 'react-native';

const {height, width} = Dimensions.get("window");
// create a component

class FallingCoin extends Component {
    static propTypes = {
        size: PropTypes.number,
        left: PropTypes.number,
        timeout: PropTypes.number,
    };

    static defaultProps = {
        size: 50,
        left: width/2,
        timeout: 10,
    }

    constructor(props){
        super(props)

        this.state = {
            position: new Animated.Value(-this.props.size),
            rotateY: new Animated.Value(0)
        };
    }

    reset(){
        Animated.parallel([
            Animated.timing(this.state.position, {
                toValue: -this.props.size, // return to start
                duration:0
            }),
            Animated.timing(this.state.rotateY, {
                toValue: 0,
                duration:0
            }),
        ]).start()
    }

    start(){
        setTimeout(() => {            
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.position, {
                        toValue: height - this.props.size, // return to start
                        easing: Easing.bounce,
                        duration:1200
                    }),
                    Animated.timing(this.state.rotateY, {
                        // and twirl
                        toValue: 1,
                        duration:1000
                    }),
                ])
            ]).start()
        }, this.props.timeout);
    }

    render() {
        var rotateProp = this.state.rotateY.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"]
        })
        return (
            <Animated.Image source={require("../../../images/coin.png")}
                style={{position:'absolute', 
                    top: this.state.position, 
                    left: this.props.left, 
                    transform: [                   
                        {rotateY: rotateProp},
                    ],
                    height:this.props.size,
                    width:this.props.size}}/>
        );
    }
}

class AnimatedCoinView extends Component {

    coinCount = 20;

    
    static propTypes = {
        onAnimationFinished: PropTypes.func,
    };

    static defaultProps = {
        onAnimationFinished: ()=>{},
    }

    constructor(props){
        super(props)

        this.state = {
            opacity: new Animated.Value(1),
        }

        this.coinList = this._generateCoin();
    }

    componentDidMount(){
        this.start();
    }

    _regenerate(){
        this.coinList = this._generateCoin();
    }

    start(){
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration:0
        }).start()    
        for(var i = 0; i < this.coinCount; i ++){
            this["coin"+i].reset();
            this["coin"+i].start();
        }
        setTimeout(()=>{
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration:500
            }).start(()=>{
                this.props.onAnimationFinished && this.props.onAnimationFinished();
            })
        }, 2000);
    }

    _generateCoin(){
        var viewIterable = {};
        viewIterable[Symbol.iterator] = function* () {
            for(var i = 0; i < this.coinCount; i ++){
                //Avoid Index error
                var that = this;
                const index = i;
                const size =(Math.random() * 50) + 20;
                const left =(Math.random() * (width - size));
                const timeout =(Math.random() * 500);
                yield (<FallingCoin key={index} ref={(ref)=>{
                    that["coin"+index] = ref
                }} size={size} left={left} timeout={timeout}/>)
            }
        }.bind(this);

        var viewList = [...viewIterable];
        return viewList;
    }

    render() {
        return (
            // <View style={[this.props.style, styles.container]}>
                <Animated.View style={[this.props.style, styles.container, {opacity: this.state.opacity}]} >
                    {this.coinList}               
                </Animated.View>
            //  <TouchableOpacity onPress={()=>{this.start()}} style={{height:50}}>
            //         <Text>start</Text>
            //     </TouchableOpacity>
            //     <TouchableOpacity onPress={()=>{this._regenerate()}} style={{height:50}}>
            //         <Text>gen</Text>
            //     </TouchableOpacity>
            // </View>
            //}
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height:height,
        width:width,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

//make this component available to the app
export default AnimatedCoinView;
