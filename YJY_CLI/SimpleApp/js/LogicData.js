'use strict'
import {
	Platform,
} from 'react-native';

var StorageModule = require('./module/StorageModule');
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

	logout: function(callback) {
		userData = {};
		StorageModule.removeUserData().then(()=>{
			callback && callback();
		})			
	},
}

module.exports = LogicData;