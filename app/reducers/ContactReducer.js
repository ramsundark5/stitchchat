import * as Action from '../constants/ActionTypes';
import Contact from '../models/Contact';
import * as _ from 'lodash';

const initialState = { contacts : [], filteredContacts: [], isEditing: false};

export function contactState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.LOAD_CONTACTS:
            let contacts     = action.contacts;
            let newStateAfterInit =  _.assign({}, state, { 'contacts' : contacts, 'filteredContacts': contacts });
            return newStateAfterInit;

        case Action.UPDATE_CONTACT:
            let contactsAfterUpdate =  state.contacts.map(contact =>
                    contact.id === action.contact.id ?
                        Object.assign({}, contact, action.contact) :
                        contact
            );

            let newStateAfterUpdate =  _.assign({}, state, { 'contacts' : contactsAfterUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_CONTACT:
            let contactsAfterSelect =  state.filteredContacts.map(contact =>
                    contact.id === action.id ?
                        _.assign({}, contact, {selected: !contact.selected}) :
                        contact
            );
            let atleastOneSelected = contactsAfterSelect.some(contact => contact.selected);
            let newStateAfterSelect =  _.assign({}, state, { 'filteredContacts' : contactsAfterSelect, 'isEditing': atleastOneSelected });
            return newStateAfterSelect;

        case Action.CLEAR_SELECTED_CONTACT:
            let contactsAfterClearSelected = state.filteredContacts.map(contact => _.assign({}, contact, {
                selected: false
            }));
            let newStateAfterClearSelected =  _.assign({}, state, { 'filteredContacts' : contactsAfterClearSelected, 'isEditing': false });
            return newStateAfterClearSelected ;

        case Action.SEARCH_CONTACTS:
            let searchText = action.searchText;
            if(searchText){
                searchText = searchText.toLowerCase();
            }
            let filteredContacts = state.contacts.filter(contact =>
                    contact.displayName? contact.displayName.toLowerCase().includes(searchText) : false
            );

            let newStateAfterSearch =  _.assign({}, state, { 'filteredContacts' : filteredContacts});
            return newStateAfterSearch;

       /* case Action.CLEAR_SEARCH:
            let newStateAfterClearSearch = _.assign({}, state, {'searchText': ''});
            return newStateAfterClearSearch;*/

        default:
            return state;
    }
}


