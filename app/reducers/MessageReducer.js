import * as Action from '../constants/ActionTypes';
import Message from '../models/Message';
import * as _ from 'lodash';
import {copyMessagesToClipBoard} from '../services/CopyService';

const initialState = { messages : [], isEditing: false, currentThread: null, isMediaOptionsVisible: false};

export function messageState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.ADD_MESSAGE:
            let newMessage = action.message;
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

        case Action.LOAD_MESSAGES_FOR_THREAD:
            let messagesForThread = action.messages;
            let newStateAfterLoadingMessages =  _.assign({}, state, { 'messages' : messagesForThread });
            return newStateAfterLoadingMessages ;

        case Action.LOAD_OLDER_MESSAGES:
            return state;

        case Action.SHOW_MEDIA_OPTIONS:
            let newStateAfterShowingMediaOptions =  _.assign({}, state, { 'isMediaOptionsVisible' : true });
            return newStateAfterShowingMediaOptions ;

        case Action.HIDE_MEDIA_OPTIONS:
            let newStateAfterHidingMediaOptions =  _.assign({}, state, { 'isMediaOptionsVisible' : false });
            return newStateAfterHidingMediaOptions ;

        case Action.RESET_MESSAGES_STATE:
            let newStateAfterReset = _.assign({}, state, initialState);
            return newStateAfterReset;

        default:
            return state;
    }
}


