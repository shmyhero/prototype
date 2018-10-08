'use strict'

var colorScheme = 1

var colors = {
	WHITE:'white',
	BGBLUE:'#1f4a77',
	BLUE2:'#3774aa',
	BLUETEXT:'#6693c2',
	COLOR_THEME_SIMULATOR: 1,
	COLOR_THEME_LIVE: 2,
	TITLE_BLUE_LIVE: '#425a85',
	TITLE_BLUE_SIMULATE: '#1962dd',
	TITLE_BLUE: '#1962dd',
	TITLE_DARK_BLUE: '#425a85',
	DISABLED_GREY: '#dcdcdc',
	BACKGROUND_GREY: '#f0f0f0',
	STOCK_RISE_GREEN: '#428e1b',
	STOCK_RISE_RED: '#cc3333',
	STOCK_RISE: '#B03030',
	STOCK_DOWN: '#269888',
	STOCK_RISE_LIGHT:'#FA3F3F',
	STOCK_DOWN_LIGHT:'#00FA6E',
	STOCK_UNCHANGED_GRAY: '#999999',
	LIST_BACKGROUND_GREY: '#f0eff5',
	SEPARATOR_GRAY: '#ececec',
	MORE_ICON: '#9f9f9f',
	// MAIN_CONTENT_BLUE: '#13141b',
	SUB_TITLE_WHITE: '#bbd3ff',
	STOCK_TAB_BLUE: '#70a5ff',
	INPUT_TEXT_PLACE_HOLDER_COLOR: '#c4c4c4',
	INPUT_TEXT_COLOR: '#333333',
	INOUT_TEXT_SELECTION_COLOR: '#426bf2',
	TAB_UNSELECT_TEXT_COLOR: '#abcaff',
	COLOR_BORDER:'#184692',
	COLOR_STATIC_TEXT1:'#85b1fb',
	COLOR_CUSTOM_BLUE:'#629af3',
	COLOR_MAIN_THEME_BLUE: '#13141b',
	COLOR_LIST_VIEW_ITEM_BG:'#1c1c26',
	BORDER_LIGHT_BLUE: '#2e303e',
	TIMER_COLOR:'#3B3B56',
	SUB_MAIN_COLOR:'#8181A2',
	COLOR_GRADIENT_YELLOW: ["#f0bd0a", "#fcdc45"],
	IMPORTANT_TEXT_COLOR_ENABLE: '#917202',
	
	COLOR_GRADIENT_BLUE: ["#1f4a77",  "#5b8ec2"],
	COLOR_NAVBAR_BLUE_GRADIENT: ["#1f4a77",  "#5b8ec2"],
    UNIMPORTANT_TEXT_COLOR_ENABLE: 'white',
    COLOR_GRADIENT_DISABLE: ["#999999", "#AAAAAA"],
	TEXT_COLOR_DISABLE: "white",
	NAVBAR_TEXT_COLOR: "white",
	
	stock_color: function(change) {
		if (change > 0) {
			return this.STOCK_RISE_LIGHT
		}
		else if (change < 0) {
			return this.STOCK_DOWN_LIGHT
		}
		else {
			return this.STOCK_UNCHANGED_GRAY
		}
	},

	stock_color_bg: function(change) {
		if (change > 0) {
			return this.STOCK_RISE
		}
		else if (change < 0) {
			return this.STOCK_DOWN
		}
		else {
			return this.STOCK_UNCHANGED_GRAY
		}
	},

	title_blue:function(){ 
		return colorScheme === this.COLOR_THEME_LIVE ? '#425a85':'#1962dd'
	},

	setScheme: function(scheme){
		colorScheme = scheme

		if(scheme === this.COLOR_THEME_LIVE) {
			this.TITLE_BLUE = '#425a85'
			this.TITLE_DARK_BLUE = '#425a85'
			this.DISABLED_GREY = '#dcdcdc'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_GREEN = '#bc4105'
			this.STOCK_RISE_RED = '#428e1b'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#8fabdb'
			this.TAB_UNSELECT_TEXT_COLOR = '#a0bdf1'
			this.COLOR_BORDER = '#253b60'
			this.COLOR_STATIC_TEXT1 = '#698dcd'
			this.COLOR_CUSTOM_BLUE = '#455e8b'
		}
		else {
			this.TITLE_BLUE = '#1b9bec'
			this.TITLE_DARK_BLUE = '#425a85'
			this.DISABLED_GREY = '#dcdcdc'
			this.BACKGROUND_GREY = '#f0f0f0'
			this.STOCK_RISE_GREEN = '#bc4105'
			this.STOCK_RISE_RED = '#428e1b'
			this.STOCK_UNCHANGED_GRAY = '#a0a6aa'
			this.LIST_BACKGROUND_GREY = '#f0eff5'
			this.SEPARATOR_GRAY = '#ececec'
			this.MORE_ICON = '#9f9f9f'
			this.MAIN_CONTENT_BLUE = '#1b65e1'
			this.SUB_TITLE_WHITE = '#bbd3ff'
			this.STOCK_TAB_BLUE = '#70a5ff'
			this.TAB_UNSELECT_TEXT_COLOR = '#abcaff'
			this.COLOR_BORDER = '#184692'
			this.COLOR_STATIC_TEXT1 = '#85b1fb'
			this.COLOR_CUSTOM_BLUE = '#629af3'
		}
	},


	RED : '#a92426',
	GREEN : '#2f9f47',
}

module.exports = colors;
