import React, { AsyncStorage } from 'react-native';
import DBHelper from './DBHelper';
import * as AppConstants from '../constants/AppConstants';

class MessageDao{

     addMessage(threadId, newMessage){

        let messageForDB = newMessage.getMessageForDBSave();
        let sqlStmt = 'INSERT into Message (uid, threadId, senderId, receiverId, status, isGroupThread, message,' +
            'direction, thumbImageUrl, mediaUrl, mediaMimeType, mediaDesc, latitude, longitude, type, ttl, isOwner,' +
            'timestamp, needsPush, extras) values' +
            '(:uid, :threadId, :senderId, :receiverId, :status, :isGroupThread, :message,' +
            ':direction, :thumbImageUrl, :mediaUrl, :mediaMimeType, :mediaDesc, :latitude, :longitude, :type, :ttl, :isOwner,' +
            ':timestamp, :needsPush, :extras)';

        let addMessagePromise = DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, messageForDB);
        let that = this;
        addMessagePromise.then(function(messageId){
            that.addMessageRemoteId(messageId, uuid);
        });
        return addMessagePromise;
    }

    async getMessages(threadId){
        let sqlStmt = 'SELECT * from Message where threadId = :threadId';
        let paramMap = {threadId: threadId};
        let threadMessages = await DBHelper.executeQuery(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        return threadMessages;
    }

    addMessageRemoteId(messageId, uuid){
        let sqlStmt = 'INSERT into MessageRemoteID (uid, messageId) values (:uid, :messageId)';
        let paramMap = {messageId: messageId, uid: uuid};
        let addRemoteMessagePromise = DBHelper.executeInsert(AppConstants.MESSAGES_DB, sqlStmt, paramMap);
        return addRemoteMessagePromise;
    }

}

module.exports = new MessageDao();