import React, { Component } from 'react-native';
import MessagePage from './MessagePage';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';
import rootMessageReducer from '../reducers/rootMessageReducer';

const store = createStore(rootMessageReducer);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                {() => <MessagePage /> }
            </Provider>
        );
    }
}
