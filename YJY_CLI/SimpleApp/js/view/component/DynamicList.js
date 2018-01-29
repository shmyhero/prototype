
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PropTypes,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';






export default class DynamicList extends React.Component {



    static defaultProps = {

    }

    constructor(){
        super();
        const listRawData = [
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元突破1350美元，现报1305。41美元突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
            {time:'15:30',text:'【商品】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'12:30',text:'【外汇】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'11:20',text:'【指数】现货黄金突破1350美元，现报1305。41美元。'},
            {time:'09:15',text:'王思聪：今天买什么？我账上2亿现金趴着呢'},
        ]
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state={
            dataSource:ds.cloneWithRows(listRawData)
        }
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'black'}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData)=>this.renderRow(rowData)}
                />
            </View>
        );
    }



    renderRow(rowData) {
        return(
            <View style={styles.lineStyle}>
                <Text style={styles.textTime}>{rowData.time}</Text>
                <View style={styles.vContainer}>
                    <View style={styles.vLine}></View>
                </View>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{color:'white',fontSize:10,width:300}}>{rowData.text}</Text>
            </View>

        )
    }

}


const styles = StyleSheet.create({
    lineStyle:{
        flexDirection:'row',
        height:26,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    textTime:{
        color:'green',
        fontSize:10,

    },
    vContainer:{
        width:12,
        height:24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vLine:{
        width:1,
        height:24,
        backgroundColor:'blue'
    },
  })



module.exports = DynamicList;



