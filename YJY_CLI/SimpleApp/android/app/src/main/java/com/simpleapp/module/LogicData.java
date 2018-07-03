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

    public static final String GET_VERSION_CODE = "getVersionCode";

    private static LogicData mInstance;

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
