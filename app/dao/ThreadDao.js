import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ThreadDao{

    async getThreadForContact(contact){
        let sqlStmt  = "SELECT * from Thread where phoneNumber = :phoneNumber";
        let paramMap = {phoneNumber: contact.phoneNumber};
        let threadForPhoneNumber = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        if(!threadForPhoneNumber){
            threadForPhoneNumber = this.createThreadForContact(contact);
        }
        return threadForPhoneNumber;
    }

    async createThreadForContact(contact){
        let sqlStmt  = "INSERT into Thread (recipientPhoneNumber, displayName, isGroupThread)" +
            "values (:recipientPhoneNumber, :displayName, :isGroupThread)";
        let paramMap = {recipientPhoneNumber: contact.phoneNumber, displayName: contact.displayName, isGroupThread: false};
        let threadForPhoneNumber = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        return threadForPhoneNumber;
    }
}

module.exports = new ThreadDao();