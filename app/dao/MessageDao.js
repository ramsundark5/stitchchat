import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class MessageDao{

     async addMessage(threadId, newMessage){

        let messageForDB = newMessage.getMessageForDBSave();
        let sqlStmt = 'INSERT into Message (threadId, senderId, receiverId, status, isGroupThread, message,' +
            'direction, thumbImageUrl, mediaUrl, mediaMimeType, mediaDesc, latitude, longitude, type, ttl, isOwner,' +
            'timestamp, needsPush, extras) values' +
            '(:threadId, :senderId, :receiverId, :status, :isGroupThread, :message,' +
            ':direction, :thumbImageUrl, :mediaUrl, :mediaMimeType, :mediaDesc, :latitude, :longitude, :type, :ttl, :isOwner,' +
            ':timestamp, :needsPush, :extras)';

        let messageId = await DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, messageForDB);
        this.addMessageRemoteId(messageId, newMessage.uid);
        return messageId;
    }

    async getMessages(threadId){
        let threadMessages = [];
        let sqlStmt = 'SELECT * from Message where threadId = :threadId';
        let paramMap = {threadId: threadId};
        try{
            threadMessages = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
            debugAsyncObject(threadMessages);
        }catch(err){
            console.log("Get message query threw error "+err);
        }
        return threadMessages;
    }

    addMessageRemoteId(messageId, uuid){
        let sqlStmt = 'INSERT into MessageRemoteID (uid, messageId) values (:uid, :messageId)';
        let paramMap = {uid: uuid, messageId: messageId};
        let addRemoteMessagePromise = DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        return addRemoteMessagePromise;
    }

}

module.exports = new MessageDao();