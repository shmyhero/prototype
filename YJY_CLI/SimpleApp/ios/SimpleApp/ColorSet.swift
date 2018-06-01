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
    var middleLineColor: UIColor
    var dateTextColor: UIColor
    var minmaxColor: UIColor
    var rightTextColor: UIColor
    
    // line chart
    var startColor: UIColor
    var endColor: UIColor
    var lineColor: UIColor
    
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
        if StockDataManager.sharedInstance().isLive {
            //实盘渐变色
            startColor = UIColor(hexInt: 0x6683b3)
            endColor = UIColor(hexInt: 0x374d74)
            //昨收线
            middleLineColor = type == 1 ? UIColor(hexInt:0x1d4fa2) : UIColor(hexInt: 0x657798)
            //图下面的日期
            dateTextColor = type == 1 ? UIColor(hexInt: 0x657798) : UIColor(hexInt: 0x657798)
            //线框
            bgLineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0x4c638d)
            //k线的颜色
            lineColor = type == 1 ? UIColor(hexInt: 0xffffff, alpha: 0.5) : UIColor(hexInt: 0xffffff)
            //最大最小文字
            minmaxColor = type == 1 ? UIColor.white : UIColor(hexInt: 0x94a9cf)
            //横屏时候右边的时间文字
            rightTextColor = type == 1 ? UIColor.white : UIColor(hexInt: 0x223555)
        }
        else {
            startColor = UIColor(hexInt: 0x346aa2)
            endColor = UIColor(hexInt: 0x1f4a77)
            middleLineColor = UIColor(hexInt: 0xffffff, alpha: 0.8)//UIColor(hexInt:0x1394e6)
            dateTextColor = UIColor(hexInt: 0x62a5e0)
            
            bgLineColor = UIColor(hexInt: 0xffffff, alpha: 0)
            lineColor = UIColor(hexInt: 0x577fa2, alpha:1)
            minmaxColor = UIColor.white
            rightTextColor = UIColor.white
        }
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
