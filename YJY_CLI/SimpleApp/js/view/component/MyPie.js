
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PropTypes,
} from 'react-native';
import Pie from 'react-native-pie'


export default class  MyPie extends React.Component {



    static defaultProps = {
        radius:100,
        innerRadius:0,
        series:[10, 20, 30, 40],
        colors:['red', 'lime', 'blue', 'yellow'],
        innerText:'',
    }

    render() {
        radius = this.props.radius;
        innerRadius = this.props.innerRadius||0;
        series = this.props.series;
        colors = this.props.colors;
        innerText = this.props.innerText;

        length = series.length;
        sum = 0;
        for(i = 0;i<length;i++){
            sum += series[i];
        }

        for(j = 0;j<length;j++){
            series[j] = series[j]/sum*100;
        }


        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Pie
                        radius={radius}
                        innerRadius={innerRadius}
                        series={series}
                        colors={colors}
                    >
                    </Pie>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style = {{color:'white',height:radius*2,fontSize:12,marginBottom:12,}}>{innerText}</Text>
                    </View>
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



