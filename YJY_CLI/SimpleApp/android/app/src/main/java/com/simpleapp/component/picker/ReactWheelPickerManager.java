package com.simpleapp.component.picker;

import android.graphics.Color;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by Neko on 2018/5/4.
 */
public class ReactWheelPickerManager extends SimpleViewManager<ReactWheelPicker> {

    private static final String REACT_CLASS = "WheelPicker";

    private static final int DEFAULT_TEXT_SIZE = 25 * 2;
    private static final int DEFAULT_ITEM_SPACE = 14 * 2;

    @Override
    protected ReactWheelPicker createViewInstance(ThemedReactContext reactContext) {
        ReactWheelPicker reactPicker = new ReactWheelPicker(reactContext);
        reactPicker.setItemTextColor(Color.LTGRAY);
        reactPicker.setSelectedItemTextColor(Color.WHITE);
        reactPicker.setItemTextSize(DEFAULT_TEXT_SIZE);
        reactPicker.setItemSpace(DEFAULT_ITEM_SPACE);
        reactPicker.setCurved(true);
        return reactPicker;
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                ReactWheelPickerItemSelectedEvent.EVENT_NAME, MapBuilder.of("registrationName", "onValueChange")
        );
    }

    @ReactProp(name="data")
    public void setData(ReactWheelPicker picker, ReadableArray items) {
        if (picker != null) {
            ArrayList<Integer> valueData = new ArrayList<>();
            ArrayList<String> labelData = new ArrayList<>();
            for (int i = 0; i < items.size(); i ++) {
                ReadableMap itemMap = items.getMap(i);
                valueData.add(itemMap.getInt("value"));
                labelData.add(itemMap.getString("label"));
            }
            picker.setValueData(valueData);
            picker.setData(labelData);
        }
    }

    @ReactProp(name="selectedIndex")
    public void setSelectedIndex(ReactWheelPicker picker, int index) {
        if (picker != null
                //&& picker.getState() == WheelPicker.SCROLL_STATE_IDLE
            ) {
            picker.setSelectedItemPosition(index);
        }
    }

    @ReactProp(name="textColor", customType = "Color")
    public void setTextColor(ReactWheelPicker picker, Integer color) {
        if (picker != null) {
            picker.setSelectedItemTextColor(color);
            picker.setItemTextColor(color);
        }
    }

    @ReactProp(name="textSize")
    public void setTextSize(ReactWheelPicker picker, int size) {
        if (picker != null) {
            picker.setItemTextSize((int) PixelUtil.toPixelFromDIP(size));
        }
    }

    @ReactProp(name="selectedTextColor", customType = "Color")
    public void setSelectedTextColor(ReactWheelPicker picker, Integer color) {
        if (picker != null) {
            picker.setSelectedItemTextColor(color);
        }
    }

    @ReactProp(name="itemSpace")
    public void setItemSpace(ReactWheelPicker picker, int space) {
        if (picker != null) {
            picker.setItemSpace((int) PixelUtil.toPixelFromDIP(space));
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }
}
