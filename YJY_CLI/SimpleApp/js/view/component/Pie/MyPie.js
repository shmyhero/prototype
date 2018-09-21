
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';
import Pie from './Pie';
import CustomStyleText from '../CustomStyleText';

export default class  MyPie extends React.Component {

    static propTypes={
        radius: PropTypes.number,
        innerRadius: PropTypes.number,
        series: PropTypes.array,
        colors:  PropTypes.array,
        innerText:  PropTypes.string,
        innerText2: PropTypes.string,
        series2: PropTypes.array,
        colors2:  PropTypes.array, 
    }

    static defaultProps = {
        radius:100,
        innerRadius:0,
        series:[10, 20, 30, 40],
        colors:['red', 'lime', 'blue', 'yellow'],
        series2:[10, 20, 30, 40],
        colors2:['red', 'lime', 'blue', 'yellow'],
        innerText:'',
    }

    render() {

        
        var radius = this.props.radius;
        var innerRadius = this.props.innerRadius||0;
        var series = this.props.series;
        var colors = this.props.colors;
        var series2 = this.props.series2;
        var colors2 = this.props.colors2;
        var innerText = this.props.innerText; 
      
        var length = series.length;
        var sum = 0;
        
        for(k=0;k<series.length;k++){
            if(series[k] == 0){series[k] =0.01}
            if(series2[k] == 0){series2[k] =0.01}
        }

        for(i = 0;i<length;i++){ 
            sum += series[i];
        } 

        for(j = 0;j<length;j++){ 
            series[j] = series[j]/sum*100; 
        }

        var length2 = series2.length;
        var sum2 = 0;
        for(i = 0;i<length2;i++){
            sum2 += series2[i];
        }

        for(j = 0;j<length2;j++){
            series2[j] = series2[j]/sum2*100;
        }

        var topFontSize = 36;
        var topOffSet = radius - topFontSize;
         
        console.log("series:"+series);

        return (
            <View style={{justifyContent:'center',alignItems:'center'}} >
                    <View>
                        <Pie 
                            radius={radius}
                            innerRadius={innerRadius}
                            series={series}
                            colors={colors} 
                            series2={series2}
                            colors2={colors2}   
                        />  
                    </View> 
                    <CustomStyleText style={{color:'white',fontSize:topFontSize, position:'absolute',top:topOffSet,fontWeight:'bold'}}>{this.props.innerText}</CustomStyleText>
                    <CustomStyleText style={{color:'#FFFFFF', fontSize:15,position:'absolute',top:radius}}>{this.props.innerText2}</CustomStyleText>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
        gauge: {
        position: 'absolute',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
        gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24,
    },
        innerText:{
        color:'white',
        textAlign:'center',
        
    },
})



module.exports = MyPie;



