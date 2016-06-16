import { combineReducers } from 'redux';
import messageState from './MessageReducer';
import threadState from './ThreadReducer';

const RootReducer = combineReducers({
    messageState,
    threadState
});

export default RootReducer;
