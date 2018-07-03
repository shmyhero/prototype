package com.simpleapp.RNNativeModules;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.simpleapp.SplashScreen;

import static com.simpleapp.SplashScreen.dismiss;

/**
 * Created by Neko on 2018/7/3.
 */
public class SplashScreenModule extends ReactContextBaseJavaModule {

    public SplashScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static final String NAME = "SplashScreen";

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void show() {
        SplashScreen.show(getCurrentActivity(), true);
    }

    @ReactMethod
    public void hide() {
        SplashScreen.dismiss(getCurrentActivity());
    }
}
