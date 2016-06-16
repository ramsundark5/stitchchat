jest.autoMockOff();
var messageState = require('../../app/reducers/MessageReducer').default;
var Message = require('../../app/models/Message').default;
import * as types from '../../app/constants/ActionTypes';
import * as Status from '../../app/constants/AppConstants.js';

describe('Message reducer tests', () => {

    let state;

    beforeEach(() => {
        state = { messages : {}, isEditing: false, showLoadingSpinner: false,
            isMediaOptionsVisible: false, scrollToBottom: false, retainScrollPosition: false,
            showMessageComposer: true};
    });

    it('initial state should be empty array', () => {
        let stateAfterInit = messageState(undefined, {});
        expect(stateAfterInit).toEqual(state);
    });

    it('ADD_MESSAGE should add message instance to existing collection', () => {
        let firstNewMessage = new Message('first message');
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);

        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');

        let secondNewMessage = new Message('second message');
        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: secondNewMessage
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        let secondMessageAfterAdd;
        for (let messageDate in stateAfterSecondAdd.messages) {
            if (stateAfterSecondAdd.messages.hasOwnProperty(messageDate)) {
                secondMessageAfterAdd = stateAfterSecondAdd.messages[messageDate][1];
            }
        }
        expect(secondMessageAfterAdd.message).toEqual('second message');
    });

    it('DELETE_MESSAGE should delete from existing collection', () => {
        let firstNewMessage = new Message('first message');
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');

        let secondNewMessage = new Message('second message');
        secondNewMessage.id = 222;
        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: secondNewMessage
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        let secondMessageAfterAdd;
        for (let messageDate in stateAfterSecondAdd.messages) {
            if (stateAfterSecondAdd.messages.hasOwnProperty(messageDate)) {
                secondMessageAfterAdd = stateAfterSecondAdd.messages[messageDate][1];
            }
        }

        expect(secondMessageAfterAdd.message).toEqual('second message');

        let deleteAction = {
            type: types.DELETE_MESSAGE,
            message: secondMessageAfterAdd
        };

        let stateAfterMessageDelete = messageState(stateAfterSecondAdd, deleteAction);
        let firstMessageAfterDelete;
        for (let messageDate in stateAfterMessageDelete.messages) {
            if (stateAfterMessageDelete.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterDelete = stateAfterMessageDelete.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterDelete.message).toEqual('first message');
    });

    it('SELECT_MESSAGE should select or unselect the given message', () => {
        let firstNewMessage = new Message('first message');
        firstNewMessage.id  = 111;
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');
        expect(firstMessageAfterAdd.selected).toBe(false);

        let firstMessageId = firstMessageAfterAdd.id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterFirstAdd, selectAction);
        let firstMessageAfterSelect;
        for (let messageDate in stateAfterMessageSelect.messages) {
            if (stateAfterMessageSelect.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterSelect = stateAfterMessageSelect.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterSelect.selected).toBe(true);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let unselectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageUnselect = messageState(stateAfterMessageSelect, unselectAction);
        let firstMessageAfterUnselect;
        for (let messageDate in stateAfterMessageUnselect.messages) {
            if (stateAfterMessageUnselect.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterUnselect = stateAfterMessageUnselect.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterUnselect.selected).toBe(false);
        expect(stateAfterMessageUnselect.isEditing).toBe(false);
    });

    it('UPDATE_MESSAGE_STATUS should update status of the given message', () => {
        let firstNewMessage = new Message('first message');
        firstNewMessage.id  = 111;
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);
        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');
        expect(firstMessageAfterAdd.selected).toBe(false);

        let firstMessageId = firstMessageAfterAdd.id;
        let updateReceivedStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_RECEIVED
        };

        let stateAfterReceivedMessageUpdate = messageState(stateAfterFirstAdd, updateReceivedStatusAction);
        let firstMessageAfterUpdate;
        for (let messageDate in stateAfterReceivedMessageUpdate.messages) {
            if (stateAfterReceivedMessageUpdate.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterUpdate = stateAfterReceivedMessageUpdate.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterUpdate.status).toEqual(Status.STATUS_RECEIVED);

        let updateSentStatusAction = {
            type: types.UPDATE_MESSAGE_STATUS,
            id: firstMessageId,
            status: Status.STATUS_SENT
        };

        let stateAfterSentMessageUpdate = messageState(stateAfterReceivedMessageUpdate, updateSentStatusAction);
        let firstMessageAfterSecondUpdate;
        for (let messageDate in stateAfterSentMessageUpdate.messages) {
            if (stateAfterSentMessageUpdate.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterSecondUpdate = stateAfterSentMessageUpdate.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterSecondUpdate.status).toEqual(Status.STATUS_SENT);
    });

    it('DELETE_SELECTED should delete the selected message', () => {
        let firstNewMessage = new Message('first message');
        firstNewMessage.id  = 111;
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);

        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');

        let secondNewMessage = new Message('second message');
        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: secondNewMessage
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        let secondMessageAfterAdd;
        for (let messageDate in stateAfterSecondAdd.messages) {
            if (stateAfterSecondAdd.messages.hasOwnProperty(messageDate)) {
                secondMessageAfterAdd = stateAfterSecondAdd.messages[messageDate][1];
            }
        }
        expect(secondMessageAfterAdd.message).toEqual('second message');

        let firstMessageId = firstMessageAfterAdd.id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterSecondAdd, selectAction);
        let firstMessageAfterSelect, secondMessageAfterSelect;
        for (let messageDate in stateAfterMessageSelect.messages) {
            if (stateAfterMessageSelect.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterSelect = stateAfterMessageSelect.messages[messageDate][0];
                secondMessageAfterSelect = stateAfterMessageSelect.messages[messageDate][1];
            }
        }

        expect(firstMessageAfterSelect.selected).toBe(true);
        expect(secondMessageAfterSelect.selected).toBe(false);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let deleteSelectedAction = {
            type: types.DELETE_SELECTED_MESSAGE
        };

        let stateAfterDeleteSelected = messageState(stateAfterMessageSelect, deleteSelectedAction);
        let firstMessageAfterDeleteSelect;
        for (let messageDate in stateAfterDeleteSelected.messages) {
            if (stateAfterDeleteSelected.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterDeleteSelect = stateAfterDeleteSelected.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterDeleteSelect.message).toEqual('second message');
        expect(firstMessageAfterDeleteSelect.selected).toBe(false);
        //expect(stateAfterDeleteSelected.messages.length).toBe(1);
        expect(stateAfterDeleteSelected.isEditing).toBe(false);
    });

    it('CLEAR_SELECTED should clear the selected message', () => {
        let firstNewMessage = new Message('first message');
        firstNewMessage.id  = 111;
        let firstNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: firstNewMessage
        };
        let stateAfterFirstAdd = messageState(state, firstNewMessageAction);

        let firstMessageAfterAdd;
        for (let messageDate in stateAfterFirstAdd.messages) {
            if (stateAfterFirstAdd.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterAdd = stateAfterFirstAdd.messages[messageDate][0];
            }
        }
        expect(firstMessageAfterAdd.message).toEqual('first message');

        let secondNewMessage = new Message('second message');
        let secondNewMessageAction = {
            type: types.ADD_MESSAGE,
            message: secondNewMessage
        };
        let stateAfterSecondAdd = messageState(stateAfterFirstAdd, secondNewMessageAction);
        let secondMessageAfterAdd;
        for (let messageDate in stateAfterSecondAdd.messages) {
            if (stateAfterSecondAdd.messages.hasOwnProperty(messageDate)) {
                secondMessageAfterAdd = stateAfterSecondAdd.messages[messageDate][1];
            }
        }
        expect(secondMessageAfterAdd.message).toEqual('second message');

        let firstMessageId = firstMessageAfterAdd.id;
        let selectAction = {
            type: types.SELECT_MESSAGE,
            id: firstMessageId
        };

        let stateAfterMessageSelect = messageState(stateAfterSecondAdd, selectAction);
        let firstMessageAfterSelect, secondMessageAfterSelect;
        for (let messageDate in stateAfterMessageSelect.messages) {
            if (stateAfterMessageSelect.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterSelect = stateAfterMessageSelect.messages[messageDate][0];
                secondMessageAfterSelect = stateAfterMessageSelect.messages[messageDate][1];
            }
        }

        expect(firstMessageAfterSelect.selected).toBe(true);
        expect(secondMessageAfterSelect.selected).toBe(false);
        expect(stateAfterMessageSelect.isEditing).toBe(true);

        let clearSelectedAction = {
            type: types.CLEAR_SELECTED_MESSAGE
        };

        let stateAfterClearSelected = messageState(stateAfterMessageSelect, clearSelectedAction);
        let firstMessageAfterClearSelected;
        for (let messageDate in stateAfterClearSelected.messages) {
            if (stateAfterClearSelected.messages.hasOwnProperty(messageDate)) {
                firstMessageAfterClearSelected = stateAfterClearSelected.messages[messageDate][0];
            }
        }

        expect(firstMessageAfterClearSelected.selected).toBe(false);
        expect(stateAfterClearSelected.isEditing).toBe(false);
    });

});
