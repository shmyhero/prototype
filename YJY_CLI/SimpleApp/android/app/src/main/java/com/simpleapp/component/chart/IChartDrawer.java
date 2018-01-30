package com.simpleapp.component.chart;

import com.github.mikephil.charting.charts.CombinedChart;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Neko on 16/9/18.
 */
public interface IChartDrawer {
    void setBorderColor(int color);
    void setPreCloseColor(int color);
    void setTextColor(int color);

    void draw(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException;
}
