package com.simpleapp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.simpleapp.RNNativeModules.NativeActions;
import com.simpleapp.RNNativeModules.NativeDataModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SimpleApp";
    }

    public static MainActivity mInstance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mInstance = this;

    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        mInstance = null;
    }

    public void getVersionCode() {
        try {
            String pkName = MainActivity.mInstance.getPackageName();
            Integer versionCode = MainActivity.mInstance.getPackageManager().getPackageInfo(
                    pkName, 0).versionCode;
            String versionName = MainActivity.mInstance.getPackageManager().getPackageInfo(
                    pkName, 0).versionName;
            NativeDataModule.passDataToRN(getReactInstanceManager().getCurrentReactContext(), NativeActions.ACTION_VERSION_CODE, versionCode.toString());
        }catch (Exception e){

        }
    }
}
