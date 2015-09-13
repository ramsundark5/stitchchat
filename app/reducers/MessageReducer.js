import * as Action from '../constants/ActionTypes';
import uuid from 'node-uuid';
import Message from '../models/Message';
import * as _ from 'lodash';

let testSenderMessage1   = new Message('asdas \ndadasdas \nawewae');
testSenderMessage1.owner = true;
testSenderMessage1.timestamp  = new Date(1998, 11, 17);
let testReceiverMessage1 = new Message('asdas \ndadasdas \noiwqeuqwej');
testReceiverMessage1.owner= false;
testReceiverMessage1.timestamp  = new Date(1995, 10, 23);
let testSenderMessage2   = new Message('gahsjdgagsdasjdhjagsdjagdhhsagdjagsahsgydgasydiasgdasdgaisgiy vahsdgjagdsjasjdgvjagsdas');
testSenderMessage2.owner = true;
testSenderMessage2.timestamp  = new Date(1995, 10, 23);
let testReceiverMessage2   = new Message('gahsjdgagsdasjdhjagsdjagdhhsagdjagsahsgydgasydiasgdasdgaisgiy vahsdgjagdsjasjdgvjagsdas');
testReceiverMessage2.owner = false;
testReceiverMessage2.timestamp  = new Date(2015, 2, 1);

const initialState = [testSenderMessage1, testReceiverMessage1, testSenderMessage2, testReceiverMessage2];
//const initialState = [];

export function messages(state = initialState, action = {}) {
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

        case Action.CLEAR_SELECTED_MESSAGE:
            return state.map(message => Object.assign({}, message, {
                selected: false
            }));

        case Action.DELETE_SELECTED_MESSAGE:
            return state.filter(message =>
                message.selected === false
            );

        case Action.LOAD_OLDER_MESSAGES:
            return state;

        default:
            return state;
    }
}


