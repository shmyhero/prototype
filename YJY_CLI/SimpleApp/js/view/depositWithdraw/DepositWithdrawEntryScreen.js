//import liraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Dimensions,
	TextInput,
	Switch,
	UIManager,
	Image,
	ListView,
  	TouchableOpacity,
	//BackAndroid,
	ScrollView,
} from 'react-native';
import CustomStyleText from '../component/CustomStyleText';
import { connect } from 'react-redux';
var NetworkModule = require('../../module/NetworkModule')
var ColorConstants = require('../../ColorConstants')
import NavBar from '../component/NavBar'
var NetConstants = require('../../NetConstants')
import LogicData from '../../LogicData'
var UIConstants = require('../../UIConstants');
import ViewKeys from '../../ViewKeys';
import BalanceBlock from '../component/BalanceBlock';

import { fetchBalanceData } from "../../redux/actions/balance";
var {height, width} = Dimensions.get('window')
var heightRate = height/667.0
var LS = require('../../LS')
var listRawData = [
    {'type':'header'},
    {'type':'depositwithdraw','title':'ME_DEPOSIT_TITLE', 'image':require('../../../images/deposit.png'), 'subtype': 'deposit'},
    {'type':'depositwithdraw','title':'ME_WITHDRAW_TITLE', 'image':require('../../../images/withdraw.png'), 'subtype': 'withdraw'},
    {'type':'detail','title':'ME_DETAIL_TITLE', 'image':require('../../../images/detail.png'), 'subtype': 'details'},
]

var CALL_NUMBER = '66058771'
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class DepositWithdrawEntryScreen extends Component {
	static propTypes = {
		onPopToOutsidePage: PropTypes.func,
  	}

	static defaultProps = {
		onPopToOutsidePage: ()=>{},
	}

	// hardwareBackPress = ()=>{return this.pressBackButton();};
	constructor(props) {
		super(props);

		this.state = {
			dataSource: ds.cloneWithRows(listRawData),
			hasWithdrawError: false
		};
  	}

	componentWillUnmount(){
		//BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
	}

	componentDidMount(){
		//BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
		this.refreshData();
	}

	refreshData(){
        console.log("refreshData!!!");
        

		// this.loadLiveUserInfo();
	}

	loadLiveUserInfo(onSuccess, onError){
		var userData = LogicData.getUserData()
        if(userData.token == undefined){return}	//This must not be true!!!

            NetworkModule.fetchTHUrl(NetConstants.CFD_API.GET_USER_INFO,{
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                },
            },
            (response)=>{
                // if(response.bankCardNumber && response.bankCardNumber != ""){
                // 	response.bankCardRejectReason = "这是一个错误 "
                // 	response.bankCardStatus = "Rejected";
                // 	response.WithdrawAmount = "100";
                // 	response.WithdrawTime = "2017.1.1 19:23:12";
                // }
                LogicData.setLiveUserInfo(response);

                this.setState({
                    hasWithdrawError: response.bankCardStatus === "Rejected",
                }, ()=>{
                    if(onSuccess){
                        onSuccess();
                    }
                });
                //{"lastName":"张","firstName":"三","identityID":"310104000000000000","bankCardNumber":"1234567890","bankName":"光大银行","branch":"光大银行上海分行","province":"上海","city":"上海"}
            }, (error)=>{
                if(onError){
                    onError();
                }
            });
	}

	getWebViewPageScene(targetUrl, title, hideNavBar) {
		console.log("getWebViewPageScene:::"+targetUrl+" title = "+title +" hideNavBar = " + hideNavBar);
		var userData = LogicData.getUserData()
		var userId = userData.userId
		if (userId == undefined) {
			userId = 0
		}

		if (targetUrl.indexOf('?') !== -1) {
			targetUrl = targetUrl + '&userId=' + userId
		} else {
			targetUrl = targetUrl + '?userId=' + userId
		}

		return {
			name: MainPage.NAVIGATOR_WEBVIEW_ROUTE,
			url: targetUrl,
			title: title,
			isShowNav: hideNavBar ? false : true,
		}
	}

	gotoWebviewPage(targetUrl, title, hideNavBar) {
		this.props.navigator.push(this.getWebViewPageScene(targetUrl, title, hideNavBar));
	}

    onSelectNormalRow(rowData){
        switch(rowData.subtype){
            case 'deposit':
                this.goToDeposit();
                break;
            case 'withdraw':
                this.goToWithdraw();
                break;
            case 'details':
                this.goToTokenDetail();
                break;
        }
    }

    goToDeposit(){
        if(this.props.thtAddress){
            this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT, {
				onGoBack:()=>this.props.fetchBalanceData()
			});
        }else{
            this.props.navigation.navigate(ViewKeys.SCREEN_BIND_PURSE, {
				nextView: ViewKeys.SCREEN_DEPOSIT,
				onGoBack:()=>this.props.fetchBalanceData()
			});
        }
    }

    goToWithdraw(){
        if(this.props.thtAddress){
            this.props.navigation.navigate(ViewKeys.SCREEN_WITHDRAW, {
				onGoBack:()=>this.props.fetchBalanceData()
			});
        }else{
            this.props.navigation.navigate(ViewKeys.SCREEN_BIND_PURSE, {
				nextView: ViewKeys.SCREEN_WITHDRAW,
				onGoBack:()=>this.props.fetchBalanceData()
			});
        }
    }

    goToTokenDetail(){
        this.props.navigation.navigate(ViewKeys.SCREEN_TOKEN_DETAIL);
    }

    renderHeader(){
        return(
            <View style={styles.totalTextContainer}>
                <CustomStyleText style={styles.totalIncomeTitleText}>
                    {LS.str('DEPOSIT_WITHDRAW_ENTRY_AVAILABLE').replace("{1}", LS.getBalanceTypeDisplayText())}
                </CustomStyleText>
                <BalanceBlock ref={(ref)=>this.balanceBlock = ref} style={styles.totalIncomeText}/>
            </View>
        );
    }

	renderRowRightPart(rowData){
		if(rowData.subtype === "withdraw" && this.state.hasWithdrawError){
			return (
				<View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
					<View style={styles.newEventImage}/>
					<Image style={styles.moreImage} source={require("../../../images/icon_arrow_right.png")} />
				</View>
			)
		}
		return (
            <Image style={styles.moreImage} source={require("../../../images/icon_arrow_right.png")} />
        );
	}

	renderRow(rowData, sectionID, rowID) {
        if(rowData){
            if(rowData.type == 'header'){
                return (
                    <View style={styles.headerWrapper}>
                        {this.renderHeader()}
                    </View>
                );
            }
            else {
				var enabled = true;
				var style = {}
				if(rowData.subtype == 'withdraw' && !this.props.thtAddress){
					enabled = false;
				}
				if(!enabled){
					style.color = "gray"
				}
                return(
                    <TouchableOpacity activeOpacity={0.5} onPress={()=> enabled ? this.onSelectNormalRow(rowData) : null}>
                        <View style={[styles.rowWrapper, {height:Math.round(64*heightRate)}]}>
							<Image source={rowData.image} style={styles.image} />
							<CustomStyleText style={[styles.title, style]}>{LS.str(rowData.title)}</CustomStyleText>
							{this.renderRowRightPart(rowData)}
                        </View>
                    </TouchableOpacity>
                );
            }
        }
        return (<View></View>)
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted){
    var nextID = parseInt(rowID) + 1;
  	if(rowID == 0 || ((nextID< listRawData.length) && listRawData[nextID].type === 'detail')){
			return (
				<View style={[styles.line, {height: 10}]} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
				)
		}else{
			return (
        		<View style={styles.line} key={rowID}>
					<View style={[styles.separator]}/>
				</View>
			);
		}
    }
    

	renderListView(){
		var listDataView = listRawData.map((data, i)=>{
			var row = this.renderRow(data, 's1', i)
			return(
				<View key={i}>
					{row}
					{row != null ? this.renderSeparator('s1', i, false) : null}
				</View>
			);
		})

		return (
			<View>
				{listDataView}
			</View>);
	}

	render() {
		return (
			<View style={{flex: 1, width:width, backgroundColor:ColorConstants.SEPARATOR_GRAY}}>
                <NavBar
                    title={LS.str('DEPOSIT_WITHDRAW_ENTRY_HEADER')} 
                    showBackButton={true}
                    navigation={this.props.navigation}/>
				<ScrollView >
					{this.renderListView()}
				</ScrollView>
			</View>
		);
	}
}

var styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        width: width,
        alignItems: 'stretch',
    },
	headerWrapper: {
		backgroundColor: ColorConstants.COLOR_MAIN_THEME_BLUE,
        height: 186,
	},
    totalTextContainer:{
        flexDirection: 'column',
        alignItems:'center',
        flex:1,
    },
    totalIncomeTitleText:{
        fontSize: 14,
        marginTop: 41,
        color: ColorConstants.SUB_TITLE_WHITE,
    },
    totalIncomeText:{
        fontSize: 46,
        marginTop: 23,
        color: 'white',
    },
    detailsContainer:{
        flexDirection: 'column',
    },
    detailTextContainer:{
        flexDirection: 'column',
        alignItems:'center',
    },
    detailIncomeTitleText:{
        fontSize: 13,
        color: ColorConstants.SUB_TITLE_WHITE,
    },
    detailIncomeText:{
        fontSize: 17,
        color: 'white',
    },
	rowWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: UIConstants.LIST_ITEM_LEFT_MARGIN,
		paddingRight: 15,
		paddingBottom: 5,
		paddingTop: 5,
		backgroundColor: 'white',
	},
	title: {
		flex: 1,
		fontSize: 17,
		color: '#000000',
	},
	extendRight: {
		flex: 1,
		alignItems: 'flex-end',
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 8,
	},
	image: {
		marginLeft: 20,
		marginRight: 11,
		width: 23,
		height: 23,
	},
	contentValue: {
		fontSize: 17,
		marginRight: 5,
		color: '#757575',
	},
	line: {
		height: 0.5,
		backgroundColor: 'white',
	},
	separator: {
		flex: 1,
		backgroundColor: ColorConstants.SEPARATOR_GRAY,
	},
	lineLeftRight:{
	 	width:100,
		height:1,
		margin:5,
	},
	moreImage: {
		alignSelf: 'center',
		width: 7.5,
		height: 12.5,
	},
	newEventImage:{
		width: 6,
		height: 6,
		backgroundColor: '#ff0000',
		borderRadius: 5,
		marginRight: 8,
	},
});

const mapStateToProps = state => {
	return {
		...state.meData,
	};
};

const mapDispatchToProps = {
	fetchBalanceData
};
  
var connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DepositWithdrawEntryScreen);

export default connectedComponent;
module.exports = connectedComponent;