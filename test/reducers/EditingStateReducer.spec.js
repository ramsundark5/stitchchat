import {isEditing} from '../../app/reducers/EditingStateReducer';
import expect from 'expect';
import * as Action from '../../app/constants/ActionTypes';

describe('Editing state reducer tests', () => {

    it('initial editing state should be false', () => {
        let stateAfterInit = isEditing(undefined, {});
        expect(stateAfterInit).toEqual(false);
    });

    it('START_EDITING_STATE should set state to true', () => {
        let startEditingAction = {
            type: Action.START_EDITING_STATE,
        };
        let stateAfterStartEditingAction = isEditing(false, startEditingAction);
        expect(stateAfterStartEditingAction).toBe(true);
    });

    it('END_EDITING_STATE should set state to false', () => {
        let endEditingAction = {
            type: Action.END_EDITING_STATE,
        };
        let stateAfterEndEditingAction = isEditing(true, endEditingAction);
        expect(stateAfterEndEditingAction).toBe(false);
    });

    it('DELETE_SELECTED_MESSAGE should set state to false', () => {
        let deleteMessageAction = {
            type: Action.DELETE_SELECTED_MESSAGE,
        };
        let stateAfterDeleteMessageAction = isEditing(true, deleteMessageAction);
        expect(stateAfterDeleteMessageAction).toBe(false);
    });
});