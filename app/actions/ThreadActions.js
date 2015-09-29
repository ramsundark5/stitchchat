import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';
import Contact from '../models/Contact';
import GroupInfo from '../models/GroupInfo';

export function addNewThread(recipientContactInfo: Contact) {
    return {
        type: Actions.ADD_THREAD,
        recipientContactInfo,
        false,
        null
    };
}

export function addNewGroupThread(recipientContactInfo: Contact, isGroupThread: boolean, groupInfo: GroupInfo) {
    return {
        type: Actions.ADD_THREAD,
        recipientContactInfo,
        isGroupThread,
        groupInfo
    };
}

export function deleteThread(id) {
    return {
        type: Actions.DELETE_THREAD,
        id
    };
}

export function selectThread(id) {
    return {
        type: Actions.SELECT_THREAD,
        id
    };
}

export function clearSelectedThread() {
    return {
        type: Actions.CLEAR_SELECTED_THREAD
    };
}

export function deleteSelectedThread() {
    return {
        type: Actions.DELETE_SELECTED_THREAD
    };
}

export function updateThread(thread) {
    return {
        type: Actions.UPDATE_THREAD,
        thread
    };
}

export function loadMoreThreads(){
    return{
        type: Actions.LOAD_MORE_THREADS
    }
}

export function setCurrentThread(thread) {
    return {
        type: Actions.SET_CURRENT_THREAD,
        thread
    };
}

export function searchThreads(searchText) {
    return {
        type: Actions.SEARCH_THREADS,
        searchText
    };
}