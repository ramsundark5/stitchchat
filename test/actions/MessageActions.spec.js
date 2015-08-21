import expect from 'expect';
import * as types from '../../app/constants/ActionTypes';
import * as actions from '../../app/actions/MessageActions';

describe('Message actions tests', () => {

    it('addMessage should create ADD_MESSAGE action', () => {
        expect(actions.addMessage('Use Redux')).toEqual({
            type: types.ADD_MESSAGE,
            text: 'Use Redux'
        });
    });

    it('deleteMessage should create DELETE_MESSAGE action', () => {
        expect(actions.deleteMessage(1)).toEqual({
            type: types.DELETE_MESSAGE,
            id: 1
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

});
