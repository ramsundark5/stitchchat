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

export function startEditing() {
    return {
        type: Actions.START_EDITING_STATE,
    };
}

export function endEditing() {
    return {
        type: Actions.END_EDITING_STATE,
    };
}

export function selectAndSetEditingMode(id) {
    return (dispatch, getState) => {
        //first complete the select action
        dispatch(selectMessage(id));

        //even though the word dispatch sounds async, this is a sync action. getstate() will return
        //current state after any changes from the previous dispatch
        let currentState = getState();

        let atleastOneSelected = currentState.messages.some(message => message.selected);
        if(!atleastOneSelected){
            dispatch(endEditing());
        }
        else if(!currentState.isEditing){
            dispatch(startEditing());
        }
    };
}