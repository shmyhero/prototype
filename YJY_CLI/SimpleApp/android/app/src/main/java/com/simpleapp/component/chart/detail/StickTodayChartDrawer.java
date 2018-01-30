package com.simpleapp.component.chart.detail;

import com.github.mikephil.charting.charts.CombinedChart;
import com.simpleapp.component.chart.BaseChartDrawer;
import com.simpleapp.component.chart.LineStickChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;

/**
 * Created by Neko on 16/9/19.
 */
public class StickTodayChartDrawer extends LineStickChartDrawer {
    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    public int getGapLineUnit() {
        return Calendar.HOUR;
    }

    @Override
    protected int getGapLineUnitAddMount() {
        return 1;
    }

    @Override
    public boolean needDrawEndLine(JSONObject stockInfoObject) throws JSONException {
        return false;//!stockInfoObject.getBoolean("isOpen");
    }

    @Override
    protected void drawLimitLine(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        //Need draw no limit line in this mode.
    }
}

