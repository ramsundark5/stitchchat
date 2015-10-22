import { combineReducers } from 'redux';
import {messageState} from './MessageReducer';
import {threadState} from './ThreadReducer';
import {contactState} from './ContactReducer';

const RootReducer = combineReducers({
    messageState,
    threadState,
    contactState
});

export default RootReducer;
