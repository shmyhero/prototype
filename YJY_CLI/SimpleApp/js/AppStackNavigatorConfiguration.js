var MainScreenNavigator = require('./navigation/MainScreenNavigator');
import ViewKeys from "./ViewKeys";

var AppStackNavigatorConfiguration = {}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_HOME] = {screen: MainScreenNavigator}
//AppStackNavigatorConfiguration[ViewKeys.SCREEN_SPLASH] = { getScreen: ()=> require('./view/SplashScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_DETAIL] = {getScreen: ()=> require('./view/StockDetailScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_LOGIN] = {getScreen: ()=> require('./view/LoginScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_USER_PROFILE] = {getScreen: ()=> require('./view/UserProfileScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_HELP] = {getScreen: ()=> require("./view/HelpScreen")}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_ABOUT] = {getScreen: ()=> require("./view/AboutScreen")}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_MESSAGE] = {getScreen: ()=> require("./view/MessageScreen")}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_DEPOSIT_WITHDRAW] = {getScreen: ()=> require("./view/depositWithdraw/DepositWithdrawEntryScreen")}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_DEPOSIT] = {getScreen: ()=> require('./view/depositWithdraw/DepositTokenScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW] = {getScreen: ()=> require('./view/depositWithdraw/WithdrawTokenScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_WITHDRAW_SUBMITTED] = {getScreen: ()=> require("./view/depositWithdraw/WithdrawSubmittedPage")}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_TWEET] = {getScreen: ()=> require('./view/tweet/PublishTweetScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_STOCK_SEARCH] = {getScreen: ()=> require('./view/StockSearchScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_DYNAMIC_STATUS_CONFIG] = {getScreen: ()=> require('./view/DynamicStatusConfig')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_BIND_PURSE] = {getScreen: ()=> require('./view/depositWithdraw/BindPurseScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_TOKEN_DETAIL] = {getScreen: ()=> require('./view/depositWithdraw/TokenDetailScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_FOLLOW] = {getScreen: ()=> require("./view/FollowScreen"),
    navigationOptions: {
        mode: 'modal', // Remember to set the root navigator to display modally.
        headerMode: 'none', // This ensures we don't get two top bars.
    }
}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_SETTINGS] = {getScreen: ()=> require('./view/MeSettingsScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_USER_CONFIG] = {getScreen: ()=> require('./view/MeUserConfigScreen')}
AppStackNavigatorConfiguration[ViewKeys.SCREEN_SET_NICKNAME] = {getScreen: ()=> require("./view/MeSettingNicknameScreen")}

export default AppStackNavigatorConfiguration ;