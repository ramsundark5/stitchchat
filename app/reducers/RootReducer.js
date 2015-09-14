import { combineReducers } from 'redux';
import {messageState} from './MessageReducer';

const RootReducer = combineReducers({
    messageState
});

export default RootReducer;
