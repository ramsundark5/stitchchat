import {Component} from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../config/ConfigureStore';
import AppNavigator from './AppNavigator';
import codePush from "react-native-code-push";
import Polyfills from '../services/Polyfills'; //don't remove this for now

export default class App extends Component {

    componentDidMount(){
        codePush.sync();
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}

