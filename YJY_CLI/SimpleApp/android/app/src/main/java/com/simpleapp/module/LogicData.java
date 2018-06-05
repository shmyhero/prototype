package com.simpleapp.module;

import android.support.annotation.Nullable;
import android.util.Log;

import com.simpleapp.MainActivity;

import org.json.JSONArray;
import org.json.JSONException;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class LogicData {
    private static String isLive = "false";

    public static final String MY_LIST = "myList";
    public static final String MY_LOGO = "myLogo";
    public static final String MY_ALERT_LIST = "myAlertList";
    public static final String PLAY_SOUND = "playSound";
    public static final String IS_PRODUCT = "isProduct";
    public static final String ACCOUNT_STATE = "accountState";
    public static final String STATUS_BAR_COLOR = "statusBarColor";
    public static final String GET_VERSION_CODE = "getVersionCode";
    public final static String GET_DEVICE_TOKEN = "getui";

    public static final String LIVE_NAME = "userName";
    public static final String LIVE_EMAIL = "userEmail";
    public static final String LANGUAGE= "Lang";
    public static final String TH_AUTH= "TH_AUTH";

    private static LogicData mInstance;
    private JSONArray mMyList;
    private JSONArray mMyAlertList;
    private String myLogo;
    private String mLiveName;
    private String mLiveEmail;
    private String mLang;
    private String mAUTH;

    public static LogicData getInstance() {
        if (mInstance == null) {
            mInstance = new LogicData();
        }
        return mInstance;
    }



    public void setData(String dataName, String data) {
        if(dataName.equals(GET_VERSION_CODE)){
            getVersionCode();
        }
    }

    public void getVersionCode(){
        if(MainActivity.mInstance != null) {
            MainActivity.mInstance.getVersionCode();
        }
    }

}
