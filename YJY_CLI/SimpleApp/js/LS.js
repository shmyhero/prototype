'use strict'

import LogicData from './LogicData';

var LS = {
  Str:{
    APP_NAME: ["BTH", "BTH", "BTH"],
    LANGUAGE: ["语言", "Language", "言語"],

    DATA_LOADING: ["数据读取中...", "Loading...", "読み込み中..."],
    DATA_LOAD_FAILED: ["数据读取失败", "Data Loading Failed", "読み込み失敗しました"],
    ERROR: ["错误", "Error", "エラー"],
    HINT: ["提示", "Hint", "ヒント"],
    TAB_MAIN_TAB_LABEL: ["动态", "Feed", "フィード"],
    TAB_MARKET_TAB_LABEL: ["行情", "Market", "マーケット"],
    TAB_POSITION_TAB_LABEL: ["仓位", "Positions", "ポジション"],
    TAB_RANK_TAB_LABEL: ["榜单", "Rank", "ランキング"],
    TAB_ME_TAB_LABEL:["我的", "Me", "自分"], 
    VERIFING: ["信息检查中...", "Verifying...", "検証中..."],    
    FINISH: ["完成", "Done", "完成"],
    SUGAR_PROFIT: ["盈利", "Profit", "獲得"],
    SUGAR_AMOUNT: ["总{1}数", "Total {1}", "総資産({1})"],
    SUGAR_AVAILABLE: ["可出{1}数", "Available {1}", "残高({1})"],
    LONG_OPERATION: ["上升", "RISING", "上昇"],
    SHORT_OPERATION: ["下降", "FALLING", "下落"],

    NETWORK_ERROR: ["溜走的不是网络，是真金白银呀！", "Something went wrong...", "エラーが発生しました"],
    CANCLE: ["取消", "Cancle", "キャンセル"],
    IMPORT_FROM_PHOTO: ["拍照", "Take Photo", "写真を撮る"],
    IMPORT_FROM_ALBUM: ['照片图库','Choose from Album', "アルバムから選択"],

    LOG_OUT: ["退出登录", "Log Out", "ログアウト"],

    REFRESH:["刷新", "REFRESH", "リフレッシュ"],
    PULL_TO_REFRESH:["下拉刷新...","pull to refresh ...", "プルダウンするとリフレッシュ"],
    RELEASE_TO_REFRESH:["释放刷新","release to refresh", "リリースしてください"],
    REFRESHING:["刷新中","loading...", "読み込み中..."],  
    LOADING:["加载中...","loading...", "読み込み中..."],
    LOADING_WITHOUT_DOT:["加载中","LOADING ", "読み込み中"],
    LOAD_MORE:["加载更多","load more ...", "もっと読み込む..."],
    RELEASE_FOR_LOAD_MORE:["释放加载更多","release to load more...", "リリースしてください"],
    NO_MORE:["没有更多","no more data", "データはこれ以上ありません"],
    DEL:["删除","Remove", "削除"],
    MOUNT_X:["{1} x","{1} x", "{1} x"],
    MULTIPLE:["倍数","multiple", "乗数"],//テコ入れ
    PROFIT:["盈利","Profit", "獲得"],
    LOSS:["亏损","Loss", "損失"],    
    CLOSE_POSITION:["平仓","Position", "クローズポジション"],
    EXPERT:["达人","Expert", "達人"],
    CONCERN:["关注","Watch", "フォロー"],
    COPY_TRADE:["跟随","Copy", "コピー"],
    COPYING_TRADE:["跟随中","Copying", "コピー中"],
    CANCLE_COPY:["取消剩余跟随({1})","Cancel Copy ({1})", "コピー({1})キャンセル"],
    CANCLE_COPY_ALERT_TITLE:["确认取消跟随", "Are you sure to cancel copy?", "コピーをキャンセルしますか"],
    CANCLE_COPY_ALERT_MESSAGE:["未跟随的申请将自动取消", "Uncopied positions will be cancelled automatically", "コピー申請をキャンセルされます"],
    CANCLE_COPY_ALERT_OK:["确认取消", "Confirm", "はい"],
    CANCLE_COPY_ALERT_CANCLE:["暂不", "Not Now", "いいえ"],
    MINE:["我的","Mine", "私"],
    WINRATE:["胜率:","WinRate:", "勝率"],
    WINRATE_:["胜率","WinRate", "勝率"],
    TRADES:["交易笔数","TRADES", "交易笔数"],
    
    APPLY_COPY:["申请跟随:","Apply Copy", "コピー"],
    AVG_MOUNT_COPY:["每笔跟随{1}","{1} per time", "1つトレードあたりの{1}"],
    COPY_TIMES:["跟随笔数","Copy times", "トレード数"],
    SUNDAY:["星期日","Sun", "日"],
    MONDAY:["星期一","Mon", "月"],
    TUESDAY:["星期二","Tues", "火"],
    WEDNESDAY:["星期三","Wed", "水"],
    THURSDAY:["星期四","Thurs", "木"],
    FRIDAY:["星期五","Fri", "金"],
    SATURDAY:["星期六","Sat", "土"],
    MAIN:["首页","MAIN", "ホーム"],
    DYNAMIC:["动态","DYNAMIC", "フィード"],
    OPEN:["持仓","OPEN ", "オープンポジション"],
    CLOSED:["平仓","CLOSED", "クローズポジション"],
    YHWGKSJ:["用户未公开数据","no public data", "データが公開していません"],
    ZWCCJL:["暂无持仓记录","There are no open positions", "データがありません"],
    ZWPCJL:["暂无平仓记录","There are no closed positions", "データがありません"],
    CP:["产品","Products", "商品"],
    PJYK:["平均盈亏","AVG.Profit/Loss", "平均獲得"],
    ZSL:["总胜率","Total WinRate", "勝率"],
    YKFB:["盈亏分布","Profit/Loss Trend", "獲得損失分布"],
    //ZWPCJL:["暂无盈亏分布","no data"],
    ZWJYJL:["暂无交易记录","no data", "データがありません"],
    MONTHLY:["近一个月","Monthly", "1ヶ月"],
    ALL:["全部","ALL", "すべて"],
    INVESTMENT_TREND:["TA的收益走势","Investment Trend", "獲得"],
    JYFG:["交易风格","Trade Style", "トレードスタイル"],
    PJGG:["平均倍数","AVG.Multiple", "平均乗数"],
    LJXD:["累积下单(次)","Total trades", "トレード数"],
  
    PJBJ:["平均{1}","AVG.{1}", "平均{1}"],  
    PJCCSJ:["平均持仓(天)","AVG. hold days", "平均期間"], 
    PJMBHL:["平均每笔获利","AVG.Profit", "平均獲得"],
 
    CONCERN_CANCEL:["取消关注","UnWatch", "アンフォロー"],
    CONCERN_ADD:["+关注","Watch", "フォロー"],
    STATISTICS:["统计","Statistics", "統計"],
    PHONE_NUM:["手机号","Phone Number", "携帯番号"],
    VCODE:["验证码","VCode", "確認コード"],
    GET_VCODE:["获取验证码","Get VCode", "確認コードを発送"],
    YOU_ARE_LOGIN:["您正在登录BTH市场","You are login BTH market", "ログイン"],
    FAST_LOGIN:["快速登录","Fast Login", "簡単ログイン"],
    
    WARNING:["温馨提示","TIPS", "温馨提示"],
    PLEASE_INPUT_FOR_LOGIN:["请输入手机号码和验证码","PLEASE_INPUT_FOR_LOGIN", "请输入手机号码和验证码"],
    SELECT_COUNTRY_CODE:["选择国家/地区","Country/Area Code", "选择国家/地区"],

    LOGIN:["登录","Login", "ログイン"],
    TOTAL_MOUNT:["总{1}","Total {1}", "{1}"],
    REMAIN_MOUNT:["剩余{1}","Remain {1}", "{1}残高"],
    SHARE:["分享","Share", "シェア"],
    NO_DYNAMIC:["暂无动态","No Data", "データがありません"],
    NO_COPY:["没有跟随记录","No Copy", "データがありません"],
    WATCHS:["关注数","Watchlist", "フォロワー数"],
    COPYS:["跟随数","Copiers", "コピー人数"],

    DYNAMIC_SETTING:["动态设置","Dynamic Settings", "フィード設定"],
    COPIERS:["跟随的用户","Copiers", "コピー中ユーザー"],
    WATCHLIST:["关注的用户","Watchlist", "フォロー中ユーザー"],
    NEWS:["平台资讯","News", "ニュース"],

    NO_MESSAGES: ["暂无消息", "No Messages", "メッセージがありません"],

    
    
    
    
    ME_DEPOSIT_WITHDRAW: ["入金/出金", "Deposit/Withdraw", "入金/出金"],
    ME_DEPOSIT_TITLE: ["入金", "Deposit", "入金"],
    ME_WITHDRAW_TITLE: ["出金", "Withdraw", "出金"],
    ME_DETAIL_TITLE: ["资金明细", "Transactions", "取引明細"],

    NO_TRANSACTIONS: ["暂无资金明细", "There are no transactions", "取引明細がありません"],
    POSITION_TAKE_LOSS:['亏损','Take loss', "損失"],
    POSITION_TAKE_PROFIT:['获利','Take Profit', "獲得"],
    POSITION_CONFIRM: ['确认','OK', "はい"],
    POSITION_SETTED:['已设置','Setted', "設定済み"],
    POSITION_COPY_TRADE:["跟随: {1}","Copying: {1}", "コピー中: {1}"],
    TAKE_PROFIT: ['止盈','Take Profit', "指値"],
    STOP_LOSS: ['止损','Stop Loss', "逆指値"],
    TAKE_PROFIT_STOP_LOSS_TITLE:['止盈/止损','TP/SL', "指値/逆指値"],

    STOCK_MARKET_STOP:['暂停','Stop', "一時停止中"],
    STOCK_MARKET_CLOSED:['闭市','closed', "クローズ中"],
    STOCK_DETAIL: ['详情', "Detail", "詳細"],

    TWEET_HINT: ["今天你怎么看？", "What's your opinion today?", "What's your opinion today?"],
    TWEET_PUBLISH_TITLE: ["发布动态", "Publish Tweet", "Publish Tweet"],
    TWEET_PUBLISH: ["发布", "Publish", "Publish"],
    TWEET_PUBLISH_FAILED_TITLE: ["发布失败", "Publish failed", "Publish failed"],
    TWEET_PUBLISH_PRODUCTS: ["产品", "Products", "Products"],

    POSITION_HOLD_NO_ITEMS: ["暂无持仓记录", "There are no open positions", "今どう思いますか"],
    POSITION_CLOSED_NO_ITEMS: ["暂无平仓记录", "There are no closed positions", "データがありません"],
    BUY_LONG: ["上升","LONG", "上昇"],
    BUY_SHORT: ["下降","SHORT", "下落"],
    BUY: ["开始", "Start", "スタート"],
    SELECT_PRODUCT: ["选择产品", "Choose Products", "商品を選択"],
     
    DEPOSIT_WITHDRAW_ENTRY_HEADER:['存取资金','Wallet', "Wallet"],
    DEPOSIT_WITHDRAW_ENTRY_AVAILABLE:['剩余{1}','Remaining {1}', "Remaining {1}"],
    BIND_PURSE_ADDRESS_HINT: ["请输入/粘贴钱包地址", "Please enter/paste wallet address", "Please enter/paste wallet address"],
    BIND_PURSE_HINT: ["绑定须知：入金前需要绑定您的钱包地址，钱包地址绑定后，入金才能和{1}账户关联起来！", "Binding Notice: You need to bind your wallet address before Deposit, After binding, funds can be associated with the token account.", "Binding Notice: You need to bind your wallet address before Deposit, After binding, funds can be associated with the token account."],
    BIND_CONFIRM: ["确认绑定", "Confirm binding", "Confirm binding"],
    BIND_PURSE_HEADER: ["绑定钱包地址", "Bind wallet address", "Bind wallet address"],
    DEPOSIT_COPY_YJY_ADDRESS: ["复制{1}收款地址", "Copy wallet address of {1}", "Copy wallet address of {1}"],
    DEPOSIT_YJY_ADDRESS: ["{1}收款地址: ", "Wallet address of {1}: ", "Wallet address of {1}: "],
    DEPOSIT_HINT_1: ["注册以太坊钱包: ", "Registered Ethereum Wallet: ", "Registered Ethereum Wallet: "],
    DEPOSIT_HINT_2: ["以太坊官网: ", "Ethereum Website: ", "Ethereum Website: "],
    DEPOSIT_HINT_3: ["用户把自己的Token转入{1}: ", "Users transfer their Token to {1}", "Users transfer their Token to {1}"],
    DEPOSIT_COPY_SUCCESS: ["复制成功", "Successful", "Successful"],
    DEPOSIT_AGREEMENT: ["《购买{1}协议内容》", "{1} clause》", "{1} clause》"],

    WITHDRAW_ADDRESS_HINT: ["我的收款地址", "My wallet address", "My wallet address"],
    WITHDRAW_READ_AGREEMENT: ["我已经阅读并同意", "Accept ", "Accept"],
    WITHDRAW_AGREEMENT: ["出金协议内容", "the Agreement", "the Agreement"],
    WITHDRAW_AMOUNT: ["出金金额", "Withdraw Limit", "Withdraw Limit"],
    WITHDRAW_BTH: ["{1}", "{1}", "{1}"],
    WITHDRAW_ALL: ['全部出金', 'Withdraw all', "Withdraw all"],
    WITHDRAW_AVAILABLE_AMOUNT: ['可出资金：{1}{2}，', 'Withdraw Limit :{1} {2},', "Withdraw Limit :{1} {2},"],
    WITHDRAW_WITHDRAW: ["确认出金", "withdraw", "withdraw"],
    WITHDRAW_REQUEST_SUBMITED: ["出金提交成功", "Submitted", "Submitted"],
    WITHDRAW_ETA_MESSAGE: ["预计资金到账时间为1小时，具体以钱包余额为准！", "Funds may arrive within one hour.", "Funds may arrive within one hour."],

    COPY_AGREEMENT: ["《跟随规则》", "Copy Agreement", "Copy Agreement"],
    COPY_AMOUNT: ["每笔跟随{1}", "{1}", "{1}"],
    COPY_COUNT: ["跟随笔数", "Times", "Times"],

    ORDER_TYPE:['类型','type', "type"],
    ORDER_SUGAR_AMOUNT: ["{1}", "{1}", "{1}"],
    ORDER_MULTIPLE: ["倍数", "Multiple", "Multiple"],
    ORDER_TRADE_PRICE: ["开仓价格", "Trade Price", "Trade Price"],
    ORDER_MAX_RISK: ["最大风险（{1}）", "Maximum Risk", "Maximum Risk"],
    ORDER_PROFIT_AND_LOSS: ["盈亏（{1}）", "Profit / loss ({1})", "Profit / loss ({1})"],
    
    ORDER_CURRENT_BUY_PRICE:['当前买价','Current Price', "Current Price"],
    ORDER_CURRENT_SELL_PRICE:['当前卖价','Current Price', "Current Price"],
    ORDER_OPEN_PRICE:['开仓价格','Trade Price', "Trade Price"],
    ORDER_CLOSE_PRICE:['平仓价格','Close Price', "Close Price"],
    ORDER_OPEN_TIME: ["开仓时间", "Opened", "Opened"],
    ORDER_CLOSE_TIME: ["平仓时间", "Closed", "Closed"],
    ORDER_OPEN: ["开仓","Open", "Open"],
    ORDER_CLOSE: ["平仓","Closed", "Closed"],

    SETTINGS_TITLE: ["设置", "Settings", "Settings"],
    SETTINGS_USER_CONFIG: ["个人信息", "Personal Information", "Personal Information"],
    SETTINGS_CENTER_TITLE: ["帮助中心", "Help Center", "Help Center"],
    SETTINGS_ABOUT_TITLE: ["关于我们", "About Us", "About Us"],
    SETTINGS_SWITCH_LANGUAGE: ["切换成英文", "Switch to Chinese", "Switch to Chinese"],
    SETTINGS_VERSION: ["当前版本", "Version", "Version"],
    SETTINGS_LOG_OUT: ["退出登录", "Log out", "Log out"],
    SETTINGS_PORTRAIT: ["头像", "Portrait", "Portrait"],
    SETTINGS_NICKNAME: ["昵称", "Nickname", "Nickname"],
    SETTINGS_MOBILE: ["手机号", "Mobile", "Mobile"],
    SETTINGS_BALANCE_TYPE: ["交易账户", "Transaction Account", "Transaction Account"],

    MY_MESSAGES:['我的消息','Messages', "Messages"],

    ACCOUNT_NAME_TITLE: ["我的昵称", "Name", "Name"],
    ACCOUNT_NAME_INPUT_HINT: ['请输入昵称', "Name", "Name"],
    ACCOUNT_NAME_CANNOT_BE_EMPTY: ["昵称不能为空", "Name cannot be empty", "Name cannot be empty"],
    ACCOUNT_NAME_FORMAT_ERROR: ["昵称包含{1}-{2}位字符，支持中英文、数字", 
      "You can only use letters, numbers with a length between {1} to {2}", 
      "You can only use letters, numbers with a length between {1} to {2}"],

    ERROR_HINT: ["错误提示", "Error Hint", "Error Hint"],
    ADDED_TO_WATCH_LIST: ["已加入关注列表", "Added to watchlist", "Added to watchlist"],
    DYNAMIC_OPEN_ASK: ["动态已全部关闭，是否前往开启？", "Dynamics have all been closed,Are you going to open?", "Dynamics have all been closed,Are you going to open?"],
    GO: ["前往", "Go", "Go"],
    CONFIRM: ['确认','Confirm', "はい"],

    RISK_WARNING: ["风险提示！", "Warning!","Warning!"],
    LOGIN_OUTSIDE: ["盈交易账号已登录其他设备", "Your account is logged in on another device.", "Your account is logged in on another device."],
    I_SEE: ["我知道了", "I see", "I see"]

  },
  str(key){
    if(LogicData.getLanguage() == 'zh-cn'){
      return LS.Str[key][0]
    }else if(LogicData.getLanguage() == 'en-us'){
      return LS.Str[key][1]
    }else{
      console.log("ENKEY:"+key+" => "+LS.Str[key][1]);
      return LS.Str[key][1]
    }
  },
  imageList: {
    position_follow_open: [require("../images/zh-cn/position_follow_open.png"), require("../images/en-us/position_follow_open.png")],
    position_follow_closed: [require("../images/zh-cn/position_follow_closed.png"), require("../images/en-us/position_follow_closed.png")],
    deposit_token_image: [require("../images/zh-cn/deposit_token_image.jpg"), require("../images/en-us/deposit_token_image.jpg"), ],
    stock_detail_direction_container: [require("../images/zh-cn/stock_detail_direction_container.png"), require("../images/en-us/stock_detail_direction_container.png")],
    stock_detail_multiple_container: [require("../images/zh-cn/stock_detail_multiple_container.png"), require("../images/en-us/stock_detail_multiple_container.png")],
    // stock_detail_option_down_selected: [require("../images/zh-cn/stock_detail_option_down_selected.png"), require("../images/en-us/stock_detail_option_down_selected.png")],
    // stock_detail_option_down_unselected: [require("../images/zh-cn/stock_detail_option_down_unselected.png"), require("../images/en-us/stock_detail_option_down_unselected.png")],
    // stock_detail_option_up_selected: [require("../images/zh-cn/stock_detail_option_up_selected.png"), require("../images/en-us/stock_detail_option_up_selected.png")],
    // stock_detail_option_up_unselected: [require("../images/zh-cn/stock_detail_option_up_unselected.png"), require("../images/en-us/stock_detail_option_up_unselected.png")],
    stock_detail_trading_container:[require("../images/zh-cn/stock_detail_trading_container.png"), require("../images/en-us/stock_detail_trading_container.png")],
    bind_purse_address_hint: [require("../images/zh-cn/bind_purse_address_hint.png"), require("../images/en-us/bind_purse_address_hint.png")],
    //splash: [require('../images/zh-cn/splash.jpg'), require('../images/en-us/splash.jpg')],
    expert:[require('../images/zh-cn/expert.png'), require('../images/en-us/expert.png')],
  },

  loadImage(imageFileName){
    if(LogicData.getLanguage() == 'zh-cn'){
      return LS.imageList[imageFileName][0]
    }else if(LogicData.getLanguage() == 'en-us'){
      return LS.imageList[imageFileName][1]
    }else{
      return LS.imageList[imageFileName][1]
    }
  },

	getBalanceTypeDisplayText(){
		return LogicData.getBalanceType();
	}
}

module.exports = LS;
