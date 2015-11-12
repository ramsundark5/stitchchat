import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ContactsDao{

    async getAllContacts(){
        let sqlStmt = 'SELECT * from Contact GROUP BY displayName order by displayName';
        let contacts = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt);
        return contacts;
    }
}

export default new ContactsDao();