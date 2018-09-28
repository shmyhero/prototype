package com.tradegame.component.chart.base;

import android.graphics.Canvas;

import com.github.mikephil.charting.animation.ChartAnimator;
import com.github.mikephil.charting.charts.Chart;
import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.ChartData;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.renderer.BarChartRenderer;
import com.github.mikephil.charting.renderer.BubbleChartRenderer;
import com.github.mikephil.charting.renderer.CandleStickChartRenderer;
import com.github.mikephil.charting.renderer.CombinedChartRenderer;
import com.github.mikephil.charting.renderer.DataRenderer;
import com.github.mikephil.charting.renderer.LineChartRenderer;
import com.github.mikephil.charting.renderer.LineRadarRenderer;
import com.github.mikephil.charting.renderer.ScatterChartRenderer;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.tradegame.component.chart.linechart.BigDotLineChartRenderer;

import static com.github.mikephil.charting.charts.CombinedChart.DrawOrder.CANDLE;

/**
 * Created by Neko on 2018/1/31.
 */

public class CustomCombinedChartRenderer extends CombinedChartRenderer {
    public CustomCombinedChartRenderer(CombinedChart chart, ChartAnimator animator, ViewPortHandler viewPortHandler) {
        super(chart, animator, viewPortHandler);
    }

    public void createRenderers() {
        //!!!Use Custom Line chart view!!!

        mRenderers.clear();

        CombinedChart chart = (CombinedChart)mChart.get();
        if (chart == null)
            return;

        CombinedChart.DrawOrder[] orders = chart.getDrawOrder();

        for (CombinedChart.DrawOrder order : orders) {

            switch (order) {
                case BAR:
                    if (chart.getBarData() != null)
                        mRenderers.add(new BarChartRenderer(chart, mAnimator, mViewPortHandler));
                    break;
                case BUBBLE:
                    if (chart.getBubbleData() != null)
                        mRenderers.add(new BubbleChartRenderer(chart, mAnimator, mViewPortHandler));
                    break;
                case LINE:
                    if (chart.getLineData() != null) {
                        BigDotLineChartRenderer renderer = new BigDotLineChartRenderer(chart.getContext(), chart, mAnimator, mViewPortHandler);
                        renderer.setDrawDataUnderYAxis(drawDataUnderYAxis);

//                        LineChartRenderer renderer = new LineChartRenderer(chart, mAnimator, mViewPortHandler);
                        mRenderers.add(renderer);
                    }
                    break;
                case CANDLE:
                    if (chart.getCandleData() != null)
                        mRenderers.add(new CandleStickChartRenderer(chart, mAnimator, mViewPortHandler));
                    break;
                case SCATTER:
                    if (chart.getScatterData() != null)
                        mRenderers.add(new ScatterChartRenderer(chart, mAnimator, mViewPortHandler));
                    break;
            }
        }
    }

    @Override
    public void drawHighlighted(Canvas c, Highlight[] indices) {

        Chart chart = mChart.get();
        if (chart == null) return;

        for (DataRenderer renderer : mRenderers) {
            ChartData data = null;

//            if (renderer instanceof BarChartRenderer)
//                data = ((BarChartRenderer)renderer).mChart.getBarData();
//            else if (renderer instanceof LineChartRenderer)
//                data = ((LineChartRenderer)renderer).mChart.getLineData();
//            else if (renderer instanceof BigDotLineChartRenderer)
//                data = ((BigDotLineChartRenderer)renderer).mChart.getLineData();
//            else if (renderer instanceof CandleStickChartRenderer)
//                data = ((CandleStickChartRenderer)renderer).mChart.getCandleData();
//            else if (renderer instanceof ScatterChartRenderer)
//                data = ((ScatterChartRenderer)renderer).mChart.getScatterData();
//            else if (renderer instanceof BubbleChartRenderer)
//                data = ((BubbleChartRenderer)renderer).mChart.getBubbleData();
//
//            data = chart.getData();
//
//            int dataIndex = data == null ? -1
//                    : ((CombinedData)chart.getData()).getAllData().indexOf(data);

            //We have only one data set for now...
            int dataIndex = 0;

            mHighlightBuffer.clear();

            for (Highlight h : indices) {
                if (h.getDataIndex() == dataIndex || h.getDataIndex() == -1)
                    mHighlightBuffer.add(h);
            }

            renderer.drawHighlighted(c, mHighlightBuffer.toArray(new Highlight[mHighlightBuffer.size()]));
        }
    }

    boolean drawDataUnderYAxis = false;
    public void setDrawDataUnderYAxis(boolean value) {
        drawDataUnderYAxis = value;
        for (DataRenderer renderer : mRenderers) {

            if (renderer instanceof BigDotLineChartRenderer) {
                ((BigDotLineChartRenderer) renderer).setDrawDataUnderYAxis(value);
            }
        }
    }
}
