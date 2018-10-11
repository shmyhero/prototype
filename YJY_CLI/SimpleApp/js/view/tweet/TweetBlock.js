//import liraries
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, 
    TouchableOpacity
} from 'react-native';
import CustomStyleText from '../component/CustomStyleText'
var TweetParser = require("./TweetParser")
var ColorConstants = require("../../ColorConstants")
// create a component
class TweetBlock extends Component {
    static propTypes = {
        value: PropTypes.string,
        style: Text.propTypes.style,
        onBlockPressed: PropTypes.func,
    }
    
    static defaultProps = {
        value:'',
        style: {},
        onBlockPressed: (name, stockID)=>{},
        
    }

    constructor(props){
        super(props)

        var textNodes = TweetParser.parseTextNodes(this.props.value);
        this.state = {
            textNodes: textNodes,
            maxLine:3,
        };
    }

    componentWillReceiveProps(props){
        if(props.value != this.props.value){
            var textNodes = TweetParser.parseTextNodes(props.value);
            this.setState({
                textNodes: textNodes
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        //For better performance
        if(nextProps != this.props){
            return true;
        }else{
            if(this.state.textNodes != nextState.textNodes
            ||this.state.maxLine != nextState.maxLine){
                return true;
            }
        }
        return false;
    }

    render() {
        var fontSize = 15;
        if(this.props.style && this.props.style.fontSize){
            fontSize = this.props.style.fontSize
        }
        var parsedListView = this.state.textNodes.map((node, index, array)=>{
            if(node.type == "text"){
                return (<CustomStyleText key={index}
                        style={[styles.textPart, {fontSize:fontSize}]}>
                        {node.text}
                    </CustomStyleText>);
            }else if(node.type == "link"){
                return (<Text key={index}
                        onPress={()=>{
                            var name = node.text.substring(1);
                            var stockID = node.id;
                            this.props.onBlockPressed(name, stockID);
                        }}
                        style={[styles.linkedPart, {fontSize:fontSize}]}>
                        {node.text}
                    </Text>
                )
            }
        });

        return (     
            <TouchableOpacity onPress={()=>this.onPressed()}>      
                <Text style={[styles.container, this.props.style]} numberOfLines={this.state.maxLine}>
                    {parsedListView}
                </Text>
            </TouchableOpacity>
        );
    }


    onPressed(){
        this.setState({
            maxLine:this.state.maxLine==3?99:3
        })
    }
}

// define your styles
const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },

    textPart:{
        fontSize: 15,
    },

    linkedPart:{
        color:'#5DC5D2',
        fontSize: 30,
    }
});

//make this component available to the app
export default TweetBlock;
