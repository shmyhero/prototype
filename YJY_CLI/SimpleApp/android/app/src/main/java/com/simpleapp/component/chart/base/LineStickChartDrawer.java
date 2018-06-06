package com.simpleapp.component.chart.base;

import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.github.mikephil.charting.formatter.IFillFormatter;
import com.github.mikephil.charting.interfaces.dataprovider.LineDataProvider;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.utils.Utils;
import com.simpleapp.R;
import com.simpleapp.component.chart.ChartDrawerConstants;
import com.simpleapp.component.chart.PriceChart;
import com.simpleapp.component.chart.linechart.LineChartMarkerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Neko on 2018/1/31.
 */
public abstract class LineStickChartDrawer extends BaseChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
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
                if(chartDataList.getJSONObject(i).has(getPriceKey())) {
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

    protected boolean needDrawLastCircle(CombinedChart chart){
        return false;
    }

    protected LineDataSet.Mode getDataSetMode(){
        return LineDataSet.Mode.LINEAR;
    }

    @Override
    protected CombinedData generateData(CombinedChart chart, final JSONObject stockInfoObject,final JSONArray chartDataList) throws JSONException{
        ArrayList<Entry> Vals = new ArrayList<Entry>();

        for (int i = 0; i < chartDataList.length(); i++) {
            float xVal = (float) (i);
            float yVal = (float) (chartDataList.getJSONObject(i).getDouble(getPriceKey()));
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


        // create a dataset and give it a type
        LineDataSet set1 = new LineDataSet(Vals, "DataSet 1");

        set1.setAxisDependency(YAxis.AxisDependency.RIGHT);
        set1.setColor(((PriceChart)chart).getDataSetColor());
        set1.setMode(getDataSetMode());

        int lineWidth = (int)Utils.convertPixelsToDp(((PriceChart)chart).getLineWidth());
        set1.setLineWidth(lineWidth);
        set1.setFillFormatter(new IFillFormatter() {
            @Override
            public float getFillLinePosition(ILineDataSet dataSet, LineDataProvider dataProvider) {
                return minVal;
            }
        });

        if(needDrawLastCircle(chart)) {
            int[] circleColors = {Color.TRANSPARENT};
            //We don't care if it's open any more...

            if (Vals.size() > 0 /*&& stockInfoObject.getBoolean("isOpen")*/) {
                circleColors = new int[Vals.size()];
                for (int i = 0; i < Vals.size(); i++) {
                    circleColors[i] = Color.TRANSPARENT;
                }
                circleColors[Vals.size() - 1] = 0x66FFFFFF & ((PriceChart) chart).getDataSetColor();
            }

            set1.setDrawCircles(true);
            set1.setCircleRadius(ChartDrawerConstants.CIRCLE_RADIUS_SHADOW);
            set1.setDrawCircleHole(true);
            set1.setCircleColorHole(((PriceChart)chart).getDataSetColor());
            set1.setCircleHoleRadius(ChartDrawerConstants.CIRCLE_RADIUS);
            set1.setCircleColors(circleColors);
        }else{
            set1.setDrawCircles(false);
        }

        chart.getXAxis().setValueFormatter(getXAxisLabelFormatter(chartDataList));

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

    public IAxisValueFormatter getXAxisLabelFormatter(final JSONArray chartDataList){
        return new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                try {
                    //String val = "2018-01-29T22:21:54.896Z";
                    String xVal = (chartDataList.getJSONObject((int) value).getString(getDateTimeKey()));
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
                    format.setTimeZone(TimeZone.getTimeZone("UTC"));
                    Date date = format.parse(xVal);
                    SimpleDateFormat outFormat = new SimpleDateFormat("HH:mm");
                    String outputString = outFormat.format(date);

                    return outputString;

                }catch(Exception e){
                    return "error";
                }
            }
        };
    }

    @Override
    public String getLableBlank() {
        return "          ";
    }


    public boolean needDrawDescription(CombinedChart chart){
        if(((PriceChart)chart).isLandspace())return false;
        return true;
    }
}
