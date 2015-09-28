import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';

export function addMessage(text) {
    return {
        type: Actions.ADD_MESSAGE,
        text
    };
}

export function deleteMessage(id) {
    return {
        type: Actions.DELETE_MESSAGE,
        id
    };
}

export function selectMessage(id) {
    return {
        type: Actions.SELECT_MESSAGE,
        id
    };
}

export function selectAll() {
    return {
        type: Actions.SELECT_ALL
    };
}

export function clearSelected() {
    return {
        type: Actions.CLEAR_SELECTED_MESSAGE
    };
}

export function deleteSelected() {
    return {
        type: Actions.DELETE_SELECTED_MESSAGE
    };
}

export function updateMessageStatus(id, status) {
    return {
        type: Actions.UPDATE_MESSAGE_STATUS,
        id,
        status
    };
}

export function startEditing() {
    return {
        type: Actions.START_MESSAGE_EDITING_STATE,
    };
}

export function endEditing() {
    return {
        type: Actions.END_MESSAGE_EDITING_STATE,
    };
}

export function loadOlderMessages(){
    return {
        type: Actions.LOAD_OLDER_MESSAGES,
    };
}

export function copySelectedMessages(){
    return {
        type: Actions.COPY_SELECTED_MESSAGE,
    };
}

export function forwardSelected(){
    return {
        type: Actions.FORWARD_SELECTED_MESSAGE,
    };
}