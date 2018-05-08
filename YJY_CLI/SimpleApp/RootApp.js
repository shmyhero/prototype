import React, { Component } from 'react';
import App from './App';
import PropTypes from 'prop-types';
import {
    createStore,
    applyMiddleware,
} from 'redux';
import { Provider, connect } from 'react-redux';

export default class RootApp extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    }

    render() {
        if(this.props.store){
            console.log("this.props.store not null")
        }else{
            console.log("this.props.store null")
        }
        return (
            <Provider store={this.props.store}>
                <App/>
            </Provider>
        );
    }
}
