package com.simpleapp;

import android.app.Activity;
import android.app.Dialog;
import android.content.pm.PackageInfo;
import android.widget.TextView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.simpleapp.R;
import com.simpleapp.module.LogicData;

import java.lang.ref.WeakReference;

/**
 * Created by Neko on 2018/7/3.
 */
public class SplashScreen {

    static WeakReference<Activity> mActivity;
    static Dialog mSplashDialog;

    public static void show(final Activity activity, final int themeResId) {
        if (activity == null) return;
        mActivity = new WeakReference<Activity>(activity);
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) {

                    mSplashDialog = new Dialog(activity, themeResId);
                    mSplashDialog.setContentView(R.layout.launch_screen);
                    mSplashDialog.setCancelable(false);

                    //Update textview
                    try {
                        TextView textView = (TextView) mSplashDialog.findViewById(R.id.textView3);
                        PackageInfo pInfo = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0);
                        String version = pInfo.versionName;
                        textView.setText(activity.getString(R.string.splash_screen_line_3, version));
                    }catch (Exception e){
                        //...
                    }

                    if (!mSplashDialog.isShowing()) {
                        mSplashDialog.show();
                    }
                }
            }
        });
    }

    public static void show(final Activity activity, final boolean fullScreen) {
        int resourceId = fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme;

        show(activity, resourceId);
    }

    public static void show(final Activity activity) {
        show(activity, false);
    }

    public static void dismiss(Activity activity){
        if (activity == null) activity = mActivity.get();
        if (activity == null) return;

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (mSplashDialog != null && mSplashDialog.isShowing()) {
                    mSplashDialog.dismiss();
                }
            }
        });
    }


}
