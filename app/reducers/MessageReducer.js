import * as Action from '../constants/ActionTypes';
import Message from '../models/Message';
import * as _ from 'lodash';
import {copyMessagesToClipBoard} from '../services/CopyService';

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

//let samplemessages = [testSenderMessage1, testReceiverMessage1, testSenderMessage2, testReceiverMessage2];
const initialState = { messages : [], isEditing: false, currentThread: null};
//const initialState = { messages : samplemessages, isEditing: false, currentThread: null};

export function messageState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.ADD_MESSAGE:
            let newMessage = new Message(action.text);
            let messagesAfterAdd = state.messages.concat(newMessage)
            let newStateAfterAdd =  _.assign({}, state, { 'messages' : messagesAfterAdd });
            return newStateAfterAdd;

        case Action.DELETE_MESSAGE:
            let messagesAfterDelete = state.messages.filter(message =>
                message.id !== action.id
            );
            let newStateAfterDelete =  _.assign({}, state, { 'messages' : messagesAfterDelete });
            return newStateAfterDelete;

        case Action.UPDATE_MESSAGE_STATUS:
            let messagesAfterUpdate =  state.messages.map(message =>
                    message.id === action.id
                        ? _.assign({}, message, {status: action.status})
                        : message
            );

            let newStateAfterUpdate =  _.assign({}, state, { 'messages' : messagesAfterUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_MESSAGE:
            let messagesAfterSelect =  state.messages.map(message =>
                    message.id === action.id ?
                        _.assign({}, message, {selected: !message.selected}) :
                        message
            );
            let atleastOneSelected = messagesAfterSelect.some(message => message.selected);
            let newStateAfterSelect =  _.assign({}, state, { 'messages' : messagesAfterSelect, 'isEditing': atleastOneSelected });
            return newStateAfterSelect;

        case Action.SELECT_ALL:
            const areAllSelected = state.messages.every(message => message.selected);
            let messagesAfterSelectAll =  state.map(message => _.assign({}, message, {
                selected: !areAllSelected
            }));
            let enableEditingMode = messagesAfterSelectAll.some(message => message.selected);
            let newStateAfterSelectAll =  _.assign({}, state, { 'messages' : messagesAfterSelectAll, 'isEditing': enableEditingMode });
            return newStateAfterSelectAll;

        case Action.CLEAR_SELECTED_MESSAGE:
            let messagesAfterClearSelected = state.messages.map(message => _.assign({}, message, {
                selected: false
            }));
            let newStateAfterClearSelected =  _.assign({}, state, { 'messages' : messagesAfterClearSelected, 'isEditing': false });
            return newStateAfterClearSelected ;

        case Action.DELETE_SELECTED_MESSAGE:
            let messagesAfterDeleteSelected = state.messages.filter(message =>
                message.selected === false
            );
            let newStateAfterDeleteSelected =  _.assign({}, state, { 'messages' : messagesAfterDeleteSelected, 'isEditing': false });
            return newStateAfterDeleteSelected;

        case Action.COPY_SELECTED_MESSAGE:
            let copiedMessageList = state.messages.filter(message =>
                message.selected === true
            );
            copyMessagesToClipBoard(copiedMessageList);
            return messageState(state, {
                type: Action.CLEAR_SELECTED_MESSAGE
            });

        case Action.LOAD_OLDER_MESSAGES:
            return state;

        default:
            return state;
    }
}


