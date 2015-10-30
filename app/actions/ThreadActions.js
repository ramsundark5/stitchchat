import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';

export function loadRecentThreads(threads){
    return{
        type: Actions.LOAD_RECENT_THREADS,
        threads
    }
}

export function addNewThread(thread) {
    return {
        type: Actions.ADD_THREAD,
        thread
    };
}

export function deleteThread(thread) {
    return {
        type: Actions.DELETE_THREAD,
        thread
    };
}

export function selectThread(thread) {
    return {
        type: Actions.SELECT_THREAD,
        thread
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