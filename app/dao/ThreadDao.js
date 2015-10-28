import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class ThreadDao{

    async createThreadForContact(contact){
        let currentTime = new Date().getTime();
        let sqlStmt  = "INSERT into Thread (recipientPhoneNumber, displayName, isGroupThread, lastMessageTime)" +
            "values (:recipientPhoneNumber, :displayName, :isGroupThread, :lastMessageTime)";
        let paramMap = {recipientPhoneNumber: contact.phoneNumber, displayName: contact.displayName,
                        isGroupThread: false, lastMessageTime: currentTime};
        let threadId = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        console.log("threadId created as "+ threadId);
        let threadForPhoneNumber = await this.getThreadById(threadId);
        return threadForPhoneNumber;
    }

    async createGroupThread(groupUid, displayName){
        let currentTime = new Date().getTime();
        let sqlStmt  = "INSERT into Thread (groupUid, displayName, isGroupThread, lastMessageTime)" +
            "values (:groupUid, :displayName, :isGroupThread, :lastMessageTime)";
        let paramMap = {groupUid: groupUid, displayName: displayName, isGroupThread: true, lastMessageTime: currentTime};
        let threadId = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        console.log("groupthreadId created as "+ threadId);
        let threadForGroup = await this.getThreadById(threadId);
        return threadForGroup;
    }

    async getThreadByPhoneNumber(phoneNumber){
        let threadForPhoneNumber;
        let sqlStmt  = "SELECT * from Thread where recipientPhoneNumber = :recipientPhoneNumber";
        let paramMap = {recipientPhoneNumber: phoneNumber};
        let existingThreads = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        if(existingThreads && existingThreads.length > 0){
            threadForPhoneNumber = existingThreads[0];
            console.log("found existing thread found for phoneNumber"+phoneNumber);
        }
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

    updateLastMessageText(newMessage){
        let currentTime = new Date().getTime();
        let sqlStmt  = "UPDATE Thread set lastMessageText  = :lastMessageText, " +
                                         "lastMessageTime = :lastMessageTime  " +
                                         "where id = :id";
        let paramMap = {id: newMessage.threadId, lastMessageText: newMessage.message, lastMessageTime: currentTime};
        DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
    }

    updateUnreadCount(threadId, count){
        let sqlStmt  = "UPDATE Thread set unreadCount  = unreadCount + :count where id = :id";
        let paramMap = {id: threadId, count: count};
        DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
    }
}

module.exports = new ThreadDao();