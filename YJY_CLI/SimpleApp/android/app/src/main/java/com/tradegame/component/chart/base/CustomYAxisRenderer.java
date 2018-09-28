package com.tradegame.component.chart.base;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;

import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.renderer.YAxisRenderer;
import com.github.mikephil.charting.utils.MPPointD;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.Utils;
import com.github.mikephil.charting.utils.ViewPortHandler;

/**
 * Created by Neko on 2018/1/31.
 */

public class CustomYAxisRenderer extends YAxisRenderer {

    protected int paddingLeft = 15;
    protected int paddingRight = 15;

    protected Paint mBackgroundPaint;
    public CustomYAxisRenderer(Context context, ViewPortHandler viewPortHandler, YAxis yAxis, Transformer trans) {
        super(viewPortHandler, yAxis, trans);
    }

    @Override
    public RectF getGridClippingRect() {
        mGridClippingRect.set(mViewPortHandler.getContentRect());
        mGridClippingRect.inset(0.f, -mAxis.getGridLineWidth() - paddingLeft - paddingRight);
        return mGridClippingRect;
    }

    @Override
    protected void drawYLabels(Canvas c, float fixedPosition, float[] positions, float offset) {
        super.drawYLabels(c, fixedPosition, positions, offset);
    }

    /**
     * draws the y-axis labels to the screen
     */
    @Override
    public void renderAxisLabels(Canvas c) {

        //Remove Do not display the labels if there's only 2 or less labels.
        //BUGBUG: What should we do if we want 2 labels ?!
        if(mYAxis.getLabelCount() == 2){
            return;
        }

        if (!mYAxis.isEnabled() || !mYAxis.isDrawLabelsEnabled())
            return;

        float[] positions = getTransformedPositions();

        mAxisLabelPaint.setTypeface(mYAxis.getTypeface());
        mAxisLabelPaint.setTextSize(mYAxis.getTextSize());
        mAxisLabelPaint.setColor(mYAxis.getTextColor());

        float xoffset = mYAxis.getXOffset();
        float yoffset = Utils.calcTextHeight(mAxisLabelPaint, "A") / 2.5f + mYAxis.getYOffset();

        YAxis.AxisDependency dependency = mYAxis.getAxisDependency();
        YAxis.YAxisLabelPosition labelPosition = mYAxis.getLabelPosition();

        float xPos = 0f;

        if (dependency == YAxis.AxisDependency.LEFT) {

            if (labelPosition == YAxis.YAxisLabelPosition.OUTSIDE_CHART) {
                mAxisLabelPaint.setTextAlign(Paint.Align.RIGHT);
                xPos = mViewPortHandler.offsetLeft() - xoffset;
            } else {
                mAxisLabelPaint.setTextAlign(Paint.Align.LEFT);
                xPos = mViewPortHandler.offsetLeft() + xoffset;
            }

        } else {

            if (labelPosition == YAxis.YAxisLabelPosition.OUTSIDE_CHART) {
                mAxisLabelPaint.setTextAlign(Paint.Align.LEFT);
                xPos = mViewPortHandler.contentRight() + xoffset;
            } else {
                mAxisLabelPaint.setTextAlign(Paint.Align.RIGHT);
                xPos = mViewPortHandler.contentRight() - xoffset;
            }
        }

        drawYLabels(c, xPos, positions, yoffset);
    }

//    @Override
//    public void setLabelCount(int count) {
//
//        if (count > 25)
//            count = 25;
//        if (count < 2)
//            count = 2;
//
//        mLabelCount = count;
//        mForceLabels = false;
//    }



    //    @Override
//    public void computeAxis(float min, float max, boolean inverted) {
//
//        // calculate the starting and entry point of the y-labels (depending on
//        // zoom / contentrect bounds)
//        if (mViewPortHandler != null && mViewPortHandler.contentWidth() > 10 && !mViewPortHandler.isFullyZoomedOutY()) {
//
//            MPPointD p1 = mTrans.getValuesByTouchPoint(mViewPortHandler.contentLeft(), mViewPortHandler.contentTop());
//            MPPointD p2 = mTrans.getValuesByTouchPoint(mViewPortHandler.contentLeft(), mViewPortHandler.contentBottom());
//
//            if (!inverted) {
//
//                min = (float) p2.y;
//                max = (float) p1.y;
//            } else {
//
//                min = (float) p1.y;
//                max = (float) p2.y;
//            }
//
//            MPPointD.recycleInstance(p1);
//            MPPointD.recycleInstance(p2);
//        }
//
//        computeAxisValues(min, max);
//    }
}
