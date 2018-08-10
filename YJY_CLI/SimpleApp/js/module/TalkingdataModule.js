'use strict'

import { NativeModules } from 'react-native';

const nativeModule = NativeModules.TalkingDataAPI;
 
export const AD_TRACKING_KEY_USER_ID = "userId";

export const AD_TRACKING_EVENT_LOGIN = "login"        //模拟盘登录 

export function trackADEvent(event_name, parameters) {
  try{
    console.log("parameters: " + JSON.stringify(parameters))
    nativeModule.trackADEvent(event_name, parameters);
  }catch(e){
    console.log(e)
  }
}

export function trackPageBegin(page_name) {
  nativeModule.trackPageBegin(page_name);
}

export function trackPageEnd(page_name) {
  nativeModule.trackPageEnd(page_name);
}

export function trackEvent(event_name, event_label, parameters) {
  nativeModule.trackEvent(event_name, event_label, parameters);
}

export function setLocation(latitude, longitude) {
  nativeModule.setLocation(latitude, longitude);
}

export function getDeviceID() {
  return new Promise(resolve=>{
    nativeModule.getDeviceID(resolve);
  })
}

export async function applyAuthCode(countryCode, mobile, requestId) {
  return await nativeModule.applyAuthCode(countryCode, mobile, requestId);
}

export async function verifyAuthCode(countryCode, mobile, authCode) {
  return await nativeModule.verifyAuthCode(countryCode, mobile, authCode);
}

var currentTrackingEventName;
var currentTrackingEventLabel;
var currentTrackingEventParameters;
export async function setCurrentTrackingEvent(event_name, event_label, parameters) {
  currentTrackingEventName = event_name;
  currentTrackingEventLabel = event_label;
  currentTrackingEventParameters = parameters;
}
export async function clearCurrentTrackingEvent(){
  currentTrackingEventName = null;
  currentTrackingEventLabel = null;
  currentTrackingEventParameters = null;
}
export async function trackCurrentEvent(){
  if(currentTrackingEventName){
    trackEvent(currentTrackingEventName, currentTrackingEventLabel, currentTrackingEventParameters);
  }
}
