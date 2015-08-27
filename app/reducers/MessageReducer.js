import * as Action from '../constants/ActionTypes';
import uuid from 'node-uuid';
import Message from '../models/Message';
import * as _ from 'lodash';

const initialState = [];

export default function messages(state = initialState, action = {}) {
    switch (action.type) {

        case Action.ADD_MESSAGE:
            let newMessage = new Message(action.text);
            return state.concat(newMessage);

       /* case Action.RECEIVE_MESSAGE:
            let receivedMessage = action.message;
            receivedMessage.sequenceId = _.uniqueId('message');
            return state.concat(receivedMessage);*/

        case Action.DELETE_MESSAGE:
            return state.filter(message =>
                message.id !== action.id
            );

        case Action.UPDATE_MESSAGE_STATUS:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {status: action.status}) :
                        message
            );

        case Action.SELECT_MESSAGE:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {selected: !message.selected}) :
                        message
            );

        case Action.SELECT_ALL:
            const areAllSelected = state.every(message => message.selected);
            return state.map(message => Object.assign({}, message, {
                selected: !areAllSelected
            }));

        case Action.CLEAR_SELECTED:
            return state.filter(message => message.selected === false);

        case Action.DELETE_SELECTED_MESSAGE:
            return state.filter(message =>
                message.selected === false
            );

        default:
            return state;
    }
}
