import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ThreadDao{

    async getThreadForContact(contact){
        let threadForPhoneNumber;
        let sqlStmt  = "SELECT * from Thread where recipientPhoneNumber = :recipientPhoneNumber";
        let paramMap = {recipientPhoneNumber: contact.phoneNumber};
        let existingThreads = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);

        if(!existingThreads || existingThreads.length == 0){
            console.log("no existing thread found for phoneNumber"+contact.phoneNumber);
            threadForPhoneNumber = await this.createThreadForContact(contact);
        }
        else{
            console.log("found existing thread found for phoneNumber"+contact.phoneNumber);
            threadForPhoneNumber = existingThreads[0];
        }
        return threadForPhoneNumber;
    }

    async createThreadForContact(contact){
        let sqlStmt  = "INSERT into Thread (recipientPhoneNumber, displayName, isGroupThread)" +
            "values (:recipientPhoneNumber, :displayName, :isGroupThread)";
        let paramMap = {recipientPhoneNumber: contact.phoneNumber, displayName: contact.displayName, isGroupThread: false};
        let threadId = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, createThreadSqlStmt, paramMap);
        console.log("threadId created as "+ threadId);
        let threadForPhoneNumber = await this.getThreadById(threadId);
        return threadForPhoneNumber;
    }

    async getThreadById(threadId){
        let threadForPhoneNumber;
        let sqlStmt  = "SELECT * from Thread where id = :id";
        let paramMap = {id: threadId};

        let matchingThreads = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);

        if(matchingThreads && matchingThreads.length > 0){
            threadForPhoneNumber = matchingThreads[0];
            debugAsyncObject(threadForPhoneNumber);
            console.log("thread for phone number is "+ threadForPhoneNumber);
        }
        return threadForPhoneNumber;
    }

    async loadRecentThreads(){
        let sqlStmt  = "SELECT * from Thread order by lastMessageTime";
        let recentThreads = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt);
        return recentThreads;
    }
}

module.exports = new ThreadDao();