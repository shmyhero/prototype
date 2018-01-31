
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PropTypes,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ListView,
  Alert,
} from 'react-native'; 
 
var {height, width} = Dimensions.get('window');
 
var listData = [ 
    {userName:'复兴一号',winRate:'90%',ProfitRate:'197.25%'},
    {userName:'Golden',winRate:'83%',ProfitRate:'84.72%'},
    {userName:'精准出击',winRate:'64%',ProfitRate:'67.89%'},
    {userName:'随心',winRate:'58%',ProfitRate:'50.1%'},
    {userName:'你若努力',winRate:'57%',ProfitRate:'48.1%'},
    {userName:'晴天',winRate:'56%',ProfitRate:'46.1%'},
    {userName:'一缕阳光',winRate:'55%',ProfitRate:'44.1%'},
    {userName:'匿名7',winRate:'54%',ProfitRate:'42.1%'},
    {userName:'匿名8',winRate:'53%',ProfitRate:'40.1%'},
    {userName:'匿名9',winRate:'52%',ProfitRate:'38.1%'},
    {userName:'匿名10',winRate:'51%',ProfitRate:'36.1%'},
    {userName:'匿名11',winRate:'50%',ProfitRate:'34.1%'},
    {userName:'匿名12',winRate:'49%',ProfitRate:'32.1%'},
    {userName:'匿名13',winRate:'48%',ProfitRate:'30.1%'},
    {userName:'匿名14',winRate:'47%',ProfitRate:'28.1%'},
    {userName:'匿名15',winRate:'46%',ProfitRate:'26.1%'},
    {userName:'匿名16',winRate:'45%',ProfitRate:'24.1%'}
]
export default class  RankHeroList extends React.Component {

    static defaultProps = {
         
    }

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(listData),
        };
    }

    componentDidMount () {
         
    }

    componentWillUnmount() {
        
    }
   

    gotoUserProfile(){
        this.props.navigation.navigate('UserProfileScreen',{userId:'001'})
    }

    renderMe(){
        return(
            <TouchableOpacity onPress={()=>this.gotoUserProfile()}>
                <ImageBackground style={{height:86,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}} source={require('../../images/rank_bg_me.png')}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{height:48,width:48,marginLeft:28,marginBottom:5}} source={require('../../images/head_portrait.png')}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={{color:'white'}}>我的</Text>
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <Text style={{color:'white'}}>胜率：</Text>
                                <Text style={{color:'white'}}>76%</Text>
                            </View>
                        </View>
                    </View>     
                    <View style={{marginRight:30}}>
                        <Text style={{color:'red'}}>+52.13%</Text>
                    </View> 
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    renderThreeHero(){
        rate = width/345*0.75;
        return(
            <View>
                <ImageBackground style={styles.containerAll} source={require('../../images/rank_bg_all.png')}>
                    <View style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{listData[1].userName}</Text>
                        <Text style={styles.textTopUserScore}>胜率:{listData[1].winRate}</Text>
                        <ImageBackground style={{height:85*rate,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_ag.png')}>
                            <Text style={styles.textProfit}>+{listData[1].ProfitRate}</Text>
                        </ImageBackground>
                    </View>
                    <View style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{listData[0].userName}</Text>
                        <Text style={styles.textTopUserScore}>胜率:{listData[0].winRate}</Text>
                        <ImageBackground style={{height:99*rate ,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_gd.png')}>
                            <Text style={styles.textProfit}>+{listData[0].ProfitRate}</Text>
                        </ImageBackground>  
                    </View>
                    <View style={{flex:1}}>
                        <Image style={styles.headPortrait} source={require('../../images/head_portrait.png')}></Image>
                        <Text style={styles.textTopUserName}>{listData[2].userName}</Text>
                        <Text style={styles.textTopUserScore}>胜率:{listData[2].winRate}</Text>
                        <ImageBackground style={{height:85*rate ,justifyContent:'center',alignItems:'center'}} source={require('../../images/rank_bg_cu.png')}>
                            <Text style={styles.textProfit}>+{listData[2].ProfitRate}</Text>
                        </ImageBackground>  
                    </View> 
                </ImageBackground>
            </View>
        )
    }


    _renderRow = (rowData, sectionID, rowID) => {
        if(rowID>=3){
            return( 
                <View style={{height:68,width:width,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{height:48,width:48,marginLeft:28,marginBottom:5}} source={require('../../images/head_portrait.png')}></Image>
                        <View style={{marginLeft:10}}>
                            <Text style={{color:'grey'}}>{rowData.userName}</Text>
                            <View style={{flexDirection:'row',marginBottom:5}}>
                                <Text style={{color:'grey'}}>胜率：</Text>
                                <Text style={{color:'grey'}}>{rowData.winRate}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginRight:30}}>
                        <Text style={{color:'red'}}>{rowData.ProfitRate}</Text>
                    </View> 
                </View>
            )
        }else{
            return null
        }
        
    }

    renderFooter(){

    }

    renderSeparator(){

    }

    renderListAll(){
        return(
            <View style={{flex:1,width:width,backgroundColor:'white'}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </View>
        )
    }
    render() {
        return (
            <View style={{flex:1}}>
                 {this.renderMe()}
                 {this.renderThreeHero()}
                 {this.renderListAll()}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    list: {
		flex: 1, 
	},
    containerAll:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end', 
        height:188,
        width:width,
        paddingLeft:20,
        paddingRight:20,
    },
    headPortrait:{
        width:48,
        height:48,
        alignSelf:'center'
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:'white',
        fontSize:12,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'white',
        fontSize:12,
    },
    textProfit:{
        color:'white'
    }
})



module.exports = RankHeroList;



