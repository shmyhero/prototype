package com.simpleapp.component.chart;

import android.content.Context;
import android.graphics.Canvas;
import android.view.MotionEvent;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.IDataSet;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.simpleapp.component.chart.base.CustomCombinedChartRenderer;
import com.simpleapp.component.chart.base.CustomXAxisRenderer;
import com.simpleapp.component.chart.base.CustomYAxisRenderer;
import com.simpleapp.component.chart.linechart.LongTouchHighlightLineChartTouchListener;

/**
 * Created by Neko on 2018/1/29.
 */
public class PriceChart extends CombinedChart {
//    public boolean isAcutal = false;


    boolean drawDataUnderYAxis = false;
    public PriceChart(Context context) {
        super(context);
    }

    @Override
    protected void init() {

        mViewPortHandler = new ViewPortHandler() {
            @Override
            public boolean isInBoundsRight(float x) {
                if(drawDataUnderYAxis) {
                    x = (float) ((int) (x * 100.f)) / 100.f;
                    return getWidth() >= x - 1;
                } else {
                    return super.isInBoundsRight(x);
                }
            }
        };

        super.init();

        mChartTouchListener = new LongTouchHighlightLineChartTouchListener(this, mViewPortHandler.getMatrixTouch(), 3f);

        mXAxisRenderer = new CustomXAxisRenderer(getContext(), mViewPortHandler, mXAxis, mLeftAxisTransformer);
        mAxisRendererRight = new CustomYAxisRenderer(getContext(), mViewPortHandler, mAxisRight, mRightAxisTransformer);
        mRenderer = new CustomCombinedChartRenderer(this, mAnimator, mViewPortHandler);
        //((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(Color.rgb(240, 240, 240)); // light
    }

    public void setDrawDataUnderYAxis(boolean value){
        this.drawDataUnderYAxis = value;
        ((CustomCombinedChartRenderer)mRenderer).setDrawDataUnderYAxis(value);
    }

    @Override
    protected void onDraw(Canvas canvas) {

        if (mData == null)
            return;

        long starttime = System.currentTimeMillis();

        // execute all drawing commands
        drawGridBackground(canvas);

        if (mAutoScaleMinMaxEnabled) {
            autoScale();
        }

        if (mAxisLeft.isEnabled())
            mAxisRendererLeft.computeAxis(mAxisLeft.mAxisMinimum, mAxisLeft.mAxisMaximum, mAxisLeft.isInverted());

        if (mAxisRight.isEnabled())
            mAxisRendererRight.computeAxis(mAxisRight.mAxisMinimum, mAxisRight.mAxisMaximum, mAxisRight.isInverted());

        if (mXAxis.isEnabled())
            mXAxisRenderer.computeAxis(mXAxis.mAxisMinimum, mXAxis.mAxisMaximum, false);

        mXAxisRenderer.renderAxisLine(canvas);
        mAxisRendererLeft.renderAxisLine(canvas);
        mAxisRendererRight.renderAxisLine(canvas);

        mXAxisRenderer.renderGridLines(canvas);
        mAxisRendererLeft.renderGridLines(canvas);
        mAxisRendererRight.renderGridLines(canvas);

        if (mXAxis.isEnabled() && mXAxis.isDrawLimitLinesBehindDataEnabled())
            mXAxisRenderer.renderLimitLines(canvas);

        if (mAxisLeft.isEnabled() && mAxisLeft.isDrawLimitLinesBehindDataEnabled())
            mAxisRendererLeft.renderLimitLines(canvas);

        if (mAxisRight.isEnabled() && mAxisRight.isDrawLimitLinesBehindDataEnabled())
            mAxisRendererRight.renderLimitLines(canvas);

        int clipRestoreCount = 0;
        if(!drawDataUnderYAxis){
            // make sure the data cannot be drawn outside the content-rect
            clipRestoreCount = canvas.save();
            canvas.clipRect(mViewPortHandler.getContentRect());
        }

        mRenderer.drawData(canvas);

        // if highlighting is enabled
        if (valuesToHighlight())
            mRenderer.drawHighlighted(canvas, mIndicesToHighlight);

        if(!drawDataUnderYAxis) {
            // Removes clipping rectangle
            canvas.restoreToCount(clipRestoreCount);
        }


        if (mXAxis.isEnabled() && !mXAxis.isDrawLimitLinesBehindDataEnabled())
            mXAxisRenderer.renderLimitLines(canvas);

        if (mAxisLeft.isEnabled() && !mAxisLeft.isDrawLimitLinesBehindDataEnabled())
            mAxisRendererLeft.renderLimitLines(canvas);

        if (mAxisRight.isEnabled() && !mAxisRight.isDrawLimitLinesBehindDataEnabled())
            mAxisRendererRight.renderLimitLines(canvas);

        mXAxisRenderer.renderAxisLabels(canvas);
        mAxisRendererLeft.renderAxisLabels(canvas);
        mAxisRendererRight.renderAxisLabels(canvas);

        if (isClipValuesToContentEnabled()) {
            if(!drawDataUnderYAxis){
                clipRestoreCount = canvas.save();
                canvas.clipRect(mViewPortHandler.getContentRect());
            }

            mRenderer.drawValues(canvas);

            if(!drawDataUnderYAxis) {
                canvas.restoreToCount(clipRestoreCount);
            }
        } else {
            mRenderer.drawValues(canvas);
        }

        mRenderer.drawExtras(canvas);

        mLegendRenderer.renderLegend(canvas);

        drawDescription(canvas);

        drawMarkers(canvas);
    }

    int[] gradientColors;
    public void setGradientColors(int[] colors){
        gradientColors = colors;
    }

    public int[] getGradientColors(){
        return gradientColors;
    }

    int dataSetColor;

    public void setDataSetColor(int color){
        dataSetColor = color;
    }

    public int getDataSetColor(){
        return dataSetColor;
    }

    public void setxAxisBackground(int color){
        ((CustomXAxisRenderer)mXAxisRenderer).setBackgroundColor(color);
    }

    public void setXAxisPaddingTop(int value){
        ((CustomXAxisRenderer)mXAxisRenderer).setPaddingTop(value);
    }

    public void setXAxisPaddingBottom(int value){
        ((CustomXAxisRenderer)mXAxisRenderer).setPaddingBottom(value);
    }
//
//
////
////    public void setXAxisPaddingLeft(int value){
////        ((ReactXAxisRenderer)mXAxisRenderer).setHorizontalPaddingLeft(value);
////    }
////
////    public void setXAxisPaddingRight(int value){
////        ((ReactXAxisRenderer)mXAxisRenderer).setHorizontalPaddingRight(value);
////    }

//    protected int preCloseColor = 0;
//    public void setPreCloseColor(int value){
//        preCloseColor = value;
//        invalidate();
//    }
//
//    public int getPreCloseColor(){
//        return preCloseColor;
//    }
//
    boolean isLandspace = false;
    public boolean isLandspace(){
        return isLandspace;
    }
    public void setOritentation(boolean isLandspace){
        this.isLandspace = isLandspace;
    }

    private boolean isPrivate = false;
    public boolean isPrivate(){return isPrivate;}
    public void setIsPrivate(boolean isPrivate){
        this.isPrivate = isPrivate;
    }

    /**
     * draws all MarkerViews on the highlighted positions
     */
    protected void drawMarkers(Canvas canvas) {

        // if there is no marker view or drawing marker is disabled
        if (mMarker == null || !isDrawMarkersEnabled() || !valuesToHighlight())
            return;

        for (int i = 0; i < mIndicesToHighlight.length; i++) {

            Highlight highlight = mIndicesToHighlight[i];

            IDataSet set = mData.getDataSetByHighlight(highlight);

            Entry e = mData.getEntryForHighlight(highlight);
            if (e == null)
                continue;

            int entryIndex = set.getEntryIndex(e);

            // make sure entry not null
            if (entryIndex > set.getEntryCount() * mAnimator.getPhaseX())
                continue;

            float[] pos = getMarkerPosition(highlight);

            // check bounds
            if (!mViewPortHandler.isInBounds(pos[0], pos[1]))
                continue;

            // callbacks to update the content
            mMarker.refreshContent(e, highlight);

            // draw the marker
            mMarker.draw(canvas, pos[0], pos[1]);
        }
    }
}
