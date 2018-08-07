//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

// create a component
class FrameAnimationPlayer extends Component {
    static propTypes = {
        frames: PropTypes.arrayOf(PropTypes.number),
        framesPerSeconds: PropTypes.number,
        ...Image.propTypes      
    }

    static defaultProps = {
        frames: [
            require('../../../images/animation/user_page_frames/apngframe01.png'),            
        ],
        framesPerSeconds: 24
    }

    isPlaying = false;

    constructor(props){
        super(props);

        var state = {
            frameIndex: 0,
        }
        if(this.props.frames && this.props.frames.length){
            state.frame = this.props.frames[0];
        }else{
            state.frame = null; 
        }
        this.state = state;
    }

    componentDidMount(){
        
    }

    reset(){
        var frameIndex = 0;
        this.setState({
            frameIndex: frameIndex,
            frame: this.props.frames[frameIndex]
        });
    }

    play(){
        console.log("this.isPlaying", this.isPlaying)
        if(!this.isPlaying){
            this.isPlaying = true;
            this.next();
        }
    }

    next(){
        if(this.props.framesPerSeconds > 0 && this.isPlaying){
            this.timer = setTimeout(() => {
                var frameIndex = this.state.frameIndex+1;
                if(frameIndex < this.props.frames.length){
                    this.setState({
                        frameIndex: frameIndex,
                        frame: this.props.frames[frameIndex]
                    });
                    this.next();
                }else{
                    this.isPlaying = false;
                }
            }, 1000/this.props.framesPerSeconds);
        }
    }

    stop(){
        this.isPlaying = false;
        this.timer && clearTimeout(this.timer)
        this.timer = null;
    }

    render() {
        return (
            <Image {...this.props}
                source={this.state.frame}
            />
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
export default FrameAnimationPlayer;


