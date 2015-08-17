import React, { Component } from 'react-native';
import TodoApp from './TodoApp';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux/native';
import rootReducer from '../reducers';

const store = createStore(rootReducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <TodoApp /> }
      </Provider>
    );
  }
}
