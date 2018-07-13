import React, { Component } from 'react';
import { 
  Text, 
  View,
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ListView
} from 'react-native'; 
import NavBar from './component/NavBar';
var StorageModule = require('./../module/StorageModule');
var LS = require("../LS");
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0 
import LogicData from '../LogicData';
var ColorConstants = require('../ColorConstants')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var COUNTRYCODE = [
    {name:'中国',nameE:'China',code:'86'},
    {name:'香港地区',nameE:'Hong Kong',code:'00852'},
    {name:'台湾地区',nameE:'Taiwan',code:'00886'},
    {name:'澳门地区',nameE:'MACAU',code:'00853'},
    {name:'新加坡',nameE:'Singapore',code:'0065'},
    {name:'日本',nameE:'Japan',code:'0081'},
    {name:'韩国',nameE:'Korea',code:'0082'},
    {name:'菲律宾',nameE:'Philippines',code:'0063'},
    {name:'英国',nameE:'England',code:'0044'},
    {name:'法国',nameE:'France',code:'0033'},
    {name:'美国',nameE:'America',code:'001'},
    {name:'意大利',nameE:'Italy',code:'0039'},
    {name:'澳大利亚',nameE:'Australia',code:'0061'},
    {name:'巴西',nameE:'Brazil',code:'0055'},
    {name:'德国',nameE:'Germany',code:'0049'},
    {name:'俄罗斯',nameE:'Russia',code:'007'},  
    {name:'加拿大',nameE:'Canada',code:'001'},
    {name:'柬埔寨',nameE:'Cambodia',code:'00855'},
    {name:'老挝',nameE:'Laos',code:'00856'},
    {name:'马来西亚',nameE:'Malaysia',code:'0060'}, 
    {name:'缅甸',nameE:'Burma',code:'0095'},  
    {name:'印度',nameE:'India',code:'0091'},
    {name:'印尼',nameE:'Indonesia',code:'0062'}, 
    {name:'越南',nameE:'Vietnam',code:'0084'}, 
]
    
 

export default class GetCountryCodeScreen extends Component {
    constructor(props){
        super(props); 
        this.state = {
            dataSource: ds.cloneWithRows(COUNTRYCODE),
        }; 
    }  

    onCompleted(code){
        this.props.navigation.goBack();
        if(this.props.navigation.state.params.onGoBack){
            this.props.navigation.state.params.onGoBack(code);
        } 

        StorageModule.setCountryCoda(code)
    }

    renderRow(rowData, sectionID, rowID){
		var countryName = LogicData.getLanguage() == 'zh-cn'?rowData.name:rowData.nameE;
		return(
			<TouchableOpacity onPress={()=>this.onCompleted(rowData.code)} style={{flexDirection:'row',justifyContent: 'space-between',height:48,alignItems:'center',paddingLeft:10,paddingRight:10}}>
                <Text style={{fontSize:15}}>{countryName}</Text>
                <Text style={{fontSize:15,color:'#6693c2'}}>{rowData.code}</Text>
			</TouchableOpacity>
			
		) 
    }
    
    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
      
        if(rowID>=4){
            return (
                <View style={styles.line} key={rowID}>
                    <View style={styles.separator}>
                        {/* <View style={styles.separatorShort}/> */}
                    </View>
                </View>
            );
        }else{
            return null;
        }
		
    }


    render() {
        return( 
            <View style={styles.container}>
                <NavBar 
                title={LS.str("SELECT_COUNTRY_CODE")} 
                showBackButton={true}  
                navigation={this.props.navigation}/>
                <ListView 
					style={styles.list}
					dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)} 
					renderSeparator={this.renderSeparator} /> 
            </View>
            
        )
    } 
}

const styles = StyleSheet.create({
    container:{
       flex:1,  
       backgroundColor: 'white'
    },
    separator: {
        marginLeft: 10,
        marginRight:10,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    }, 
})

module.exports = GetCountryCodeScreen;
