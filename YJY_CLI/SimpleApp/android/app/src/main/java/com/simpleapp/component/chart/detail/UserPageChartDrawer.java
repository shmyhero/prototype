package com.simpleapp.component.chart.detail;

import android.graphics.Color;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.simpleapp.R;
import com.simpleapp.component.chart.PriceChart;
import com.simpleapp.component.chart.base.LineStickChartDrawer;
import com.simpleapp.component.chart.linechart.LineChartMarkerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Neko on 2018/2/2.
 * Draws the chart displays on user page.
 */

public class UserPageChartDrawer extends LineStickChartDrawer {

    @Override
    protected void resetChart(CombinedChart chart) {
        super.resetChart(chart);
        ((PriceChart)chart).setDrawDataUnderYAxis(true);

        chart.setDragEnabled(false);
        chart.setScaleEnabled(false);
        chart.setTouchEnabled(false);

        chart.getAxisLeft().setDrawLimitLinesBehindData(true);
        chart.getAxisRight().setDrawLimitLinesBehindData(true);
    }

    @Override
    protected boolean needDrawLastCircle(CombinedChart chart) {
        return false;
    }

    @Override
    protected LineDataSet.Mode getDataSetMode(){
        return LineDataSet.Mode.CUBIC_BEZIER;
    }

    @Override
    protected void drawLimitLine(CombinedChart chart, JSONObject stockInfoObject, JSONArray chartDataList) throws JSONException {
        int lineCounts = chart.getAxisRight().getLabelCount() - 1;
        float maxValue = chart.getAxisRight().getAxisMaximum();
        float minValue = chart.getAxisRight().getAxisMinimum();
        float step = ( maxValue - minValue )/ lineCounts ;
        for (int i = 0; i < lineCounts; i++) {
            float value = minValue + i * step;
            LimitLine line = new LimitLine(value);
            line.setLineColor(borderColor);
            line.setLineWidth(0.5f);
            //line.setLabel("" + value);
            chart.getAxisRight().setPosition(YAxis.YAxisLabelPosition.OUTSIDE_CHART);
            chart.getAxisRight().setCenterAxisLabels(true);
            chart.getAxisRight().addLimitLine(line);
        }
    }

    @Override
    public String getDateTimeKey() {
        return "date";
    }

    @Override
    public String getPriceKey() {
        return "pl";
    }


    public IAxisValueFormatter getXAxisLabelFormatter(final JSONArray chartDataList){
        return new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                try {
                    //String val = "2018-01-29T22:21:54.896Z";
                    String xVal = (chartDataList.getJSONObject((int) value).getString(getDateTimeKey()));
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    format.setTimeZone(TimeZone.getTimeZone("UTC"));
                    Date date = format.parse(xVal);
                    SimpleDateFormat outFormat = new SimpleDateFormat("MM-dd");
                    String outputString = outFormat.format(date);

                    return outputString;

                }catch(Exception e){
                    return "error";
                }
            }
        };
    }
}
