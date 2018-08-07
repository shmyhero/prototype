//import liraries
import React, { Component } from 'react';
import { View,
    Text, StyleSheet,
    Animated } from 'react-native';

// create a component
class RankingTitleAnimatedText extends Component {

    isAnimationRunning = false;
    animation = null;
    timer = null;
    changeTextList = ["STOCK", "FOREX", "INDICES", "COMMODITIES"]

    constructor(props){
        super(props)

        this.state = {
            changingText: this.changeTextList[0],
            changingTextIndex: 0,
            changingTextOpacityAnim: new Animated.Value(1)
        }
    }

    start(force){
        if(!this.animation || force){
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(()=>{
                this.timer && clearTimeout(this.timer);
                this.animation = Animated.timing(
                    this.state.changingTextOpacityAnim,
                    {
                        toValue: 0,
                        duration: 200,
                    }
                )
                this.animation.start(()=>{
                    this.animation && this.animation.stop();
                    var changingTextIndex = this.state.changingTextIndex + 1;
                    if(changingTextIndex >= this.changeTextList.length){
                        changingTextIndex = 0;
                    }
                    this.setState({
                        changingText: this.changeTextList[changingTextIndex],
                        changingTextIndex: changingTextIndex,
                    }, ()=>{
                        this.animation = Animated.timing( 
                            this.state.changingTextOpacityAnim,
                            {
                                toValue: 1, 
                                duration: 200,
                            }
                        )
                        this.animation.start(()=>{
                            this.animation && this.animation.stop();
                            this.start(true);
                        })
                    })
                });
            }, 2000);            
        }        
    }

    stop(){
        this.animation && this.animation.stop()
        this.animation = null;
        this.timer && clearTimeout(this.timer);
        this.timer = null;
    }

    render() {
        return (
            <View {...this.props}>
                <Text style={{                   
                    fontFamily: "Abolition",
                    //fontWeight: 'bold',   //RN 0.55.3 has a bug. If set this, fontFamily won't work.
                    fontSize: 30,
                    textAlign: "left",
                    color: "white",
                    }}>
                    <Text>
                        {"TRADE" + " "}
                    </Text>
                    <Animated.Text style={{opacity:this.state.changingTextOpacityAnim}}>
                        {this.state.changingText}
                    </Animated.Text>
                    <Text>
                        {"\nWITH CRYPTO"}
                    </Text>
                </Text>
            </View>
        );
    }
}

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
export default RankingTitleAnimatedText;
