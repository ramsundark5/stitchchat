import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ContactsDao{

    getAllContacts(){
        let sqlStmt = 'SELECT * from Contact';
        let getAllContactsPromise = DBHelper.executeQuery(AppConstants.CONTACTS_DB, sqlStmt);
        return getAllContactsPromise;
    }
}

module.exports = new ContactsDao();