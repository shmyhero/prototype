package com.simpleapp.component.chart.base;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.simpleapp.R;
import com.simpleapp.component.chart.PriceChart;
import com.simpleapp.component.chart.linechart.LineChartMarkerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Neko on 2018/1/31.
 */
public abstract class LineStickChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(true);

        LineChartMarkerView marker = new LineChartMarkerView(chart.getContext(), R.layout.view_line_chart_marker);
        chart.setMarker(marker);
    }

    protected Drawable getGradientDrawable(int[] colors){
        GradientDrawable gradient = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, colors);
        gradient.setShape(GradientDrawable.RECTANGLE);
        return gradient;
    }


    @Override
    protected boolean isDataAcceptable(JSONArray chartDataList){
        try {
            for (int i = 0; i < chartDataList.length(); i++) {
                if(chartDataList.getJSONObject(i).has("p")) {
                    return true;
                }
                else{
                    return false;
                }
            }
        }catch (Exception e){
            return false;
        }
        return true;
    }

    @Override
    protected CombinedData generateData(CombinedChart chart, final JSONObject stockInfoObject,final JSONArray chartDataList) throws JSONException{
        ArrayList<Entry> Vals = new ArrayList<Entry>();

        for (int i = 0; i < chartDataList.length(); i++) {
            float xVal = (float) (i);
            float yVal = (float) (chartDataList.getJSONObject(i).getDouble("p"));
            if (yVal > maxVal) {
                maxVal = yVal;
            }
            if (yVal < minVal) {
                minVal = yVal;
            }
            Vals.add(new Entry(xVal, yVal));
        }

        if(needDrawPreCloseLine()) {
            minVal = Math.min(minVal, (float) stockInfoObject.getDouble("preClose"));
            maxVal = Math.max(maxVal, (float) stockInfoObject.getDouble("preClose"));
        }

        minVal -= (maxVal - minVal) / 5;
        maxVal += (maxVal - minVal) / 5;

        formatRightAxisText(chart, maxVal, minVal);

        int[] circleColors = {Color.TRANSPARENT};
        //We don't care if it's open any more...
        if (Vals.size() > 0 /*&& stockInfoObject.getBoolean("isOpen")*/) {
            circleColors = new int[Vals.size()];
            for (int i = 0; i < Vals.size(); i++) {
                circleColors[i] = Color.TRANSPARENT;
            }
            circleColors[Vals.size() - 1] = 0x66FFFFFF & ((PriceChart)chart).getDataSetColor();
        }

        // create a dataset and give it a type
        LineDataSet set1 = new LineDataSet(Vals, "DataSet 1");
        // set1.setFillAlpha(110);
        // set1.setFillColor(Color.RED);

        // set the line to be drawn like this "- - - - - -"
        //set1.enableDashedLine(10f, 0f, 0f);

        set1.setColor(((PriceChart)chart).getDataSetColor());
        set1.setLineWidth(2);
        //set1.setLineWidth(ChartDrawerConstants.LINE_WIDTH_PRICE);
        set1.setDrawCircles(true);
        set1.setCircleRadius(18);
        set1.setDrawCircleHole(true);
        set1.setCircleColorHole(((PriceChart)chart).getDataSetColor());
        set1.setCircleHoleRadius(8);
        set1.setCircleColors(circleColors);
        //set1.setValueTextSize(0f);
//        boolean isActual = false;
//        try {
//            isActual = ((ReactChart) chart).isAcutal;
//        } catch (Exception e) {
//            Log.e("", e.toString());
//        }

        chart.getXAxis().setValueFormatter(new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                try {
                    //String val = "2018-01-29T22:21:54.896Z";
                    String xVal = (chartDataList.getJSONObject((int) value).getString("time"));
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    Date date = format.parse(xVal);
                    SimpleDateFormat outFormat = new SimpleDateFormat("HH:mm");
                    String outputString = outFormat.format(date);

                    return outputString;

                }catch(Exception e){
                    return "error";
                }
            }
        });

        Drawable drawable = getGradientDrawable(((PriceChart)chart).getGradientColors());

        set1.setFillDrawable(drawable);
        set1.setDrawFilled(true);


        set1.setHighlightEnabled(true); // allow highlighting for DataSet

        // set this to false to disable the drawing of highlight indicator (lines)
        set1.setDrawHighlightIndicators(true);
        set1.setHighLightColor(Color.WHITE);

        LineData d = new LineData();
        d.addDataSet(set1);

        CombinedData data = new CombinedData();
        data.setData(d);
        return data;
    }


    @Override
    public String getLableBlank() {
        return "          ";
    }


    public boolean needDrawDescription(CombinedChart chart){
        if(((PriceChart)chart).isLandspace())return false;
        return true;
    }

    @Override
    protected void calculateZoom(CombinedChart chart, CombinedData data) {
        //chart.setVisibleXRangeMinimum(10f);
        //chart.setVisibleXRangeMaximum(10f);

        //chart.setVisibleYRangeMinimum(1, YAxis.AxisDependency.LEFT);
        //chart.setVisibleYRangeMaximum(1, YAxis.AxisDependency.LEFT);

        //We only have one dataset.
        int totalSize = chart.getData().getDataSetByIndex(0).getEntryCount();
        float scale = 2;
        int xOffset = (int)(totalSize - totalSize / scale);
        chart.zoom(scale, 1, totalSize, 0);
        chart.moveViewToX(xOffset);
//        if (needDrawDescription(chart) && preClose != 0) {
//            float maxPrice = data.getYMax();
//            float minPrice = data.getYMin();
//            float maxPercentage = (maxPrice - preClose) / preClose * 100;
//            float minPercentage = (minPrice - preClose) / preClose * 100;
//            setDescription(chart, StringUtils.formatNumber(maxPrice), StringUtils.formatNumber(minPrice), StringUtils.formatNumber(maxPercentage) + "%", StringUtils.formatNumber(minPercentage) + "%");
//        } else {
//            setDescription(chart, "", "", "", "");
//        }
//
//        if(!needDrawDescription(chart)){
//            setDescription(chart, "", "", "", "");
//        }

    }
}
