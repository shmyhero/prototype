package com.simpleapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.simpleapp.RNNativeModules.NativeDataModule;
import com.simpleapp.RNNativeModules.NativeWebViewModule;
import com.simpleapp.RNNativeModules.SplashScreenModule;
import com.simpleapp.component.chart.PriceChartModule;
import com.simpleapp.component.customTextInput.CustomTextInputManager;
import com.simpleapp.component.picker.ReactWheelPickerManager;

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
