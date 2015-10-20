/**
 * Created by ramsundar on 8/27/15.
 */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import RootReducer from '../reducers/RootReducer';
//import { devTools, persistState } from 'redux-devtools';

let loggerMiddleware = createLogger();
let middlewares      = [thunkMiddleware];

if (process.env.NODE_ENV != 'production') {
    middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = compose(
    applyMiddleware(...middlewares)
    //devTools(),
)(createStore);

function ConfigureStore(initialState) {
    console.log('inside configure store');
    const store = createStoreWithMiddleware(RootReducer, initialState);
    return store;
}

module.exports = ConfigureStore();