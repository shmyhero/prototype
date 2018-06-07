'use strict';

import {
	Platform,
	StatusBar,
	Dimensions,
	PixelRatio,
} from 'react-native';

export let TAB_BAR_HEIGHT = 50
export let STATUS_BAR_ACTUAL_HEIGHT = Platform.Version >= 21 ? StatusBar.currentHeight : 0 //Toolbar is translucent on Android devices above sdk 21.
export let NAVBAR_HEIGHT = Platform.OS === 'android' ? 48: 64
export let HEADER_HEIGHT = Platform.OS === 'android' ? NAVBAR_HEIGHT + STATUS_BAR_ACTUAL_HEIGHT : NAVBAR_HEIGHT
export let SCROLL_TAB_HEIGHT = Platform.OS === 'android' ? 32 : 48	//TODO: A calculated value, may be wrong on some devices...
export let ANDROID_LIST_VIEW_HEIGHT_MAGIC_NUMBER = Platform.OS === 'android' ? StatusBar.currentHeight : 0
export let LIST_HEADER_BAR_HEIGHT = Platform.OS === 'android' ? 31 : 26.5
export let MAX_NICKNAME_LENGTH = 20;
export let ITEM_ROW_HEIGHT = 70;
export let ITEM_ROW_MARGIN_HORIZONTAL = 15;
export let ITEM_ROW_MARGIN_VERTICAL = 15;
export let ITEM_ROW_BORDER_RADIUS = 10;
export let STOCK_ROW_NAME_FONT_SIZE = 17;
export let STOCK_ROW_PRICE_FONT_SIZE = 15;

 