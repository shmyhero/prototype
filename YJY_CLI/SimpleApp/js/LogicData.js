'use strict'
import {
	Platform,
} from 'react-native';

var StorageModule = require('./module/StorageModule');


class LogicData {
	static userData = {};
	static meData = {};
	static language = "en-us" // "zh-cn";
	
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
	
	static isUserSelf(id){
		return id == this.userData.userId
	}

	static async setMarketListOrder(value){
		return new Promise((resolve)=>{
			this.marketListOrder = value
			var data = JSON.stringify(value)
			StorageModule.setMarketListOrder(data).then(()=>{
				resolve();
			})
		});
	}

	static async loadMarketListOrder(){
		
		return new Promise((resolve, reject)=>{
			if(this.marketListOrder){
				resolve(this.marketListOrder);
			}else{
				StorageModule.loadMarketListOrder().then(value=>{
					if(value){
						this.marketListOrder = JSON.parse(value)
						resolve(this.marketListOrder);
					}else{
						reject();
					}
				});
			}			
		});
	}

	static setLanguage(value){
		if(this.language!==value){
			if(value && value.includes("en")){
				this.language = "en-us";
			}else if(value && value.includes("zh")){
				this.language = "zh-cn";
			}else{
				this.language = "en-us";
			}
			console.log("setLanguage value.includes(en)" + value.includes("en"))
			console.log("setLanguage value.includes(zh)" + value.includes("zh"))
			console.log("setLanguage " + this.language)
		}
	}

	static getLanguage(){
		return this.language
	}
}

export default LogicData;
