import realm from '../dao/Realm';
import Contact from '../models/Contact';

class ContactsDao{

    getContacts(showRegistered){
        let realmContacts = realm.objects('Contact').filtered('isRegisteredUser = $0', showRegistered);
        let sortedContacts = realmContacts.sorted('displayName');
        let contacts = [];
        for (let contact of sortedContacts) {
            let contactToBeAdded = {};
            if (typeof contact.snapshot == 'function') {
                contactToBeAdded = contact.snapshot();
            } else {
                contactToBeAdded = Object.assign(new Contact(), contact);
            }
            if(contactToBeAdded && contactToBeAdded.phoneNumber){
                contacts.push(contactToBeAdded);
            }
        }
        return contacts;
    }

    searchContacts(showRegistered, searchString){
        let contacts = [];
        let realmContacts = realm.objects('Contact').filtered('isRegisteredUser == $0 && displayName CONTAINS $1',
            showRegistered, searchString);
        contacts = realmContacts.snapshot();
        return contacts;
    }

    updateContacts(changedContacts){
        try{
            realm.write(() => {
                for (let i=0; i<changedContacts.length; i++) {
                    let contact = changedContacts[i];
                    contact.lastModifiedTime = new Date();
                    try{
                        let realmContact = realm.objects('Contact').filtered('phoneNumber = $0', contact.phoneNumber)[0];
                        if(realmContact && realmContact.phoneNumber){
                            realmContact.displayName = contact.displayName;
                        }else{
                            contact.lastSeenTime = null;
                            realm.create('Contact', contact);
                        }
                    }catch(ex){
                        console.error("exception updating contact "+ex);
                    }

                }
            });
            console.log('contact updating completed');
        }catch(err){
            console.error("exception updating contacts "+err);
        }
    }

    getContactForPhoneNumber(phoneNumber){
        let contactForPhoneNumber;
        let realmContact = realm.objects('Contact').filtered('phoneNumber = $0', phoneNumber)[0];
        if (typeof realmContact.snapshot == 'function') {
            contactForPhoneNumber = realmContact.snapshot();
        } else {
            contactForPhoneNumber = Object.assign(new Contact(), realmContact);
        }
        return contactForPhoneNumber;
    }

    blockContact(contact){
        try{
            realm.write(() => {
                realm.create('Contact', {'phoneNumber': contact.phoneNumber, 'isBlocked': !contact.isBlocked}, true);
                console.log('updated isBlocked flag for Contact '+contact.phoneNumber);
            });
        }catch(err){
            console.error("exception updating isBlocked flag "+err);
        }
        return contact;
    }
}

export default new ContactsDao();