package com.simpleapp.component.chart;


import com.simpleapp.component.chart.base.IChartDrawer;
import com.simpleapp.component.chart.detail.StockDetailChartDrawer;

/**
 * Created by Neko on 2018/1/29.
 */
public class ChartDrawerBuilder {
    public static IChartDrawer createDrawer(ChartDrawerConstants.CHART_TYPE type){
        switch (type){
            case today:
                return new StockDetailChartDrawer();
//            case tenM:
//                return new Stick10MinuteChartDrawer();
//            case twoH:
//                return new Stick2HourChartDrawer();
//            case week:
//                return new StickWeekChartDrawer();
//            case month:
//                return new Stick1MonthChartDrawer();
//            case day:
//                return new Candle1DayChartDrawer();
//            case fiveM:
//                return new Candle5MinuteChartDrawer();
//            case hour:
//                return new Candle1HourChartDrawer();
//            case oneM:
//                return new Candle1MinuteChartDrawer();
//            case fifteenM:
//                return new Candle15MinuteChartDrawer();
//            case threeMonth:
//                return new Stick3MonthChartDrawer();
//            case sixMonth:
//                return new Stick6MonthChartDrawer();
//            case todayK:
//                return new CandleTodayChartDrawer();
//            case towWeekYield:
//                return new Stick2WeekYieldChartDrawer();
//            case allYield:
//                return new StickAllYieldChartDrawer();
            default:
                return null;
        }
    }
}
