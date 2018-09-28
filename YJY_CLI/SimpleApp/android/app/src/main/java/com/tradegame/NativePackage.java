package com.tradegame;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.tradegame.RNNativeModules.NativeDataModule;
import com.tradegame.RNNativeModules.NativeWebViewModule;
import com.tradegame.RNNativeModules.SplashScreenModule;
import com.tradegame.component.chart.PriceChartModule;
import com.tradegame.component.customTextInput.CustomTextInputManager;
import com.tradegame.component.picker.ReactWheelPickerManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Neko on 2018/1/29.
 */

public class NativePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new NativeDataModule(reactContext));
        modules.add(new SplashScreenModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new PriceChartModule(),
                new CustomTextInputManager(),
                new NativeWebViewModule(),
                new ReactWheelPickerManager()
        );
    }
}
