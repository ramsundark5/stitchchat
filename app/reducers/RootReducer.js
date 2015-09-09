import { combineReducers } from 'redux';
import {messages} from './MessageReducer';
import {isEditing} from './EditingStateReducer';

const RootReducer = combineReducers({
    messages,
    isEditing
});

export default RootReducer;
