import * as Actions from '../constants/ActionTypes';

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