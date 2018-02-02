package com.simpleapp.component.chart.linechart;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.widget.TextView;

import com.github.mikephil.charting.components.MarkerView;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.utils.MPPointF;
import com.simpleapp.R;

/**
 * Created by Neko on 2018/1/31.
 */

public class LineChartMarkerView extends MarkerView {

    private TextView tvContent;

    private String XVal;
    private String YVal;

    public LineChartMarkerView(Context context, int layoutResource) {
        super(context, layoutResource);

        // find your layout components
        tvContent = (TextView) findViewById(R.id.textView);
    }

    // callbacks everytime the MarkerView is redrawn, can be used to update the
    // content (user-interface)
    @Override
    public void refreshContent(Entry e, Highlight highlight) {

        tvContent.setText("" + e.getY());
        XVal = "" +e.getX();
        YVal = "" +e.getY();

//        measure(MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED),
//                MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
//        layout(0, 0, getMeasuredWidth(), getMeasuredHeight());

        // this will perform necessary layouting
        //super.refreshContent(e, highlight);
    }



    private MPPointF mOffset;

    @Override
    public MPPointF getOffset() {

        if(mOffset == null) {
            // center the marker horizontally and vertically
            mOffset = new MPPointF(-getWidth(), - (getHeight() / 2));
        }

        return mOffset;
    }


    @Override
    public void draw(Canvas canvas, float posX, float posY) {


        MPPointF offset = getOffsetForDrawingAtPoint(posX, posY);

        int saveId = canvas.save();
        // translate to the correct position and draw
        canvas.translate(canvas.getWidth() + offset.x, posY + offset.y);

        Paint mRenderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mRenderPaint.setStyle(Paint.Style.FILL);
        mRenderPaint.setColor(Color.RED);
        canvas.drawText(YVal, posX, 0, mRenderPaint);
        draw(canvas);
        canvas.restoreToCount(saveId);
    }
}