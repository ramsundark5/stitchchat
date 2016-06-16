jest.autoMockOff();
import * as types from '../../app/constants/ActionTypes';
import * as Status from '../../app/constants/AppConstants.js';
import Message from '../../app/models/Message';

var actions = require('../../app/actions/MessageActions');

describe('Message actions tests', () => {

    it('addMessage should create ADD_MESSAGE action', () => {
        let newMessage = new Message('Use Redux');
        expect(actions.addMessage(newMessage)).toEqual({
            type: types.ADD_MESSAGE,
            message: newMessage
        });
    });

    it('deleteMessage should create DELETE_MESSAGE action', () => {
        let messageToBeDeleted = new Message('delete Redux ');
        expect(actions.deleteMessage(messageToBeDeleted)).toEqual({
            type: types.DELETE_MESSAGE,
            message: messageToBeDeleted
        });
    });

    it('selectMessage should create SELECT_MESSAGE action', () => {
        expect(actions.selectMessage(1)).toEqual({
            type: types.SELECT_MESSAGE,
            id: 1
        });
    });

    it('deleteSelected should create DELETE_SELECTED_MESSAGE action', () => {
        expect(actions.deleteSelected()).toEqual({
            type: types.DELETE_SELECTED_MESSAGE
        });
    });

    it('updateMessage should create UPDATE_MESSAGE_STATUS action', () => {
        expect(actions.updateMessageStatus(1, Status.STATUS_READ_CONFIRM)).toEqual({
            type: types.UPDATE_MESSAGE_STATUS,
            id: 1,
            status: Status.STATUS_READ_CONFIRM
        });
    });

});
