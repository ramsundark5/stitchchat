import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';
import Contact from '../models/Contact';
import GroupInfo from '../models/GroupInfo';

export function addThread(recipientContactInfo: Contact, isGroupThread: boolean, groupInfo: GroupInfo) {
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
