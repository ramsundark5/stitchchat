import * as Action from '../constants/ActionTypes';
import uuid from 'node-uuid';
import Message from '../models/Message';

const initialState = [];

export default function messages(state = initialState, action) {
    switch (action.type) {

        case Action.ADD_MESSAGE:
            let newMessage = new Message(action.text);
            return [newMessage, ...state];

        case Action.DELETE_MESSAGE:
            return state.filter(message =>
                message.id !== action.id
            );

        case Action.UPDATE_MESSAGE_STATUS:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {text: action.status}) :
                        message
            );

        case Action.SELECT_MESSAGE:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {selected: !message.selected}) :
                        message
            );

        case Action.SELECT_ALL:
            const areAllSelected = state.every(message => message.marked);
            return state.map(message => Object.assign({}, message, {
                selected: !areAllSelected
            }));

        case Action.CLEAR_SELECTED:
            return state.filter(message => message.selected === false);

        case Action.DELETE_SELECTED:
            return state.filter(message =>
                message.selected === true
            );

        default:
            return state;
    }
}
