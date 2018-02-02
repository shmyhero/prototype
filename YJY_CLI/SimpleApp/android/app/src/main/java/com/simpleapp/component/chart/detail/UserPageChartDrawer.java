package com.simpleapp.component.chart.detail;

import com.github.mikephil.charting.charts.CombinedChart;
import com.simpleapp.component.chart.base.LineStickChartDrawer;

/**
 * Created by Neko on 2018/2/2.
 */

public class UserPageChartDrawer extends LineStickChartDrawer {
    @Override
    protected boolean needDrawLastCircle(CombinedChart chart) {
        return false;
    }
}
