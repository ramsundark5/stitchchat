import { ADD_MESSAGE, DELETE_MESSAGE, EDIT_MESSAGE, SELECT_MESSAGE, SELECT_ALL, DELETE_SELECTED, CLEAR_SELECTED } from '../constants/ActionTypes';
import uuid from 'node-uuid';

const initialState = [{
    text: 'Use Redux',
    selected: false,
    id: 0
}];

export default function messages(state = initialState, action) {
    switch (action.type) {
        case ADD_MESSAGE:
            return [{
                id: uuid(),
                selected: false,
                text: action.text,
            }, ...state];

        case DELETE_MESSAGE:
            return state.filter(message =>
                message.id !== action.id
            );

        case EDIT_MESSAGE:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {text: action.text}) :
                        message
            );

        case SELECT_MESSAGE:
            return state.map(message =>
                    message.id === action.id ?
                        Object.assign({}, message, {selected: !message.selected}) :
                        message
            );

        case SELECT_ALL:
            const areAllSelected = state.every(message => message.marked);
            return state.map(message => Object.assign({}, message, {
                selected: !areAllSelected
            }));

        case CLEAR_SELECTED:
            return state.filter(message => message.selected === false);

        default:
            return state;
    }
}
