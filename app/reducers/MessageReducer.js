import * as Action from '../constants/ActionTypes';
import Message from '../models/Message';
import * as _ from 'lodash';
import moment from 'moment';
import update from 'react-addons-update';

const initialState = { messages : {}, isEditing: false, showLoadingSpinner: false,
    isMediaOptionsVisible: false, scrollToBottom: false, retainScrollPosition: false,
    showMessageComposer: true};

export default function messageState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.ADD_MESSAGE:
            let newMessage = action.message;

            let clonedMessagesForAdd = _.assign({}, state.messages);
            let date = newMessage.timestamp;
            let formattedDate = moment(date).format('MM/DD/YYYY');
            if(!clonedMessagesForAdd[formattedDate]){
                clonedMessagesForAdd[formattedDate] = [];
            }
            clonedMessagesForAdd[formattedDate].push(newMessage);

            let newStateAfterAdd =  _.assign({}, state, { 'messages' : clonedMessagesForAdd, scrollToBottom: true });
            return newStateAfterAdd;

        case Action.DELETE_MESSAGE:
            let clonedMessagesForDelete = _.assign({}, state.messages);
            for (let messageDate in state.messages) {
                if (state.messages.hasOwnProperty(messageDate)) {
                    if(!(state.messages[messageDate] && state.messages[messageDate].length > 0)){
                        console.log('Something is not right'+ state.messages[messageDate]);
                        continue;
                    }
                    for(let i=0; i < state.messages[messageDate].length; i++){
                        let message = state.messages[messageDate][i];
                        if(message.id == action.id){
                            let newMessagesForDate = state.messages[messageDate].splice(i, 1);
                            clonedMessagesForDelete[messageDate] = newMessagesForDate;
                            break;
                        }
                    }
                }
            }

            let newStateAfterDelete =  _.assign({}, state, { 'messages' : clonedMessagesForDelete });
            return newStateAfterDelete;

        case Action.UPDATE_MESSAGE_STATUS:
            let clonedMessagesForUpdate = Object.assign({}, state.messages);

            for (let messageDate in state.messages) {
                if (state.messages.hasOwnProperty(messageDate)) {
                    if(!(state.messages[messageDate] && state.messages[messageDate].length > 0)){
                        console.log('Something is not right'+ state.messages[messageDate]);
                        continue;
                    }
                    for(let i=0; i < state.messages[messageDate].length; i++){
                        let message = state.messages[messageDate][i];
                        if(message.id == action.id){
                            let newMessageForUpdate = Object.assign({}, new Message(), message);
                            newMessageForUpdate.status = action.status;
                            //replace the existing messages for date with new one. this is required to simulate deep clone
                            let newMessagesForDate = update(state.messages[messageDate], {$splice: [[i, 1, newMessageForUpdate]]});
                            clonedMessagesForUpdate[messageDate] = newMessagesForDate;
                            break;
                        }
                    }
                }

            }

            let newStateAfterUpdate =  _.assign({}, state, { 'messages' : clonedMessagesForUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_MESSAGE:

            let clonedMessagesForSelect = Object.assign({}, state.messages);
            let atleastOneSelected = false;
            for (let messageDate in state.messages) {
                if (state.messages.hasOwnProperty(messageDate)) {
                    if(!(state.messages[messageDate] && state.messages[messageDate].length > 0)){
                        console.log('Something is not right'+ state.messages[messageDate]);
                        continue;
                    }
                    for(let i=0; i < state.messages[messageDate].length; i++){
                        let message = state.messages[messageDate][i];
                        if(message.id == action.id){
                            let newSelectedMessage = Object.assign({}, new Message(), message);
                            newSelectedMessage.selected = !message.selected;
                            //replace the existing messages for date with new one. this is required to simulate deep clone
                            let newMessagesForDate = update(state.messages[messageDate], {$splice: [[i, 1, newSelectedMessage]]});
                            clonedMessagesForSelect[messageDate] = newMessagesForDate;
                        }
                        if(clonedMessagesForSelect[messageDate][i].selected){
                            atleastOneSelected = true;
                        }
                    }
                }

            }
            let newStateAfterSelect =  Object.assign({}, state, { 'messages' : clonedMessagesForSelect, 'isEditing': atleastOneSelected });
            return newStateAfterSelect;

        case Action.CLEAR_SELECTED_MESSAGE:
            let clonedMessagesForClear = _.assign({}, state.messages);
            for (let messageDate in clonedMessagesForClear) {
                if (clonedMessagesForClear.hasOwnProperty(messageDate)) {
                    if(!(clonedMessagesForClear[messageDate] && clonedMessagesForClear[messageDate].length > 0)){
                        console.log('Something is not right'+ clonedMessagesForSelect[messageDate]);
                        continue;
                    }
                    let newClearedMessagesForDate = clonedMessagesForClear[messageDate].map(message =>
                        Object.assign({}, message, {
                        selected: false
                    }));
                    clonedMessagesForClear[messageDate] = newClearedMessagesForDate;
                }
            }
            let newStateAfterClearSelected =  _.assign({}, state, { 'messages' : clonedMessagesForClear, 'isEditing': false });
            return newStateAfterClearSelected;

        case Action.DELETE_SELECTED_MESSAGE:
            let clonedMessagesForDeleteSelected = _.assign({}, state.messages);
            for (let messageDate in clonedMessagesForDeleteSelected) {
                if (clonedMessagesForDeleteSelected.hasOwnProperty(messageDate)) {
                    if(!(clonedMessagesForDeleteSelected[messageDate] && clonedMessagesForDeleteSelected[messageDate].length > 0)){
                        continue;
                    }
                    let newMessagesForDate = clonedMessagesForDeleteSelected[messageDate].filter(message =>
                        message.selected != true
                    )
                    clonedMessagesForDeleteSelected[messageDate] = newMessagesForDate;
                }
            }

            let newStateAfterDeleteSelected =  _.assign({}, state, { 'messages' : clonedMessagesForDeleteSelected, 'isEditing': false });
            return newStateAfterDeleteSelected;

        case Action.COPY_SELECTED_MESSAGE:
            return messageState(state, {
                type: Action.CLEAR_SELECTED_MESSAGE
            });

        case Action.LOAD_MESSAGES_FOR_THREAD:
            let messagesForThread = action.messages;

            let groupedMessage = {};
            for(let i=0; i < messagesForThread.length; i++){
                let date = messagesForThread[i].timestamp;
                let formattedDate = moment(date).format('MM/DD/YYYY');
                if(!groupedMessage[formattedDate]){
                    groupedMessage[formattedDate] = [];
                }
                groupedMessage[formattedDate].push(messagesForThread[i]);
            }

            let newStateAfterLoadingMessages =  _.assign({}, state, { 'messages' : groupedMessage});
            return newStateAfterLoadingMessages ;

        case Action.LOAD_OLDER_MESSAGES:
            let olderMessages = action.messages;
            let clonedMessagesForLoadOlder = Object.assign({}, state.messages);
            let groupedOlderMessage = {};
            let overlappingMessages = [];
            let overlappingDate = null;
            for(let i=0; i < olderMessages.length; i++){
                let date = olderMessages[i].timestamp;
                let formattedDate = moment(date).format('MM/DD/YYYY');

                //capture overlapping messages for given date separately
                if(state.messages[formattedDate]){
                    overlappingDate = formattedDate;
                    overlappingMessages.push(olderMessages[i]);
                }else{
                    if(!groupedOlderMessage[formattedDate]){
                        groupedOlderMessage[formattedDate] = [];
                    }
                    groupedOlderMessage[formattedDate].push(olderMessages[i]);
                }
            }
            let updatedMessages = overlappingMessages.concat(clonedMessagesForLoadOlder[overlappingDate]);
            clonedMessagesForLoadOlder[overlappingDate] = updatedMessages;

            let mergedMessages = Object.assign({}, groupedOlderMessage, clonedMessagesForLoadOlder);
            let newStateAfterLoadOlder =  Object.assign({}, state, {
                'messages' : mergedMessages,
                'retainScrollPosition': true,
                'showLoadingSpinner': false
            });
            return newStateAfterLoadOlder;

        case Action.SHOW_MEDIA_OPTIONS:
            let newStateAfterShowingMediaOptions =  _.assign({}, state, { 'isMediaOptionsVisible' : true });
            return newStateAfterShowingMediaOptions ;

        case Action.HIDE_MEDIA_OPTIONS:
            let newStateAfterHidingMediaOptions =  _.assign({}, state, { 'isMediaOptionsVisible' : false });
            return newStateAfterHidingMediaOptions ;

        case Action.SHOW_MESSAGE_COMPOSER:
            if(state.showMessageComposer){
                return state;
            }
            let newStateAfterShowingMessageComposer =  _.assign({}, state, { 'showMessageComposer' : true });
            return newStateAfterShowingMessageComposer ;

        case Action.HIDE_MESSAGE_COMPOSER:
            if(!state.showMessageComposer){
                return state;
            }
            let newStateAfterHidingMessageComposer =  _.assign({}, state, { 'showMessageComposer' : false });
            return newStateAfterHidingMessageComposer ;

        case Action.RESET_MESSAGES_STATE:
            let newStateAfterReset = _.assign({}, state, initialState);
            return newStateAfterReset;

        case Action.RESET_SCROLLTOBOTTOM:
            let newStateAfterResetScrollToBottom =  _.assign({}, state, { scrollToBottom: false});
            return newStateAfterResetScrollToBottom ;

        case Action.SHOW_LOADING_SPINNER:
            let newStateAfterShowLoadingSpinner =  _.assign({}, state, { 'showLoadingSpinner': true});
            return newStateAfterShowLoadingSpinner ;

        case Action.RESET_REMEMBER_SCROLL_POSITION:
            let newStateAfterResetRetainScrollPosition =  _.assign({}, state, { 'retainScrollPosition': false});
            return newStateAfterResetRetainScrollPosition ;

        default:
            return state;
    }
}


