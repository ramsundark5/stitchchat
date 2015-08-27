import expect from 'expect';
import messages from '../../app/reducers/MessageReducer';
import Message from '../../app/models/Message'
import * as types from '../../app/constants/ActionTypes';
import * as Status from '../../app/constants/MessageConstants.js';
import uuid from 'node-uuid';

describe('Message reducer tests', () => {

    it('initial state should be empty array', () => {
        let stateAfterInit = messages(undefined, {});
        expect(stateAfterInit).toEqual([]);
    });

    it('ADD_MESSAGE should add message instance to existing collection', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messages([], firstNewMessageAction);
        expect(stateAfterFirstAdd[0].text).toEqual('first message');

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messages(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd[1].text).toEqual('second message');
    });

    it('DELETE_MESSAGE should delete from existing collection', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messages([], firstNewMessageAction);
        expect(stateAfterFirstAdd[0].text).toEqual('first message');

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messages(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd[1].text).toEqual('second message');

        let secondMessageId = stateAfterSecondAdd[1].id;
        let deleteAction = {
            type: types.DELETE_MESSAGE,
            id: secondMessageId
        };

        let stateAfterMessageDelete = messages(stateAfterSecondAdd, deleteAction);
        expect(stateAfterMessageDelete[0].text).toEqual('first message');
        expect(stateAfterMessageDelete.length).toBe(1);
    });

    it('SELECT_MESSAGE should select or unselect the given message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messages([], firstNewMessageAction);
        expect(stateAfterFirstAdd[0].text).toEqual('first message');
        expect(stateAfterFirstAdd[0].selected).toBe(false);

        let firstMessageId = stateAfterFirstAdd[0].id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messages(stateAfterFirstAdd, selectAction);
        expect(stateAfterMessageSelect[0].selected).toBe(true);

        let unselectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageUnselect = messages(stateAfterMessageSelect, unselectAction);
        expect(stateAfterMessageUnselect[0].selected).toBe(false);
    });

    it('UPDATE_MESSAGE_STATUS should update status of the given message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messages([], firstNewMessageAction);
        expect(stateAfterFirstAdd[0].text).toEqual('first message');
        expect(stateAfterFirstAdd[0].status).toEqual(Status.STATUS_PENDING);

        let firstMessageId = stateAfterFirstAdd[0].id;
        let updateReceivedStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_RECEIVED
        };

        let stateAfterReceivedMessageUpdate = messages(stateAfterFirstAdd, updateReceivedStatusAction);
        expect(stateAfterReceivedMessageUpdate[0].status).toEqual(Status.STATUS_RECEIVED);

        let updateSentStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_SENT
        };

        let stateAfterSentMessageUpdate = messages(stateAfterReceivedMessageUpdate, updateSentStatusAction);
        expect(stateAfterSentMessageUpdate[0].status).toEqual(Status.STATUS_SENT);
    });

    it('DELETE_SELECTED should delete the selected message', () => {
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'first message'
        };
        let stateAfterFirstAdd = messages([], firstNewMessageAction);
        expect(stateAfterFirstAdd[0].text).toEqual('first message');
        expect(stateAfterFirstAdd[0].selected).toBe(false);

        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            text: 'second message'
        };
        let stateAfterSecondAdd = messages(stateAfterFirstAdd, secondNewMessageAction);
        expect(stateAfterSecondAdd[1].text).toEqual('second message');

        let firstMessageId = stateAfterFirstAdd[0].id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messages(stateAfterSecondAdd, selectAction);
        expect(stateAfterMessageSelect[0].selected).toBe(true);
        expect(stateAfterMessageSelect[1].selected).toBe(false);

        let deleteSelectedAction = {
            type: types.DELETE_SELECTED_MESSAGE
        };

        let stateAfterDeleteSelected = messages(stateAfterMessageSelect, deleteSelectedAction);
        expect(stateAfterDeleteSelected[0].text).toEqual('second message');
        expect(stateAfterDeleteSelected[0].selected).toBe(false);
        expect(stateAfterDeleteSelected.length).toBe(1);
    });

});