package com.simpleapp.component.chart.detail;

import android.graphics.Color;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.simpleapp.R;
import com.simpleapp.component.chart.ChartDrawerConstants;
import com.simpleapp.component.chart.base.LineStickChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Created by Neko on 2018/1/31.
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
        //Only draw a limit line.

        LimitLine line = new LimitLine((float) stockInfoObject.getDouble("last"));
//      line.setLineColor(ChartDrawerConstants.CHART_LINE_COLOR);
        line.setLineColor(chart.getContext().getResources().getColor(R.color.line_chart_last_price_blue));
//        line.setLineColor(mDesColorType==0?ChartDrawerConstants.CHART_LINE_COLOR:ChartDrawerConstants.CHART_LINE_COLOR2);

        line.setLineWidth(ChartDrawerConstants.LINE_WIDTH * 2);
        line.setTextSize(0f);

        //Left Axis is disabled. Use Right one.
        chart.getAxisRight().addLimitLine(line);

        //super.drawLimitLine(chart, stockInfoObject, chartDataList);
    }
}

