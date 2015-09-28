import expect from 'expect';
import {threadState} from '../../app/reducers/ThreadReducer';
import Thread from '../../app/models/Thread';
import Contact from '../../app/models/Contact';
import GroupInfo from '../../app/models/GroupInfo';
import * as types from '../../app/constants/ActionTypes';
import * as Status from '../../app/constants/ThreadConstants.js';
import * as _ from 'lodash';

describe('Thread reducer tests', () => {

    let state;
    beforeEach(() => {
        state = { threads:[], isEditing: false, currentThread: null};
    });

    it('initial state should be empty threads array', () => {
        let stateAfterInit = threadState(undefined, {});
        expect(stateAfterInit).toEqual(state);
    });

    it('ADD_THREAD should add Thread instance to existing collection', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondContact = new Contact();
        secondContact.phoneNumber = '2222222222';
        let secondNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: secondContact,
            isGroupThread: false,
            groupInfo: null
        };
        let stateAfterSecondAdd = threadState(stateAfterFirstAdd, secondNewThreadAction);
        expect(stateAfterSecondAdd.threads[1].recipientContactInfo.phoneNumber).toEqual('2222222222');
    });

    it('DELETE_THREAD should delete from existing collection', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondContact = new Contact();
        secondContact.phoneNumber = '2222222222';
        let secondNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: secondContact,
            isGroupThread: false,
            groupInfo: null
        };
        let stateAfterSecondAdd = threadState(stateAfterFirstAdd, secondNewThreadAction);
        expect(stateAfterSecondAdd.threads[1].recipientContactInfo.phoneNumber).toEqual('2222222222');

        let secondThreadId = stateAfterSecondAdd.threads[1].id;
        let deleteAction = {
            type: types.DELETE_THREAD,
            id: secondThreadId
        };

        let stateAfterThreadDelete = threadState(stateAfterSecondAdd, deleteAction);
        expect(stateAfterThreadDelete.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');
        expect(stateAfterThreadDelete.threads.length).toBe(1);
    });

    it('SELECT_THREAD should select or unselect the given Thread', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');
        expect(stateAfterFirstAdd.threads[0].selected).toBe(false);

        let firstThreadId = stateAfterFirstAdd.threads[0].id;
        let selectAction = {
            type: types.SELECT_THREAD,
            id: firstThreadId
        };

        let stateAfterThreadSelect = threadState(stateAfterFirstAdd, selectAction);
        expect(stateAfterThreadSelect.threads[0].selected).toBe(true);
        expect(stateAfterThreadSelect.isEditing).toBe(true);

        let unselectAction = {
            type: types.SELECT_THREAD,
            id: firstThreadId
        };

        let stateAfterThreadUnselect = threadState(stateAfterThreadSelect, unselectAction);
        expect(stateAfterThreadUnselect.threads[0].selected).toBe(false);
        expect(stateAfterThreadUnselect.isEditing).toBe(false);
    });

    it('UPDATE_THREAD should update status of the given Thread', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');
        expect(stateAfterFirstAdd.threads[0].selected).toBe(false);
        expect(stateAfterFirstAdd.threads[0].count).toBe(0);

        let firstThread = stateAfterFirstAdd.threads[0];
        let threadWithUpdates = _.assign({}, firstThread, {'count': 5});
        let updateThreadStatusAction = {
            type: types.UPDATE_THREAD,
            thread: threadWithUpdates,
        };

        let stateAfterThreadUpdate = threadState(stateAfterFirstAdd, updateThreadStatusAction);
        expect(stateAfterThreadUpdate.threads[0].count).toBe(5);

    });

    it('DELETE_SELECTED should delete the selected Thread', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondContact = new Contact();
        secondContact.phoneNumber = '2222222222';
        let secondNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: secondContact,
            isGroupThread: false,
            groupInfo: null
        };
        let stateAfterSecondAdd = threadState(stateAfterFirstAdd, secondNewThreadAction);
        expect(stateAfterSecondAdd.threads[1].recipientContactInfo.phoneNumber).toEqual('2222222222');

        let firstThreadId = stateAfterFirstAdd.threads[0].id;
        let selectAction = {
            type: types.SELECT_THREAD,
            id: firstThreadId
        };

        let stateAfterThreadSelect = threadState(stateAfterSecondAdd, selectAction);
        expect(stateAfterThreadSelect.threads[0].selected).toBe(true);
        expect(stateAfterThreadSelect.threads[1].selected).toBe(false);
        expect(stateAfterThreadSelect.isEditing).toBe(true);

        let deleteSelectedAction = {
            type: types.DELETE_SELECTED_THREAD
        };

        let stateAfterDeleteSelected = threadState(stateAfterThreadSelect, deleteSelectedAction);
        expect(stateAfterDeleteSelected.threads[0].recipientContactInfo.phoneNumber).toEqual('2222222222');
        expect(stateAfterDeleteSelected.threads[0].selected).toBe(false);
        expect(stateAfterDeleteSelected.threads.length).toBe(1);
        expect(stateAfterDeleteSelected.isEditing).toBe(false);
    });

    it('CLEAR_SELECTED should clear the selected Thread', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondContact = new Contact();
        secondContact.phoneNumber = '2222222222';
        let secondNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: secondContact,
            isGroupThread: false,
            groupInfo: null
        };
        let stateAfterSecondAdd = threadState(stateAfterFirstAdd, secondNewThreadAction);
        expect(stateAfterSecondAdd.threads[1].recipientContactInfo.phoneNumber).toEqual('2222222222');

        let firstThreadId = stateAfterFirstAdd.threads[0].id;
        let selectAction = {
            type: types.SELECT_THREAD,
            id: firstThreadId
        };

        let stateAfterThreadSelect = threadState(stateAfterSecondAdd, selectAction);
        expect(stateAfterThreadSelect.threads[0].selected).toBe(true);
        expect(stateAfterThreadSelect.threads[1].selected).toBe(false);
        expect(stateAfterThreadSelect.isEditing).toBe(true);

        let clearSelectedAction = {
            type: types.CLEAR_SELECTED_THREAD
        };

        let stateAfterClearSelected = threadState(stateAfterThreadSelect, clearSelectedAction);
        expect(stateAfterClearSelected.threads[0].selected).toBe(false);
        expect(stateAfterClearSelected.isEditing).toBe(false);
    });

    it.only('SET_CURRENT_THREAD should set the selected Thread', () => {
        let firstContact = new Contact();
        firstContact.phoneNumber = '1111111111';
        let firstNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: firstContact,
            isGroupThread: false,
            groupInfo: null
        };

        let stateAfterFirstAdd = threadState(state, firstNewThreadAction);
        expect(stateAfterFirstAdd.threads[0].recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondContact = new Contact();
        secondContact.phoneNumber = '2222222222';
        let secondNewThreadAction = {
            type: types.ADD_THREAD,
            recipientContactInfo: secondContact,
            isGroupThread: false,
            groupInfo: null
        };
        let stateAfterSecondAdd = threadState(stateAfterFirstAdd, secondNewThreadAction);
        expect(stateAfterSecondAdd.threads[1].recipientContactInfo.phoneNumber).toEqual('2222222222');
        expect(stateAfterSecondAdd.currentThread).toBe(null);

        let firstThread = stateAfterFirstAdd.threads[0];
        let setCurrentThreadAction = {
            type: types.SET_CURRENT_THREAD,
            thread: firstThread
        };

        let stateAfterCurrentThreadSet = threadState(stateAfterSecondAdd, setCurrentThreadAction);
        expect(stateAfterCurrentThreadSet.currentThread.recipientContactInfo.phoneNumber).toEqual('1111111111');

        let secondThread = stateAfterSecondAdd.threads[1];
        let setCurrentThreadAction2 = {
            type: types.SET_CURRENT_THREAD,
            thread: secondThread
        };

        let stateAfterCurrentThreadSet2 = threadState(stateAfterCurrentThreadSet, setCurrentThreadAction2);
        expect(stateAfterCurrentThreadSet2.currentThread.recipientContactInfo.phoneNumber).toEqual('2222222222');
    });
});