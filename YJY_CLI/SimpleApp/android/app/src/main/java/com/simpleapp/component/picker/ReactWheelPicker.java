package com.simpleapp.component.picker;

import com.facebook.react.bridge.ReactContext;
import com.aigestudio.wheelpicker.WheelPicker;

import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import java.util.List;

/**
 * Created by Neko on 2018/5/4.
 */
public class ReactWheelPicker extends WheelPicker {

    private final EventDispatcher mEventDispatcher;
    private List<Integer> mValueData;

    public ReactWheelPicker(ReactContext reactContext) {
        super(reactContext);
        mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        setOnWheelChangeListener(new WheelPicker.OnWheelChangeListener() {
            @Override
            public void onWheelScrolled(int offset) {

            }

            @Override
            public void onWheelSelected(int position) {
                if (mValueData != null && position < mValueData.size()) {
                    mEventDispatcher.dispatchEvent(
                            new ReactWheelPickerItemSelectedEvent(getId(), mValueData.get(position)));
                }
            }

            @Override
            public void onWheelScrollStateChanged(int state) {
            }
        });
    }

    @Override
    public void setOnWheelChangeListener(OnWheelChangeListener listener) {
        super.setOnWheelChangeListener(listener);
    }



    //    @Override
//    protected void drawForeground(Canvas canvas) {
//        super.drawForeground(canvas);
//
//        Paint paint = new Paint();
//        paint.setColor(Color.WHITE);
//        int colorFrom = 0x00FFFFFF;//Color.BLACK;
//        int colorTo = Color.WHITE;
//        LinearGradient linearGradientShader = new LinearGradient(rectCurItem.left, rectCurItem.top, rectCurItem.right/2, rectCurItem.top, colorFrom, colorTo, Shader.TileMode.MIRROR);
//        paint.setShader(linearGradientShader);
//        canvas.drawLine(rectCurItem.left, rectCurItem.top, rectCurItem.right, rectCurItem.top, paint);
//        canvas.drawLine(rectCurItem.left, rectCurItem.bottom, rectCurItem.right, rectCurItem.bottom, paint);
//    }

    @Override
    public void setSelectedItemPosition(int position){
        super.setSelectedItemPosition(position);
    }

    public void setValueData(List<Integer> data) {
        mValueData = data;
    }
//
//    public int getState() {
//        return state;
//    }

    @Override
    public void setSelectedItemTextColor(int color) {
        super.setSelectedItemTextColor(color);
    }


}