package com.simpleapp.component.picker;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
/**
 * Created by Neko on 2018/5/4.
 */
public class ReactWheelPickerItemSelectedEvent extends Event<ReactWheelPickerItemSelectedEvent> {

    public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

    private final int mValue;

    protected ReactWheelPickerItemSelectedEvent(int viewTag, int value) {
        super(viewTag);
        mValue = value;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
    }

    private WritableMap serializeEventData() {
        WritableMap eventData = Arguments.createMap();
        eventData.putInt("data", mValue);
        return eventData;
    }
}