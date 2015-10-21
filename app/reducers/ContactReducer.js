import * as Action from '../constants/ActionTypes';
import Contact from '../models/Contact';
import * as _ from 'lodash';

const initialState = { contacts : [], filteredContacts: [], isEditing: false};

export function contactState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.LOAD_CONTACTS:
            let contacts     = action.contacts;
            let newStateAfterInit =  _.assign({}, state, { 'contacts' : contacts });
            return newStateAfterInit;

        case Action.DELETE_CONTACT:
            let contactsAfterDelete = state.contacts.filter(contact =>
                contact.id !== action.id
            );
            let newStateAfterDelete =  _.assign({}, state, { 'contacts' : contactsAfterDelete });
            return newStateAfterDelete;

        case Action.UPDATE_CONTACT:
            let contactsAfterUpdate =  state.contacts.map(contact =>
                    contact.id === action.contact.id ?
                        Object.assign({}, contact, action.contact) :
                        contact
            );

            let newStateAfterUpdate =  _.assign({}, state, { 'contacts' : contactsAfterUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_CONTACT:
            let contactsAfterSelect =  state.contacts.map(contact =>
                    contact.id === action.id ?
                        _.assign({}, contact, {selected: !contact.selected}) :
                        contact
            );
            let atleastOneSelected = contactsAfterSelect.some(contact => contact.selected);
            let newStateAfterSelect =  _.assign({}, state, { 'contacts' : contactsAfterSelect, 'isEditing': atleastOneSelected });
            return newStateAfterSelect;

        case Action.CLEAR_SELECTED_CONTACT:
            let contactsAfterClearSelected = state.contacts.map(contact => _.assign({}, contact, {
                selected: false
            }));
            let newStateAfterClearSelected =  _.assign({}, state, { 'contacts' : contactsAfterClearSelected, 'isEditing': false });
            return newStateAfterClearSelected ;

        case Action.DELETE_SELECTED_CONTACT:
            let contactsAfterDeleteSelected = state.contacts.filter(contact =>
                contact.selected === false
            );
            let newStateAfterDeleteSelected =  _.assign({}, state, { 'contacts' : contactsAfterDeleteSelected, 'isEditing': false });
            return newStateAfterDeleteSelected;

        default:
            return state;
    }
}


