import * as types from '../constants/ActionTypes';

export function addMessage(text) {
    return {
        type: types.ADD_MESSAGE,
        selected: false,
        text
    };
}

export function deleteMessage(id) {
    return {
        type: types.DELETE_MESSAGE,
        id
    };
}

export function editMessage(id, text) {
    return {
        type: types.EDIT_MESSAGE,
        id,
        text
    };
}

export function selectMessage(id) {
    return {
        type: types.SELECT_MESSAGE,
        id
    };
}

export function selectAll() {
    return {
        type: types.SELECT_ALL
    };
}

export function deleteSelected() {
    return {
        type: types.DELETE_SELECTED
    };
}
