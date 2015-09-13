/**
 * Created by ramsundar on 9/8/15.
 */
import * as Action from '../constants/ActionTypes';

export function isEditing(state = false, action = {}) {
    switch (action.type) {

        case Action.START_MESSAGE_EDITING_STATE:
            return true;

        case Action.END_MESSAGE_EDITING_STATE:
            return false;

        case Action.DELETE_SELECTED_MESSAGE:
            return false;

        default:
            return state;
    }
}