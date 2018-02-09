'use strict'
import {
	Platform,
} from 'react-native';

var userData = {};

var LogicData = {
	isLoggedIn: function(){
		var loggined = Object.keys(userData).length !== 0
		return loggined;
	},

	setUserData: function(data) {
		userData = data;
	},

	getUserData: function() {
		return userData;
	},
}

module.exports = LogicData;