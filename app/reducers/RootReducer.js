import { combineReducers } from 'redux';
import messages from './MessageReducer';

const RootReducer = combineReducers({
    messages
});

export default RootReducer;
