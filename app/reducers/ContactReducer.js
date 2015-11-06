import * as Action from '../constants/ActionTypes';
import Contact from '../models/Contact';
import * as _ from 'lodash';

let sampleContact = new Contact();
sampleContact.phoneNumber = '+13392247442';
sampleContact.displayName='Daniel Higging';
const initialState = { contacts : [], filteredContacts: [], isSearching: false};

export function contactState(state = initialState, action = {}) {
    switch (action.type) {

        case Action.LOAD_CONTACTS:
            let contacts     = action.contacts;
            let newStateAfterInit =  _.assign({}, state, { 'contacts' : contacts, 'filteredContacts': contacts });
            return newStateAfterInit;

        case Action.UPDATE_CONTACT:
            let contactsAfterUpdate =  state.contacts.map(contact =>
                    contact.phoneNumber === action.contact.phoneNumber ?
                        Object.assign({}, contact, action.contact) :
                        contact
            );

            let newStateAfterUpdate =  _.assign({}, state, { 'contacts' : contactsAfterUpdate });
            return newStateAfterUpdate;

        case Action.SELECT_CONTACT:
            let selectedContact = action.selectedContact;//new Message(action.text);
            let contactsAfterSelect =  state.contacts.map(contact =>
                    contact.phoneNumber === selectedContact.phoneNumber ?
                        _.assign({}, contact, {selected: !contact.selected}) :
                        contact
            );

            let newStateAfterSelect =  _.assign({}, state, { 'contacts' : contactsAfterSelect, 'isSearching': false });
            return newStateAfterSelect;


        case Action.SEARCH_CONTACTS:
            let searchText = action.searchText;
            if(searchText){
                searchText = searchText.toLowerCase();
            }
            let filteredContacts = state.contacts.filter(contact =>
                    contact.displayName && !contact.selected? contact.displayName.toLowerCase().includes(searchText) : false
            );

            let newStateAfterSearch =  _.assign({}, state, { 'filteredContacts' : filteredContacts, 'isSearching': true});
            return newStateAfterSearch;

       /* case Action.CLEAR_SEARCH:
            let newStateAfterClearSearch = _.assign({}, state, {'searchText': ''});
            return newStateAfterClearSearch;*/

        case Action.RESET_CONTACTS_STATE:
            let newStateAfterReset = _.assign({}, state, initialState);
            return newStateAfterReset;

        default:
            return state;
    }
}


