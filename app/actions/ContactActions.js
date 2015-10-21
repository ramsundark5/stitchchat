import * as Actions from '../constants/ActionTypes';
import * as _ from 'lodash';
import Contact from '../models/Contact';

export function loadContacts(contacts){
    return{
        type: Actions.LOAD_CONTACTS,
        contacts
    }
}

/*export function addNewContact(phoneNumber, displayName) {
    return {
        type: Actions.ADD_CONTACT,
        phoneNumber,
        displayName,
        null
    };
}*/

export function deleteContact(id) {
    return {
        type: Actions.DELETE_CONTACT,
        id
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

export function deleteSelectedContact() {
    return {
        type: Actions.DELETE_SELECTED_CONTACT
    };
}

export function searchContacts(searchText) {
    return {
        type: Actions.SEARCH_CONTACTS,
        searchText
    };
}