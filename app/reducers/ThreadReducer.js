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

//const initialState = [testSenderMessage1, testReceiverMessage1, testSenderMessage2, testReceiverMessage2];
const initialState = [];

export function threads(state = initialState, action = {}) {
    switch (action.type) {

        case Action.ADD_THREAD:
            let newThread = new Thread(action.recipientId);
            return state.concat(newThread);

        case Action.DELETE_THREAD:
            return state.filter(thread =>
                thread.id !== thread.id
            );

        case Action.UPDATE_THREAD:
            return state.map(thread =>
                    thread.id === action.thread.id ?
                        Object.assign({}, thread, {lastMessageTime: action.thread.lastMessageTime,
                                                   lastMessageText: action.thread.lastMessageText,
                                                   lastMessageTime: action.thread.lastMessageTime,
                                                   direction: action.thread.direction}) :
                        thread
            );

        case Action.SELECT_THREAD:
            return state.map(thread =>
                    thread.id === action.id ?
                        Object.assign({}, thread, {selected: !thread.selected}) :
                        thread
            );

        case Action.CLEAR_SELECTED_THREAD:
            return state.map(thread => Object.assign({}, thread, {
                selected: false
            }));

        case Action.DELETE_SELECTED_THREAD:
            return state.filter(thread =>
                thread.selected === false
            );

        case Action.LOAD_MORE_THREADS:
            return state;

        default:
            return state;
    }
}


