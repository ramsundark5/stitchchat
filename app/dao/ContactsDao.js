import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ContactsDao{

    async getAllContacts(){
        let sqlStmt = 'SELECT * from Contact';
        let contacts = await DBHelper.executeQuery(AppConstants.CONTACTS_DB, sqlStmt);
        return contacts;
    }
}

module.exports = new ContactsDao();