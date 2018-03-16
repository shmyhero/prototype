package com.simpleapp.component.chart.base;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;

import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.renderer.XAxisRenderer;
import com.github.mikephil.charting.utils.FSize;
import com.github.mikephil.charting.utils.MPPointF;
import com.github.mikephil.charting.utils.Transformer;
import com.github.mikephil.charting.utils.Utils;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.simpleapp.R;

/**
 * Created by Neko on 2018/1/31.
 */

public class CustomXAxisRenderer extends XAxisRenderer {
    protected Paint mBackgroundPaint = null;
    protected int paddingTop = 15;
    protected int paddingBottom = 15;
    public CustomXAxisRenderer(Context context, ViewPortHandler viewPortHandler, XAxis xAxis, Transformer trans) {
        super(viewPortHandler, xAxis, trans);
    }

    public void setBackgroundColor(int color){
        mBackgroundPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBackgroundPaint.setColor(color);
        mBackgroundPaint.setStyle(Paint.Style.FILL);
    }

    public void setPaddingTop(int value){
        paddingTop = value;
    }

    public void setPaddingBottom(int value){
        paddingBottom = value;
    }

    @Override
    protected void computeSize() {

        String longest = mXAxis.getLongestLabel();

        mAxisLabelPaint.setTypeface(mXAxis.getTypeface());
        mAxisLabelPaint.setTextSize(mXAxis.getTextSize());

        final FSize labelSize = Utils.calcTextSize(mAxisLabelPaint, longest);

        final float labelWidth = labelSize.width;
        final float labelHeight = paddingTop + paddingBottom + Utils.calcTextHeight(mAxisLabelPaint, "Q");

        final FSize labelRotatedSize = Utils.getSizeOfRotatedRectangleByDegrees(
                labelWidth,
                labelHeight,
                mXAxis.getLabelRotationAngle());

        mXAxis.mLabelWidth = Math.round(labelWidth);
        mXAxis.mLabelHeight = Math.round(labelHeight);
        mXAxis.mLabelRotatedWidth = Math.round(labelRotatedSize.width);
        mXAxis.mLabelRotatedHeight = Math.round(labelRotatedSize.height);

        FSize.recycleInstance(labelRotatedSize);
        FSize.recycleInstance(labelSize);
    }


    @Override
    public void renderLimitLines(Canvas c) {
        if(mBackgroundPaint != null) {
            RectF rect = new RectF();
            rect.left = mViewPortHandler.getContentRect().left;
            rect.right = c.getWidth();
            rect.top = mViewPortHandler.getContentRect().bottom;
            rect.bottom = c.getHeight();
            c.drawRect(rect, mBackgroundPaint);
        }
        super.renderLimitLines(c);
    }


    @Override
    public void renderAxisLabels(Canvas c) {

        if (!mXAxis.isEnabled() || !mXAxis.isDrawLabelsEnabled())
            return;

        float yoffset = mXAxis.getYOffset();

        mAxisLabelPaint.setTypeface(mXAxis.getTypeface());
        mAxisLabelPaint.setTextSize(mXAxis.getTextSize());
        mAxisLabelPaint.setColor(mXAxis.getTextColor());

        MPPointF pointF = MPPointF.getInstance(0,0);
        if (mXAxis.getPosition() == XAxis.XAxisPosition.TOP) {
            pointF.x = 0.5f;
            pointF.y = 1.0f;
            drawLabels(c, mViewPortHandler.contentTop() - yoffset + paddingTop, pointF);

        } else if (mXAxis.getPosition() == XAxis.XAxisPosition.TOP_INSIDE) {
            pointF.x = 0.5f;
            pointF.y = 1.0f;
            drawLabels(c, mViewPortHandler.contentTop() + yoffset + mXAxis.mLabelRotatedHeight + paddingTop, pointF);

        } else if (mXAxis.getPosition() == XAxis.XAxisPosition.BOTTOM) {
            pointF.x = 0.5f;
            pointF.y = 0.0f;
            drawLabels(c, mViewPortHandler.contentBottom() + yoffset + paddingTop, pointF);

        } else if (mXAxis.getPosition() == XAxis.XAxisPosition.BOTTOM_INSIDE) {
            pointF.x = 0.5f;
            pointF.y = 0.0f;
            drawLabels(c, mViewPortHandler.contentBottom() - yoffset - mXAxis.mLabelRotatedHeight + paddingTop, pointF);

        } else { // BOTH SIDED
            pointF.x = 0.5f;
            pointF.y = 1.0f;
            drawLabels(c, mViewPortHandler.contentTop() - yoffset + paddingTop, pointF);
            pointF.x = 0.5f;
            pointF.y = 0.0f;
            drawLabels(c, mViewPortHandler.contentBottom() + yoffset + paddingTop, pointF);
        }
        MPPointF.recycleInstance(pointF);
    }

    @Override
    protected void drawLabels(Canvas c, float pos, MPPointF anchor) {
        final float labelRotationAngleDegrees = mXAxis.getLabelRotationAngle();
        boolean centeringEnabled = mXAxis.isCenterAxisLabelsEnabled();

        float[] positions = new float[mXAxis.mEntryCount * 2];

        for (int i = 0; i < positions.length; i += 2) {

            // only fill x values
            if (centeringEnabled) {
                positions[i] = mXAxis.mCenteredEntries[i / 2];
            } else {
                positions[i] = mXAxis.mEntries[i / 2];
            }
        }

        mTrans.pointValuesToPixel(positions);

        for (int i = 0; i < positions.length; i += 2) {

            float x = positions[i];

            if (mViewPortHandler.isInBoundsX(x)) {

                String label = mXAxis.getValueFormatter().getFormattedValue(mXAxis.mEntries[i / 2], mXAxis);

                if (mXAxis.isAvoidFirstLastClippingEnabled()) {

                    // avoid clipping of the last
                    if (i == mXAxis.mEntryCount - 1 && mXAxis.mEntryCount > 1) {
                        float width = Utils.calcTextWidth(mAxisLabelPaint, label);

                        if (width > mViewPortHandler.offsetRight() * 2
                                && x + width > mViewPortHandler.getChartWidth())
                            x -= width / 2;

                        // avoid clipping of the first
                    } else if (i == 0) {

                        float width = Utils.calcTextWidth(mAxisLabelPaint, label);
                        x += width / 2 + Utils.convertDpToPixel(10);
                    }
                }

                drawLabel(c, label, x, pos, anchor, labelRotationAngleDegrees);
            }
        }
    }

    //
//    @Override
//    public void renderAxisLine(Canvas c) {
//        c.drawRect(mViewPortHandler.getContentRect(), mBackgroundPaint);
//        super.renderAxisLine(c);
//    }

    //    @Override
//    public void renderLimitLineLine(Canvas c, LimitLine limitLine, float[] position) {
//        float xOffset = limitLine.getLineWidth() + limitLine.getXOffset();
//        final LimitLine.LimitLabelPosition labelPosition = limitLine.getLabelPosition();
//        float textPosition = position[0];
//        if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_TOP) {
//            textPosition = position[0] + xOffset;
//        } else if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_BOTTOM) {
//            textPosition = position[0] + xOffset;
//        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_TOP) {
//            textPosition = position[0] - xOffset;
//        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_BOTTOM){
//            textPosition = position[0] - xOffset;
//        } else {
//            textPosition = position[0] - xOffset/2;
//        }
//
//        if(textPosition < mViewPortHandler.getContentRect().left || textPosition > mViewPortHandler.getContentRect().right ){
//            //The limit line is hiding. Don't draw label also.
//            return;
//        }
//
//        super.renderLimitLineLine(c, limitLine, position);
//    }

    @Override
    public void renderLimitLineLabel(Canvas c, LimitLine limitLine, float[] position, float yOffset) {
        float xOffset = limitLine.getLineWidth() + limitLine.getXOffset();
        final LimitLine.LimitLabelPosition labelPosition = limitLine.getLabelPosition();
        float textPosition = position[0];
        if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_TOP) {
            textPosition = position[0] + xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.RIGHT_BOTTOM) {
            textPosition = position[0] + xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_TOP) {
            textPosition = position[0] - xOffset;
        } else if (labelPosition == LimitLine.LimitLabelPosition.LEFT_BOTTOM){
            textPosition = position[0] - xOffset;
        } else {
            textPosition = position[0] - xOffset/2;
        }

        if(textPosition < mViewPortHandler.getContentRect().left || textPosition > mViewPortHandler.getContentRect().right ){
            //The limit line is hiding. Don't draw label also.
            return;
        }
//
//        RectF rect = new RectF();
//        rect.left = mViewPortHandler.getContentRect().left - (horizontalPaddingLeft * 2);
//        rect.right = mViewPortHandler.getContentRect().right + (horizontalPaddingRight * 2);
//        rect.top = 0;
//        rect.bottom = c.getHeight();
//        c.clipRect(rect);
        super.renderLimitLineLabel(c, limitLine, position, yOffset);
//        c.clipRect(new RectF(0,0,c.getWidth(),c.getHeight()), Region.Op.UNION);
    }
}
