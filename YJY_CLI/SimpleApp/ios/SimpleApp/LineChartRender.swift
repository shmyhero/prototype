//
//  LineChartRender.swift
//  TH_CFD
//
//  Created by william on 16/9/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

class LineChartRender: BaseRender {
	weak var lineDataProvider: LineChartDataProvider?
	
	override init(view:StockChartView) {
		super.init(view: view)
		lineDataProvider = dataProvider as? LineChartDataProvider
	}
	
	override func render(_ context: CGContext) {
		if (lineDataProvider == nil) {
			return
		} else {
			_margin = dataProvider!.margin()
			_topMargin = dataProvider!.topMargin()
			_bottomMargin = dataProvider!.bottomMargin()
		}
		let pointData = lineDataProvider!.pointData()
		if(pointData.count == 0){
			// should not occurred.
			print ("Alert, should not happen!")
			return
		}
		
		let width = lineDataProvider!.chartWidth()
		let height = lineDataProvider!.chartHeight()
		
		// draw the line graph
		_colorSet.lineColor.setFill()
		_colorSet.lineColor.setStroke()
		
		//set up the points line
		let graphPath = UIBezierPath()
		//go to start of line
		graphPath.move(to: pointData[0])
		
		//add points for each item in the graphPoints array
		//at the correct (x, y) for the point
		for i in 1..<pointData.count {
			let nextPoint = pointData[i]
			graphPath.addLine(to: nextPoint)
		}
		
		context.saveGState()
		
		let clippingPath = graphPath.copy() as! UIBezierPath
		
		//3 - add lines to the copied path to complete the clip area
		clippingPath.addLine(to: CGPoint(
			x: pointData.last!.x,
			y:height))
		clippingPath.addLine(to: CGPoint(
			x: pointData[0].x,
			y:height))
		clippingPath.close()
		
		//4 - add the clipping path to the context
		clippingPath.addClip()
		
		let clippingBox:UIBezierPath = UIBezierPath.init(rect: CGRect(x: _margin-1, y: _topMargin-1, width: width-_margin*2+2, height: height-_bottomMargin-_topMargin+2))
		clippingBox.addClip()
		
		let colors = [_colorSet.getStartColor().cgColor, _colorSet.getEndColor().cgColor]
		//set up the color space
		let colorSpace = CGColorSpaceCreateDeviceRGB()
		//set up the color stops
		let colorLocations:[CGFloat] = [0.0, 1.0]
		if(pointData.count > 1) {
			// draw gradients
			let highestYPoint = height*0.12//topLineY
			let startPoint = CGPoint(x:_margin, y: highestYPoint)
			let endPoint = CGPoint(x:_margin, y:height-_bottomMargin)
			
			//create the gradient
			let gradient = CGGradient(colorsSpace: colorSpace,
			                                          colors: colors as CFArray,
			                                          locations: colorLocations)
			
			context.drawLinearGradient(gradient!, start: startPoint, end: endPoint, options: .drawsBeforeStartLocation)
			context.restoreGState()
		}
		
//        self.drawBorderLines(context, lineColor: _colorSet.getBgLineColor())
//        self.drawMiddleLines(context)
		
		context.saveGState()
		clippingBox.addClip()
		
		//draw the line on top of the clipped gradient
		graphPath.lineWidth = 3
		graphPath.stroke()
		
		context.restoreGState()
		if lineDataProvider!.pannedX() < 5 {
            //Draw the circles on right top of graph stroke
            
            let circleColors = [UIColor.white.cgColor,
                                UIColor(hexInt:0x1954B9, alpha:0.3).cgColor]
            
            let pointGradient = CGGradient(colorsSpace: colorSpace,
                                                           colors: circleColors as CFArray, locations: colorLocations)
            
            let centerPoint = lineDataProvider!.findHighlightPoint()
            let startRadius: CGFloat = 2
            let endRadius: CGFloat = 6
            
            context.drawRadialGradient(pointGradient!, startCenter: centerPoint,
                                        startRadius: startRadius, endCenter: centerPoint, endRadius: endRadius, options: .drawsBeforeStartLocation)
        }
		self.drawExtraText(context)
	}
	
	func drawMiddleLines(_ context: CGContext) {
		if (lineDataProvider == nil) {
			return
		}
		context.saveGState()
		//center line
        let linePath = UIBezierPath()
        let width = lineDataProvider!.chartWidth()
        let height = lineDataProvider!.chartHeight()
		
		// vertical lines
		if !lineDataProvider!.hasData() {
			//center lines, calculate time length
			let verticalLinesX = lineDataProvider!.xVerticalLines()
			for i in 0..<verticalLinesX.count {
				let px = verticalLinesX[i]
				linePath.move(to: CGPoint(x: px, y: _topMargin))
				linePath.addLine(to: CGPoint(x:px, y:height - _bottomMargin))
			}
			_colorSet.getBgLineColor().setStroke()
			linePath.lineWidth = 1
			linePath.stroke()
			context.restoreGState()
		}
	}
	
	override func drawExtraText(_ context:CGContext) -> Void {
		if (lineDataProvider == nil) {
			return
        }
        let width = lineDataProvider!.chartWidth()
		let height = lineDataProvider!.chartHeight()
        // add a background color
        context.saveGState()
        _colorSet.dateTextBgColor.setFill()
        context.fill(CGRect(x: 0, y: height-_bottomMargin, width: width, height: 15))
        context.restoreGState()
        
		let dateFormatter = DateFormatter()
		var textWidth:CGFloat = 28.0
		let chartType = lineDataProvider!.chartType()
		if chartType == "week" || chartType == "month" || chartType == "3month" || chartType == "6month" {
			dateFormatter.dateFormat = "MM/dd"
		}
		else if chartType == "10m" {
			dateFormatter.dateFormat = "HH:mm:ss"
			textWidth = 35.0
		}
		else {
			dateFormatter.dateFormat = "HH:mm"
		}

        // 固定显示4个时间
        let textColor = _colorSet.dateTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 8)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .center
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            //            NSBackgroundColorAttributeName: UIColor.blackColor(),
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        let textY = height-_bottomMargin+2
		
		var lastX:CGFloat = textWidth/2	//center x of last text
		let verticalLinesX = lineDataProvider!.xVerticalLines()
		let verticalTimes = lineDataProvider!.timesOnBottom()
		for i in 0..<verticalTimes.count {
//            if verticalLinesX[i] < lastX+textWidth-5 || verticalLinesX[i]>width-textWidth*1.5+8 {
//                continue
//            }
			let text:NSString = dateFormatter.string(from: verticalTimes[i] as Date) as NSString
			let rect = CGRect(x: verticalLinesX[i]-textWidth/2, y: textY, width: textWidth, height: 10)
			text.draw(in: rect, withAttributes: attributes)
			lastX = verticalLinesX[i]
		}
		
        
        let longPressing:(isPress:Bool, location:CGPoint) = lineDataProvider!.longPressing()
        if longPressing.isPress {
            self.drawPointedInfo(context, location: longPressing.location)
        }
        else {
            self.drawCurrentText(context)
        }
	}
    
    func drawCurrentText(_ context: CGContext) {
        // 当前价格框和数值
        var lastPrice = lineDataProvider!.lastPrice()!
        if (lastPrice.isNaN) {
            return
        }
        let panx = lineDataProvider!.pannedX()
        if panx >= 5 {
            return
        }
        
        let textWidth:CGFloat = 60
        let textColor = _colorSet.rightTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 14)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .center
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        
        let text: NSString = "\(lastPrice.roundTo(2))" as NSString
        let textX = chartWidth() - 105 + panx
        let textHeight:CGFloat = 14
        let centerPoint = lineDataProvider!.findHighlightPoint()
        let textY = centerPoint.y
        
        let rectX = textX-5+panx
        let rectWidth:CGFloat = 70
        let rectHeight:CGFloat = 30
        
        // add a background color
        context.saveGState()
        let textBgRect = CGRect(x: rectX, y: textY-rectHeight/2, width: rectWidth, height: rectHeight)
        let path = UIBezierPath(roundedRect: textBgRect, cornerRadius: 20)
        path.lineWidth = 2
        _colorSet.currentPriceBgColor.setFill()
        _colorSet.currentPriceBorderColor.setStroke()
        path.fill()
        path.stroke()
        context.restoreGState()
        
        text.draw(in: CGRect(x: textX, y: textY-textHeight/2-1, width: textWidth, height: textHeight), withAttributes: attributes)
        
        _colorSet.currentPriceBorderColor.setFill()
        context.fill(CGRect(x: rectX+rectWidth, y: textY, width: 20, height: 1))
    }
    
    func drawPointedInfo(_ context:CGContext, location:CGPoint) -> Void {
        
        let info:(lineData:LineData, position:CGPoint) = lineDataProvider!.pointedInfo(point: location)
        
        let textColor = _colorSet.rightTextColor
        let textFont = UIFont(name: "Helvetica Neue", size: 12)
        let textStyle = NSMutableParagraphStyle()
        textStyle.alignment = .center
        let attributes: [String:AnyObject] = [
            NSForegroundColorAttributeName: textColor,
            NSFontAttributeName: textFont!,
            NSParagraphStyleAttributeName: textStyle,
            ]
        
        var text: NSString = "\(info.lineData.price.roundTo(2))" as NSString
        var textWidth:CGFloat = 54
        var textX = chartWidth() - textWidth - self._margin
        let textHeight:CGFloat = (textFont?.pointSize)!
        var textY = info.position.y
        
        var rectX = textX-3
        var rectWidth:CGFloat = 60
        let rectHeight:CGFloat = 16
        
        // add a background color
        context.saveGState()
        var textBgRect = CGRect(x: rectX, y: textY-rectHeight/2, width: rectWidth, height: rectHeight)
        var path = UIBezierPath(roundedRect: textBgRect, cornerRadius: 20)
        path.lineWidth = 2
        _colorSet.currentPriceBgColor.setFill()
        _colorSet.currentPriceBorderColor.setStroke()
        path.fill()
        path.stroke()
        
        text.draw(in: CGRect(x: textX, y: textY-textHeight/2-1, width: textWidth, height: textHeight), withAttributes: attributes)
        _colorSet.currentPriceBorderColor.setFill()
        context.fill(CGRect(x: 0, y: textY, width: rectX, height: 1))
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM/dd HH:mm"
        text = dateFormatter.string(from: info.lineData.time! as Date) as NSString
        textWidth = 80
        textX = info.position.x - textWidth/2
        textY = chartHeight() - 30
        rectX = textX-5
        rectWidth = 90
        textBgRect = CGRect(x: rectX, y: textY-rectHeight/2, width: rectWidth, height: rectHeight)
        
        path = UIBezierPath(roundedRect: textBgRect, cornerRadius: 20)
        _colorSet.currentPriceBgColor.setFill()
        path.fill()
        path.stroke()
        text.draw(in: CGRect(x: textX, y: textY-textHeight/2-1, width: textWidth, height: textHeight), withAttributes: attributes)
        _colorSet.currentPriceBorderColor.setFill()
        context.fill(CGRect(x: info.position.x, y: 0, width: 1, height: textY-textHeight/2-1))
        context.restoreGState()
    }
}
