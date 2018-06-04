//
//  ColorSet.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class ColorSet: NSObject {
    var _type:Int = 0   // 0 is stock detail view, 1 is open position view.
    
    // base chart
    var bgLineColor: UIColor
    var dateTextColor: UIColor
    var minmaxColor: UIColor
    var rightTextColor: UIColor
    
    // line chart
    var startColor: UIColor
    var endColor: UIColor
    var lineColor: UIColor
    var dateTextBgColor: UIColor
    var currentPriceBgColor: UIColor = UIColor(hexInt: 0x23578d, alpha:0.7)
    var currentPriceBorderColor: UIColor = UIColor(hexInt: 0x5e7d9d, alpha:0.7)
    
    // yield line chart
    var yieldLineColor: UIColor = UIColor(hexInt: 0x1f4a77)
    var yieldBgLineColor: UIColor = UIColor(hexInt: 0xacabab)
    var yieldDateTextColor: UIColor = UIColor(hexInt: 0xacabab)
    var yieldStartColor: UIColor = UIColor(hexInt: 0xb8c6d4)
    var yieldEndColor: UIColor = UIColor(hexInt: 0xfbfcfd)
    
    // candle chart
    var upColor: UIColor = UIColor(hexInt: 0xe34b4f)
    var downColor: UIColor = UIColor(hexInt: 0x30c296)
    
    // edit own stock color
    var bgColor: UIColor = UIColor(hexInt: 0x1962dd)
    var headLabelColor: UIColor = UIColor(hexInt: 0xabcaff)
    
    init(type:Int=0) {
        _type = type;
        // type 0 is detail view.
        // type 1 is open position view
        //渐变背景色
        startColor = UIColor(hexInt: 0x346aa2)
        endColor = UIColor(hexInt: 0x1f4a77)
        // 下面的时间
        dateTextColor = UIColor(hexInt: 0x62a5e0)
        dateTextBgColor = UIColor(hexInt: 0x1c4570)
        //线框
        bgLineColor = UIColor(hexInt: 0xffffff, alpha: 0)
        //k线的颜色
        lineColor = UIColor(hexInt: 0x577fa2, alpha:1)
        //最大最小文字
        minmaxColor = UIColor.white
        //横屏时候右边的时间文字
        rightTextColor = UIColor.white
        super.init()
    }
    
    func update() {
        if StockDataManager.sharedInstance().isLive {
            bgColor = UIColor(hexInt: 0x425a85)
            headLabelColor = UIColor(hexInt: 0xa0bdf1)
        }
        else {
            bgColor = UIColor(hexInt: 0x1962dd)
            headLabelColor = UIColor(hexInt: 0xabcaff)
        }
    }
    
    func getBgLineColor() -> UIColor {
        if StockDataManager.sharedInstance().isLive && !AppDelegate.isPortrait() {
            return UIColor(hexInt: 0x374e78)
        }
        else {
            return bgLineColor
        }
    }
    
    func getStartColor() -> UIColor {
        if AppDelegate.isPortrait() {
            return startColor
        }
        else {
            return StockDataManager.sharedInstance().isLive ? UIColor(hexInt: 0x5f7baa) : UIColor(hexInt: 0x387ae7)
        }
    }
    
    func getEndColor() -> UIColor {
        if AppDelegate.isPortrait() {
            return endColor
        }
        else {
            return StockDataManager.sharedInstance().isLive ? UIColor(hexInt: 0x3f5680) : UIColor(hexInt: 0x1962dd)
        }
    }
    
}
