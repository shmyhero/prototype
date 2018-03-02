'use strict'
import {
	Platform,
} from 'react-native';

var StorageModule = require('./module/StorageModule');


class LogicData {
	static userData = {};
	static meData = {};
	
	static isLoggedIn(){
		console.log("isLoggedIn", this.userData)
		var loggined = Object.keys(this.userData).length !== 0
		return loggined;
	}

	static setUserData(data) {
		this.userData = data;
	}

	static getUserData() {
		return this.userData;
	}

	static logout(callback) {
		this.userData = {};
		StorageModule.removeUserData().then(()=>{
			callback && callback();
		})			
	}

	static setMeData(data){
		this.meData = data;
	}

	static getMeData(data){
		return this.meData;
	}
}

export default LogicData;

// var LogicData = {
// 	isLoggedIn: function(){
// 		var loggined = Object.keys(userData).length !== 0
// 		return loggined;
// 	},

// 	setUserData: function(data) {
// 		userData = data;
// 	},

// 	getUserData: function() {
// 		return userData;
// 	},

// 	logout: function(callback) {
// 		userData = {};
// 		StorageModule.removeUserData().then(()=>{
// 			callback && callback();
// 		})			
// 	},
// }

// module.exports = LogicData;