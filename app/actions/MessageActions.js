import * as types from '../constants/ActionTypes';

export function addMessage(text) {
    return {
        type: types.ADD_MESSAGE,
        text
    };
}

export function deleteMessage(id) {
    return {
        type: types.DELETE_MESSAGE,
        id
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
