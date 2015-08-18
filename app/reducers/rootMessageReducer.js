import { combineReducers } from 'redux';
import messages from './messageReducer';

const rootMessageReducer = combineReducers({
    messages
});

export default rootMessageReducer;
