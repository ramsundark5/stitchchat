import * as Actions from '../constants/ActionTypes';

export function loadMessagesForThread(messages){
    if(!messages){
        messages = [];
    }
    return {
        type: Actions.LOAD_MESSAGES_FOR_THREAD,
        messages
    };
}

export function addMessage(message) {
    return {
        type: Actions.ADD_MESSAGE,
        message
    };
}

export function deleteMessage(message) {
    return {
        type: Actions.DELETE_MESSAGE,
        message
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

export function loadOlderMessages(messages){
    if(!messages){
        messages = [];
    }
    return {
        type: Actions.LOAD_OLDER_MESSAGES,
        messages
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
export function resetMessageState() {
    return {
        type: Actions.RESET_MESSAGES_STATE,
    };
}

export function showMediaOptions() {
    return {
        type: Actions.SHOW_MEDIA_OPTIONS,
    };
}

export function hideMediaOptions() {
    return {
        type: Actions.HIDE_MEDIA_OPTIONS,
    };
}

export function showMessageComposer() {
    return {
        type: Actions.SHOW_MESSAGE_COMPOSER,
    };
}

export function hideMessageComposer() {
    return {
        type: Actions.HIDE_MESSAGE_COMPOSER,
    };
}

export function resetScrollToBottom(){
    return{
        type: Actions.RESET_SCROLLTOBOTTOM
    };
}

export function resetRetainScrollPosition(){
    return{
        type: Actions.RESET_REMEMBER_SCROLL_POSITION
    };
}

export function showLoadingSpinner(){
    return{
        type: Actions.SHOW_LOADING_SPINNER
    };
}
