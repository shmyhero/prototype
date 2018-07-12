package com.simpleapp;

import android.app.Application;
import android.util.Log;

import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactApplication;
import su.rusfearuth.reactnative.native9patch.RCTImageCapInsetPackage;
import com.reactnativecomponent.swiperefreshlayout.RCTSwipeRefreshLayoutPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.remobile.toast.RCTToastPackage;
import java.util.Arrays;
import io.fixd.rctlocale.RCTLocalePackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;

import java.util.List;

import io.realm.react.RealmReactPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RCTImageCapInsetPackage(),
          //new ReactNativeWheelPickerPackage(),
          //new RCTSwipeRefreshLayoutPackage(),
          new OrientationPackage(),
          new RealmReactPackage(), // add this line
          new RCTSwipeRefreshLayoutPackage(),  //register Module
          new NativePackage(),
          new RCTToastPackage(),
          new LinearGradientPackage(),
          new RCTLocalePackage(), // add package
          new ImagePickerPackage(),
          new RNDeviceInfo()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
      @Override
      public void uncaughtException(Thread t, Throwable e) {
        Log.e("com.simpleapp", e.getMessage(), e);
      }
    });
  }
}
