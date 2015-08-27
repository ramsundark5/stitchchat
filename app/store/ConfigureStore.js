/**
 * Created by ramsundar on 8/27/15.
 */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import RootReducer from '../reducers/RootReducer';
import { devTools, persistState } from 'redux-devtools';

let finalCreateStore;
let loggerMiddleware = createLogger();
let middlewares      = [thunkMiddleware, loggerMiddleware];


// In production, we want to use just the middleware.
// In development, we want to use some store enhancers from redux-devtools.
// UglifyJS will eliminate the dead code depending on the build environment.

if (process.env.NODE_ENV === 'production') {
    finalCreateStore = applyMiddleware(...middlewares)(createStore);
}
else {
    finalCreateStore = compose(
        applyMiddleware(...middlewares),
        //devTools(),
        createStore
    );
}

export default function ConfigureStore(initialState) {
    return finalCreateStore(RootReducer, initialState);
}