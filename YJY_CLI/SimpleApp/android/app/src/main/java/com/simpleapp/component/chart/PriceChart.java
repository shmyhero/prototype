package com.simpleapp.component.chart;

import android.content.Context;
import android.graphics.Canvas;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.simpleapp.component.chart.base.CustomCombinedChartRenderer;
import com.simpleapp.component.chart.base.CustomXAxisRenderer;
import com.simpleapp.component.chart.base.CustomYAxisRenderer;

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


//        if (mLogEnabled) {
//            long drawtime = (System.currentTimeMillis() - starttime);
//            totalTime += drawtime;
//            drawCycles += 1;
//            long average = totalTime / drawCycles;
//            Log.i(LOG_TAG, "Drawtime: " + drawtime + " ms, average: " + average + " ms, cycles: "
//                    + drawCycles);
//        }
//        super.onDraw(canvas);
//        mRenderer.drawExtras(canvas);
////        if (mXAxis.isDrawLimitLinesBehindDataEnabled())
////            mXAxisRenderer.renderLimitLines(canvas);

    }
//
////    public void setGridBackgroundColor(int color) {
////        super.setGridBackgroundColor(color);
//////        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(color);
//////        ((ReactYAxisRenderer)mAxisRendererLeft).setBackgroundColor(color);
//////        ((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(color);
////    }
//
////    @Override
////    public void setData(CombinedData data) {
////        mData = null;
////        mRenderer = null;
////        super.setData(data);
////        mRenderer = new ReactCombinedChartRenderer(this, mAnimator, mViewPortHandler);
////        mRenderer.initBuffers();
////    }
//
////
////    @Override
////    protected void drawGridBackground(Canvas c) {
////        super.drawGridBackground(c);
////
////        if (mDrawGridBackground) {
////
////            // draw the grid background
////            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
////            new_Background.left = mViewPortHandler.getContentRect().right;
////            new_Background.right = c.getWidth();
////            c.drawRect(new_Background, mGridBackgroundPaint);
////        }
////
////        if (mDrawBorders) {
////            c.drawRect(mViewPortHandler.getContentRect(), mBorderPaint);
////        }
////    }
//
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
}
