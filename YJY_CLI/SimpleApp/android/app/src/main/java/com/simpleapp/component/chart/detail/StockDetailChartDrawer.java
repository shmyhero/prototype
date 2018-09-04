package com.simpleapp.component.chart.detail;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.view.Display;
import android.view.WindowManager;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.utils.Utils;
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
 * Draws the chart displays on stock detail page.
 */
public class StockDetailChartDrawer extends LineStickChartDrawer {
    boolean isScaleSet = false;

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);

        chart.setDrawMarkers(true);
        ((PriceChart)chart).setDrawDataUnderYAxis(true);

        chart.setDragEnabled(true);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(true);

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
        return false;//true;
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
    public void calculateZoom(CombinedChart chart, JSONArray chartDataList) {
        //Make sure this function only be called once.只触发一次，在初始化第一次显示的时候

        if(isScaleSet){
            return;
        }else {
            isScaleSet = true;
        }

        int totalSize = chartDataList.length();

        float dotDistance = 10;
        float scale = 2;
        int width = chart.getWidth();
        if(width > 0) {
            scale = dotDistance * totalSize / chart.getWidth();
        }else{
            WindowManager wm = (WindowManager) chart.getContext().getSystemService(Context.WINDOW_SERVICE);
            Display display = wm.getDefaultDisplay();
            Point size = new Point();
            display.getSize(size);
            width = size.x;
            scale = dotDistance * totalSize / width;
        }
        int xOffset = (int)(totalSize - totalSize / scale);

        ((PriceChart)chart).nolimitZoom(scale, 1, width, 0);
//        chart.moveViewToAnimated(totalSize, 0, YAxis.AxisDependency.LEFT,500);
    }


    //getPriceKey 和 getDateTimeKey 由于在不同接口的数据未做
    @Override
    public String getPriceKey(){
        return "p";
    }

    @Override
    public String getDateTimeKey(){
        return "t";
    }

    @Override
    protected CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {

        //generateData过程中创建Market
        LineChartMarkerView marker = new LineChartMarkerView(chart.getContext(), R.layout.view_line_chart_marker, chartDataList, getDateTimeKey());
        chart.setMarker(marker);

        return super.generateData(chart, stockInfoObject, chartDataList);
    }
}

