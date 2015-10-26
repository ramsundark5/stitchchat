import * as Action from '../constants/ActionTypes';
import Thread from '../models/Thread';
import * as _ from 'lodash';

const initialState = { threads : [], isEditing: false, currentThread: null};

export function threadState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.LOAD_RECENT_THREADS:
            let recentThreads     = action.threads;
            let newStateAfterInit =  _.assign({}, state, { 'threads' : recentThreads });
            return newStateAfterInit;

        case Action.ADD_THREAD:
            let newThread        = action.thread;
            let threadsAfterAdd  = state.threads.concat(newThread);
            let newStateAfterAdd =  _.assign({}, state, { 'threads' : threadsAfterAdd });
            return newStateAfterAdd;

        case Action.DELETE_THREAD:
            let threadsAfterDelete = state.threads.filter(thread =>
                thread.id !== action.id
            );
            let newStateAfterDelete =  _.assign({}, state, { 'threads' : threadsAfterDelete });
            return newStateAfterDelete;

        case Action.UPDATE_THREAD:
            let threadsAfterUpdate =  state.threads.map(thread =>
                    thread.id === action.thread.id ?
                        Object.assign({}, thread, action.thread) :
                        thread
            );

            let newStateAfterUpdate =  _.assign({}, state, { 'threads' : threadsAfterUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_THREAD:
            let threadsAfterSelect =  state.threads.map(thread =>
                    thread.id === action.id ?
                        _.assign({}, thread, {selected: !thread.selected}) :
                        thread
            );
            let atleastOneSelected = threadsAfterSelect.some(thread => thread.selected);
            let newStateAfterSelect =  _.assign({}, state, { 'threads' : threadsAfterSelect, 'isEditing': atleastOneSelected });
            return newStateAfterSelect;

        case Action.CLEAR_SELECTED_THREAD:
            let threadsAfterClearSelected = state.threads.map(thread => _.assign({}, thread, {
                selected: false
            }));
            let newStateAfterClearSelected =  _.assign({}, state, { 'threads' : threadsAfterClearSelected, 'isEditing': false });
            return newStateAfterClearSelected ;

        case Action.DELETE_SELECTED_THREAD:
            let threadsAfterDeleteSelected = state.threads.filter(thread =>
                thread.selected === false
            );
            let newStateAfterDeleteSelected =  _.assign({}, state, { 'threads' : threadsAfterDeleteSelected, 'isEditing': false });
            return newStateAfterDeleteSelected;

        case Action.SET_CURRENT_THREAD:
            let currentThread = action.thread;
            let newStateAfterSettingCurrentThread =  _.assign({}, state, { 'currentThread': currentThread });
            return newStateAfterSettingCurrentThread;

        case Action.LOAD_MORE_THREADS:
            return state;

        default:
            return state;
    }
}


