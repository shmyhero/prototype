//
//  StockChartViewManager.m
//  SimpleApp
//
//  Created by william on 2018/4/26.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "StockChartViewManager.h"
#import "SimpleApp-Swift.h"

@implementation StockChartViewManager

RCT_EXPORT_MODULE();

RCT_EXPORT_VIEW_PROPERTY(chartType, NSString)
RCT_EXPORT_VIEW_PROPERTY(data, NSString)
RCT_EXPORT_VIEW_PROPERTY(colorType, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(isPrivate, BOOL)

- (UIView *)view
{
    StockChartView * theView;
    theView = [[StockChartView alloc] init];
    
//    UIView *theView = [[UIView alloc] init];
//    theView.backgroundColor = UIColor.redColor;
    return theView;
}
@end
