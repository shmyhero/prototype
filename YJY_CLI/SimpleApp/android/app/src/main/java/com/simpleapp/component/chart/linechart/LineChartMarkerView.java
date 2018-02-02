package com.simpleapp.component.chart.linechart;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.widget.TextView;

import com.github.mikephil.charting.components.MarkerView;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.utils.MPPointF;
import com.github.mikephil.charting.utils.Utils;
import com.simpleapp.R;

/**
 * Created by Neko on 2018/1/31.
 */

public class LineChartMarkerView extends MarkerView {
    private String XVal;
    private String YVal;

    public LineChartMarkerView(Context context, int layoutResource) {
        super(context, layoutResource);

        // find your layout components
        //tvContent = (TextView) findViewById(R.id.textView);
    }

    // callbacks everytime the MarkerView is redrawn, can be used to update the
    // content (user-interface)
    @Override
    public void refreshContent(Entry e, Highlight highlight) {
        XVal = "" +e.getX();
        YVal = "" +e.getY();

    }

    @Override
    public void draw(Canvas canvas, float posX, float posY) {

        float valueBoxWidth = Utils.convertDpToPixel(50);
        float valueBoxHeight = Utils.convertDpToPixel(16);
        float borderThickness = Utils.convertDpToPixel(2);
        float bottomPadding = Utils.convertDpToPixel(30);
        float rightPadding = Utils.convertDpToPixel(80);
        float textSize = Utils.convertDpToPixel(10);

        Paint rectBorderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        rectBorderPaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_border_blue));
        rectBorderPaint.setStyle(Paint.Style.FILL);

        Paint rectFillPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        rectFillPaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_background_blue));
        rectFillPaint.setStyle(Paint.Style.FILL);

        float valueX_x = posX;
        float valueX_y = canvas.getHeight() - bottomPadding;

        RectF xValueBorderRect = new RectF(valueX_x - (valueBoxWidth/2) - borderThickness,
                valueX_y - (valueBoxHeight/2) - borderThickness,
                valueX_x + (valueBoxWidth/2) + borderThickness,
                valueX_y + (valueBoxHeight/2) + borderThickness);
        RectF xValueFillRect = new RectF(valueX_x - (valueBoxWidth/2),
                valueX_y - (valueBoxHeight/2),
                valueX_x + (valueBoxWidth/2),
                valueX_y + (valueBoxHeight/2));
        canvas.drawRoundRect(xValueBorderRect, 10, 10, rectBorderPaint);
        canvas.drawRoundRect(xValueFillRect, 6, 6, rectFillPaint);

        float valueY_x = Math.max(posX + valueBoxWidth/2, canvas.getWidth() - borderThickness - rightPadding);
        float valueY_y = posY;
        RectF yValueBorderRect = new RectF(valueY_x - (valueBoxWidth/2) - borderThickness,
                valueY_y - (valueBoxHeight/2) - borderThickness,
                valueY_x + (valueBoxWidth/2) + borderThickness,
                valueY_y + (valueBoxHeight/2) + borderThickness);
        RectF yValueFillRect = new RectF(valueY_x - (valueBoxWidth/2),
                valueY_y - (valueBoxHeight/2),
                valueY_x + (valueBoxWidth/2),
                valueY_y + (valueBoxHeight/2));

        canvas.drawRoundRect(yValueBorderRect, 10, 10, rectBorderPaint);
        canvas.drawRoundRect(yValueFillRect, 6, 6, rectFillPaint);

        Paint valuePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        valuePaint.setTextAlign(Paint.Align.CENTER);
        valuePaint.setTextSize(textSize);
        valuePaint.setColor(getContext().getResources().getColor(R.color.line_chart_marker_text_blue));
        canvas.drawText(YVal, valueY_x, valueY_y + textSize / 2, valuePaint);
        canvas.drawText(XVal, valueX_x, valueX_y + textSize / 2, valuePaint);


        //It's a trick, We don't need to draw the original control:)
        //draw(canvas);

    }
}