import React, { Component } from 'react-native';
import { Provider } from 'react-redux/native';
import store from '../config/ConfigureStore';
import AppNavigator from './AppNavigator';

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                {() => <AppNavigator /> }
            </Provider>
        );
    }
}

