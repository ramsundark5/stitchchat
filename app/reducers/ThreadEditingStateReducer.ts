/**
 * Created by ramsundar on 9/8/15.
 */
import * as Action from '../constants/ActionTypes';

export function isThreadInEditingState(state = false, action = {}) {
    switch (action.type) {

        case Action.START_THREAD_EDITING_STATE:
            return true;

        case Action.END_THREAD_EDITING_STATE:
            return false;

        case Action.DELETE_SELECTED_THREAD:
            return false;

        default:
            return state;
    }
}