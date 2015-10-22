import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';
import Contact from '../models/Contact';

export function loadContacts(contacts){
    return{
        type: Actions.LOAD_CONTACTS,
        contacts
    }
}

export function updateContact(contact){
    return {
        type: Actions.UPDATE_CONTACT,
        contact
    };
}

export function selectContact(id) {
    return {
        type: Actions.SELECT_CONTACT,
        id
    };
}

export function clearSelectedContact() {
    return {
        type: Actions.CLEAR_SELECTED_CONTACT
    };
}

export function searchContacts(searchText) {
    return {
        type: Actions.SEARCH_CONTACTS,
        searchText
    };
}

export function clearSearch() {
    return {
        type: Actions.CLEAR_SEARCH
    };
}