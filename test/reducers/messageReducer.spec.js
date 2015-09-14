import expect from 'expect';
import {messageState} from '../../app/reducers/MessageReducer';
import Message from '../../app/models/Message'
import * as types from '../../app/constants/ActionTypes';
import * as Status from '../../app/constants/MessageConstants.js';
import uuid from 'node-uuid';
import sinon from 'sinon';

describe('Message reducer tests', () => {

    let state;
    beforeEach(() => {
        state = { messages:[], isEditing: false};
    });

    it('initial state should be empty array', () => {
        let stateAfterInit = messageState(undefined, {});
        expect(stateAfterInit).toEqual(state);
    });

    it('ADD_MESSAGE should add message instance to existing collection', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd.messages[1].text).toEqual('second message');
    });

    it('DELETE_MESSAGE should delete from existing collection', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd.messages[1].text).toEqual('second message');

        let secondMessageId = stateAfterSecondAdd.messages[1].id;
        let deleteAction = {
            type: types.DELETE_MESSAGE,
            id: secondMessageId
        };

        let stateAfterMessageDelete = messageState(stateAfterSecondAdd, deleteAction);
        expect(stateAfterMessageDelete.messages[0].text).toEqual('first message');
        expect(stateAfterMessageDelete.messages.length).toBe(1);
    });

    it('SELECT_MESSAGE should select or unselect the given message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');
        expect(stateAfterFirstAdd.messages[0].selected).toBe(false);

        let firstMessageId = stateAfterFirstAdd.messages[0].id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterFirstAdd, selectAction);
        expect(stateAfterMessageSelect.messages[0].selected).toBe(true);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let unselectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageUnselect = messageState(stateAfterMessageSelect, unselectAction);
        expect(stateAfterMessageUnselect.messages[0].selected).toBe(false);
        expect(stateAfterMessageUnselect.isEditing).toBe(false);
    });

    it('UPDATE_MESSAGE_STATUS should update status of the given message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');
        expect(stateAfterFirstAdd.messages[0].status).toEqual(Status.STATUS_PENDING);

        let firstMessageId = stateAfterFirstAdd.messages[0].id;
        let updateReceivedStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_RECEIVED
        };

        let stateAfterReceivedMessageUpdate = messageState(stateAfterFirstAdd, updateReceivedStatusAction);
        expect(stateAfterReceivedMessageUpdate.messages[0].status).toEqual(Status.STATUS_RECEIVED);

        let updateSentStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_SENT
        };

        let stateAfterSentMessageUpdate = messageState(stateAfterReceivedMessageUpdate, updateSentStatusAction);
        expect(stateAfterSentMessageUpdate.messages[0].status).toEqual(Status.STATUS_SENT);
    });

    it('DELETE_SELECTED should delete the selected message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');
        expect(stateAfterFirstAdd.messages[0].selected).toBe(false);

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd.messages[1].text).toEqual('second message');

        let firstMessageId = stateAfterFirstAdd.messages[0].id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterSecondAdd, selectAction);
        expect(stateAfterMessageSelect.messages[0].selected).toBe(true);
        expect(stateAfterMessageSelect.messages[1].selected).toBe(false);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let deleteSelectedAction = {
            type: types.DELETE_SELECTED_MESSAGE
        };

        let stateAfterDeleteSelected = messageState(stateAfterMessageSelect, deleteSelectedAction);
        expect(stateAfterDeleteSelected.messages[0].text).toEqual('second message');
        expect(stateAfterDeleteSelected.messages[0].selected).toBe(false);
        expect(stateAfterDeleteSelected.messages.length).toBe(1);
        expect(stateAfterDeleteSelected.isEditing).toBe(false);
    });

    it('CLEAR_SELECTED should clear the selected message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        expect(stateAfterFirstAdd.messages[0].text).toEqual('first message');
        expect(stateAfterFirstAdd.messages[0].selected).toBe(false);

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd.messages[1].text).toEqual('second message');

        let firstMessageId = stateAfterFirstAdd.messages[0].id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterSecondAdd, selectAction);
        expect(stateAfterMessageSelect.messages[0].selected).toBe(true);
        expect(stateAfterMessageSelect.messages[1].selected).toBe(false);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let clearSelectedAction = {
            type: types.CLEAR_SELECTED_MESSAGE
        };

        let stateAfterClearSelected = messageState(stateAfterMessageSelect, clearSelectedAction);
        expect(stateAfterClearSelected.messages[0].selected).toBe(false);
        expect(stateAfterClearSelected.isEditing).toBe(false);
    });

});