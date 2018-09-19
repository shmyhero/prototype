import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, StyleSheet, 
    Dimensions, 
    Modal,
    TouchableOpacity,
    Text,
} from 'react-native';
 
const {height, width} = Dimensions.get("window");


/*传入prop view是外部传入的，BottomDialog只负责显示modal从底部弹出
    content={contentView}
    contentHeight={contentHeight}
    contentWidth={width}
    closeModal={()=>{
        console.log('BottomDialog closeModal!')
    }}/>
*/
class BottomDialog extends Component {

    static propTypes = {
         
    };

    static defaultProps = {
         
    }

    constructor(props){
        super(props)

        this.state = {
            isVisible: false,
        };
    }  

    show(){
        console.log('showModal:'+this.state.isVisible)
        this.setState({
            isVisible:true
        })
    }

    closeModal(){
        console.log('closeModal')
        this.setState({
            isVisible:false
        }); 
    }

    renderDialog(){
        return( 
            <View style={styles.modalContainer}>
                <View style={[styles.modalStyle,{top:height-this.props.contentHeight,height:this.props.contentHeight,width:this.props.contentWidth}]}>
                    {this.props.content}
                </View>
            </View> 
        )
    }

    render() { 
        return ( 
            <View style={{flex:1}}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={()=>this.closeModal()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={()=>this.closeModal()}>
                        {this.renderDialog()}
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
}   
 
const styles = StyleSheet.create({
    container: {
        height:height,
        width:width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer:{
        width:width,
        height:height,
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalStyle:{
        position:'absolute', 
        left:0, 
        backgroundColor:'#eaeaea'
    }
});
 
export default BottomDialog;
