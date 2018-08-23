package com.simpleapp.component.chart.linechart;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.widget.TextView;

import com.github.mikephil.charting.components.MarkerView;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.ILineScatterCandleRadarDataSet;
import com.github.mikephil.charting.utils.MPPointF;
import com.github.mikephil.charting.utils.Utils;
import com.simpleapp.R;

import org.json.JSONArray;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Neko on 2018/1/31.
 * Draw the marker which contains a cross and price/date labels when long press on StockDetailChart.
 */

public class LineChartMarkerView extends MarkerView {
    private String XVal;
    private String YVal;
    protected Paint mHighlightPaint;
    protected Paint mValuePaint;
    protected Paint mRectFillPaint;
    protected Paint mRectBorderPaint;
    private Path mHighlightLinePath = new Path();
    JSONArray stockInfoObject;
    String dateTimeKey;

    public LineChartMarkerView(Context context, int layoutResource, JSONArray stockInfoObject, String dateTimeKey) {
        super(context, layoutResource);
        mHighlightPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mHighlightPaint.setStyle(Paint.Style.STROKE);
        mHighlightPaint.setStrokeWidth(2f);
        mHighlightPaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_border_blue));

        mValuePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mValuePaint.setTextAlign(Paint.Align.CENTER);
        mValuePaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_text_blue));

        mRectBorderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mRectBorderPaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_border_blue));
        mRectBorderPaint.setStyle(Paint.Style.FILL);

        mRectFillPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mRectFillPaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_background_blue));
        mRectFillPaint.setStyle(Paint.Style.FILL);

        this.stockInfoObject = stockInfoObject;
        this.dateTimeKey = dateTimeKey;
    }

    // callbacks everytime the MarkerView is redrawn, can be used to update the
    // content (user-interface)
    @Override
    public void refreshContent(Entry e, Highlight highlight) {
        XVal = "" +e.getX();
        YVal = "" +e.getY();

        try {
            String xVal = (this.stockInfoObject.getJSONObject((int)e.getX()).getString(dateTimeKey));
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            format.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = format.parse(xVal);
            SimpleDateFormat outFormat = new SimpleDateFormat("HH:mm");
            XVal = outFormat.format(date);
        }catch (Exception exception){

        }
    }

    protected void drawHighlightLines(Canvas c,
                                      float x, float y,
                                      float horizontalLineStart, float horizontalLineEnd,
                                      float verticalLineStart, float verticalLineEnd) {
        // create vertical path
        mHighlightLinePath.reset();
        mHighlightLinePath.moveTo(x, verticalLineStart);
        mHighlightLinePath.lineTo(x, verticalLineEnd);

        c.drawPath(mHighlightLinePath, mHighlightPaint);

        // create horizontal path
        mHighlightLinePath.reset();
        mHighlightLinePath.moveTo(horizontalLineStart, y);
        mHighlightLinePath.lineTo(horizontalLineEnd, y);

        c.drawPath(mHighlightLinePath, mHighlightPaint);

    }


    @Override
    public void draw(Canvas canvas, float posX, float posY) {

        float valueBoxWidth = Utils.convertDpToPixel(50);
        float valueBoxHeight = Utils.convertDpToPixel(16);
        float borderThickness = Utils.convertDpToPixel(1);
        float bottomPadding = Utils.convertDpToPixel(30);
        float rightPaddingMax = Utils.convertDpToPixel(80);
        float rightPaddingMin = Utils.convertDpToPixel(20);
        float textSize = Utils.convertDpToPixel(10);
        float xValueYOffset = Utils.convertDpToPixel(80);
        float boxHorizontalPadding = Utils.convertDpToPixel(10);

        float verticalValueY = Math.min(posY + xValueYOffset, canvas.getHeight() - bottomPadding);
        float verticalValueX = Math.min(posX, canvas.getWidth() - borderThickness - valueBoxWidth/2);
        float horizontalValueX;
        float highlightEndX;
        if(posX + valueBoxWidth/2 + boxHorizontalPadding < canvas.getWidth() - borderThickness - rightPaddingMax) {
            horizontalValueX = canvas.getWidth() - borderThickness - rightPaddingMax - boxHorizontalPadding;
            highlightEndX = horizontalValueX;
        }else if(posX + valueBoxWidth/2 + boxHorizontalPadding < canvas.getWidth() - borderThickness - rightPaddingMin){
            horizontalValueX = posX + valueBoxWidth/2 + boxHorizontalPadding;
            highlightEndX = horizontalValueX;
        }else{
            horizontalValueX = posX - valueBoxWidth/2 - boxHorizontalPadding;
            highlightEndX = canvas.getWidth();
        }

        float horizontalValueY = posY;

        drawHighlightLines(canvas, posX, posY, 0, highlightEndX, 0, verticalValueY);

        RectF xValueBorderRect = new RectF(verticalValueX - (valueBoxWidth/2) - borderThickness,
                verticalValueY - (valueBoxHeight/2) - borderThickness,
                verticalValueX + (valueBoxWidth/2) + borderThickness,
                verticalValueY + (valueBoxHeight/2) + borderThickness);
        RectF xValueFillRect = new RectF(verticalValueX - (valueBoxWidth/2),
                verticalValueY - (valueBoxHeight/2),
                verticalValueX + (valueBoxWidth/2),
                verticalValueY + (valueBoxHeight/2));
        canvas.drawRoundRect(xValueBorderRect, 10, 10, mRectBorderPaint);
        canvas.drawRoundRect(xValueFillRect, 6, 6, mRectFillPaint);

        RectF yValueBorderRect = new RectF(horizontalValueX - (valueBoxWidth/2) - borderThickness,
                horizontalValueY - (valueBoxHeight/2) - borderThickness,
                horizontalValueX + (valueBoxWidth/2) + borderThickness,
                horizontalValueY + (valueBoxHeight/2) + borderThickness);
        RectF yValueFillRect = new RectF(horizontalValueX - (valueBoxWidth/2),
                horizontalValueY - (valueBoxHeight/2),
                horizontalValueX + (valueBoxWidth/2),
                horizontalValueY + (valueBoxHeight/2));

        canvas.drawRoundRect(yValueBorderRect, 10, 10, mRectBorderPaint);
        canvas.drawRoundRect(yValueFillRect, 6, 6, mRectFillPaint);

        mValuePaint.setTextSize(textSize);
        canvas.drawText(YVal, horizontalValueX, horizontalValueY + textSize / 2 - Utils.convertDpToPixel(3), mValuePaint);
        canvas.drawText(XVal, verticalValueX, verticalValueY + textSize / 2 - Utils.convertDpToPixel(3), mValuePaint);


        //It's a trick, We don't need to draw the original control:)
        //draw(canvas);

    }
}