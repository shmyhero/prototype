package com.simpleapp.component.chart.detail;

import android.graphics.Color;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.data.CombinedData;
import com.simpleapp.R;
import com.simpleapp.component.chart.ChartDrawerConstants;
import com.simpleapp.component.chart.PriceChart;
import com.simpleapp.component.chart.base.CustomXAxisRenderer;
import com.simpleapp.component.chart.base.LineStickChartDrawer;
import com.simpleapp.component.chart.linechart.LineChartMarkerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 2018/1/31.
 */
public class StockDetailChartDrawer extends LineStickChartDrawer {
    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        ((PriceChart)chart).setDrawDataUnderYAxis(true);

        chart.setDragEnabled(true);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(true);

        LineChartMarkerView marker = new LineChartMarkerView(chart.getContext(), R.layout.view_line_chart_marker);
        chart.setMarker(marker);
    }

    @Override
    public boolean needDrawPreCloseLine() {
        return false;
    }

    @Override
    protected boolean needDrawLastCircle(CombinedChart chart) {
        return true;
    }

    @Override
    protected boolean needDrawLastPriceLine() {
        return true;
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
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        int totalSize = chart.getData().getDataSetByIndex(0).getEntryCount();
        float scale = 2;
        int xOffset = (int)(totalSize - totalSize / scale);
        //int xOffset2 = (int)(totalSize * scale);
        chart.zoom(scale, 1, xOffset, 0);
        chart.moveViewToX(xOffset);
    }
}

