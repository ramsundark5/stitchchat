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
        let createThreadSqlStmt  = "INSERT into Thread (recipientPhoneNumber, displayName, isGroupThread)" +
            "values (:recipientPhoneNumber, :displayName, :isGroupThread)";
        let createThreadParamMap = {recipientPhoneNumber: contact.phoneNumber, displayName: contact.displayName, isGroupThread: false};
        let threadId = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, createThreadSqlStmt, createThreadParamMap);
        console.log("threadId created as "+ threadId);
        let threadForPhoneNumber = await this.getThreadById(threadId);
        return threadForPhoneNumber;
    }

    async getThreadById(threadId){
        let threadForPhoneNumber;
        let getThreadSqlStmt  = "SELECT * from Thread where id = :id";
        let getThreadParamMap = {id: threadId};

        let matchingThreads = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, getThreadSqlStmt, getThreadParamMap);

        if(matchingThreads && matchingThreads.length > 0){
            threadForPhoneNumber = matchingThreads[0];
            this.debugAsyncObject(threadForPhoneNumber);
            console.log("thread for phone number is "+ threadForPhoneNumber);
        }
        return threadForPhoneNumber;
    }

    debugAsyncObject(obj){
        console.log("async obj is"+ obj);
    }

}

module.exports = new ThreadDao();