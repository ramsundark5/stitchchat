import React, { Component } from 'react-native';
import MessagePage from './MessagePage';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';
import RootReducer from '../reducers/RootReducer';
import ConfigureStore from '../store/ConfigureStore';

const store = ConfigureStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                {() => <MessagePage /> }
            </Provider>
        );
    }
}
