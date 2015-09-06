import { combineReducers } from 'redux';
import {messages, isEditing} from './MessageReducer';

const RootReducer = combineReducers({
    messages,
    isEditing
});

export default RootReducer;
