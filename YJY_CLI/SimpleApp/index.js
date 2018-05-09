import { AppRegistry } from 'react-native';
import React, { Component } from 'react';
//import App from './App';
import RootApp from './RootApp';


import {configureStore} from "./js/redux/store/configureStore";

export var store = configureStore()

export function getStore(){
    return store;
}

AppRegistry.registerComponent('SimpleApp', () => ()=> <RootApp store={store} />);
