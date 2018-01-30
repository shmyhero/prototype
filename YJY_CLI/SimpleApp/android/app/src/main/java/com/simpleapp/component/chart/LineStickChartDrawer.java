package com.simpleapp.component.chart;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.simpleapp.StringUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Neko on 16/9/19.
 */
public abstract class LineStickChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
//        chart.setDragEnabled(true);
//        chart.setScaleEnabled(false);
        //chart.setTouchEnabled(!((PriceChart)chart).isLandspace());
//        chart.setTouchEnabled(!MainActivity.isLandscape());
    }

    protected Drawable getGradientDrawable(int[] colors){
        GradientDrawable gradient = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, colors);
        gradient.setShape(GradientDrawable.RECTANGLE);
        //gradient.setShape(GradientDrawable.RECTANGLE);
        //gradient.setCornerRadius(0);
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
    protected CombinedData generateData(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {

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
        if (Vals.size() > 0 && stockInfoObject.getBoolean("isOpen")) {
            circleColors = new int[Vals.size()];
            for (int i = 0; i < Vals.size(); i++) {
                circleColors[i] = Color.TRANSPARENT;
            }
            circleColors[Vals.size() - 1] = ((PriceChart)chart).getDataSetColor();
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
        set1.setCircleRadius(12);
        set1.setDrawCircleHole(false);
        set1.setCircleColors(circleColors);
        //set1.setValueTextSize(0f);
//        boolean isActual = false;
//        try {
//            isActual = ((ReactChart) chart).isAcutal;
//        } catch (Exception e) {
//            Log.e("", e.toString());
//        }

        Drawable drawable = getGradientDrawable(((PriceChart)chart).getGradientColors());

        set1.setFillDrawable(drawable);
        set1.setDrawFilled(true);

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
        chart.setVisibleXRangeMinimum(1);
        if (needDrawDescription(chart) && preClose != 0) {
            float maxPrice = data.getYMax();
            float minPrice = data.getYMin();
            float maxPercentage = (maxPrice - preClose) / preClose * 100;
            float minPercentage = (minPrice - preClose) / preClose * 100;
            setDescription(chart, StringUtils.formatNumber(maxPrice), StringUtils.formatNumber(minPrice), StringUtils.formatNumber(maxPercentage) + "%", StringUtils.formatNumber(minPercentage) + "%");
        } else {
            setDescription(chart, "", "", "", "");
        }

        if(!needDrawDescription(chart)){
            setDescription(chart, "", "", "", "");
        }

    }
}
