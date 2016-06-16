import * as AppConstants from '../constants/AppConstants';
import realm from './Realm';
import SequenceDao from './SequenceDao';
import Message from '../models/Message';

class MessageDao{

    addMessage(newMessage){
        let messageId = null;
        try{
             realm.write(() => {
                 messageId = SequenceDao.getNextSeqId("MessageSequence");
                 newMessage.id = messageId;
                 let res = realm.create('Message', newMessage);
                 console.log('message created in realm'+ res);
             });
        }catch(err){
            console.log("Add message threw error "+err);
        }
        return messageId;
    }

    getMessages(threadId, offset = 0, limit = 15){
        let threadMessages = [];
        try{
            let realmThreadMessages = realm.objects('Message').filtered('threadId = $0', threadId).sorted('id');
            let startPos   = realmThreadMessages.length - (limit + offset) > 0
                ? realmThreadMessages.length - (limit + offset)
                : 0;
            let endPos = offset < realmThreadMessages.length
                ? realmThreadMessages.length - offset
                : 0;
            console.log("start pos: "+ startPos);
            console.log("end pos: "+ endPos);
            let tempThreadMessages = Array.prototype.slice.call(realmThreadMessages, startPos, endPos);
            for (let threadMessage of tempThreadMessages) {
                let clonedThreadMessage = {};
                if (typeof threadMessage.snapshot == 'function') {
                    clonedThreadMessage = threadMessage.snapshot();
                } else {
                    clonedThreadMessage = Object.assign(new Message(), threadMessage);
                }
                if(clonedThreadMessage){
                    threadMessages.push(clonedThreadMessage);
                }
            }
        }catch(err){
            console.log("Get message query threw error "+err);
        }
        return threadMessages;
    }

    getAllPendingMessages(){
        let pendingMessages = [];
        try {
            let realmPendingMessages = realm.objects('Message').filtered('status = $0', AppConstants.STATUS_PENDING);
            for (let pendingMessage of realmPendingMessages) {
                let clonedPendingMessage = {};
                if (typeof pendingMessage.snapshot == 'function') {
                    clonedPendingMessage = pendingMessage.snapshot();
                } else {
                    clonedPendingMessage = Object.assign(new Message(), pendingMessage);
                }
                if(clonedPendingMessage && clonedPendingMessage.receiverId){
                    console.log('got cloned message as '+clonedPendingMessage.receiverId);
                    pendingMessages.push(clonedPendingMessage);
                }

            }
        }
        catch(err){
            console.log("Get pending messages threw error "+err);
        }
        return pendingMessages;
    }

    getMessageById(messageId){
        let messageForId;
        let realmMessageForId = realm.objects('Message').filtered('id = $0', messageId)[0];
        if (typeof realmMessageForId.snapshot == 'function') {
            messageForId = realmMessageForId.snapshot();
        } else {
            messageForId = Object.assign(new Message(), realmMessageForId);
        }
        return messageForId;
    }

    updateMessageStatus(messageId, status){
        console.log('messageId is '+ messageId);
        console.log('status is '+ status);
        try{
            realm.write(() => {
                let res = realm.create('Message', {'id': messageId, 'status': status, 'timestamp': new Date()}, true);
                console.log('response is '+ res);
            });
        }catch(err){
            console.log("exception updating upload status"+err);
        }
    }

    updateMediaStatus(messageId, status){
        console.log('messageId is '+ messageId);
        console.log('status is '+ status);
        try{
            realm.write(() => {
                let res = realm.create('Message', {'id': messageId, 'mediaStatus': status, 'timestamp': new Date()}, true);
                console.log('response is '+ res);
            });
        }catch(err){
            console.log("exception updating upload status"+err);
        }
    }

    updateMessageWithAttachmentId(message, attachmentId){
        try{
            realm.write(() => {
                let res = realm.create('Message', {'id': message.id, 'attachmentId': attachmentId, 'timestamp': new Date()}, true);
                console.log('response is '+ res);
            });

        }catch(err){
            console.error("exception updating tracking id for message"+err);
        }
    }

    updateMessageWithDownloadedMediaUrl(messageId, mediaUrl){
        try{
            realm.write(() => {
                let res = realm.create('Message', {'id': messageId, 'mediaUrl': mediaUrl,
                    'mediaStatus': AppConstants.DOWNLOAD_COMPLETED,'timestamp': new Date()}, true);
                console.log('response is '+ res);
            });

        }catch(err){
            console.error("exception updating tracking id for message"+err);
        }
    }

    getMediasForThread(threadId, selectedMediaMessage){
        let realmMediaMessages = realm.objects('Message').filtered('threadId = $0 && type > 0', threadId);
        let mediasForThread = [];
        let selectedMediaIndex = 0;
        let mediaResult = {};
        for(let i=0; i< realmMediaMessages.length; i++){
            let realmMediaMessage = realmMediaMessages[i];
            let mediaUrl  = realmMediaMessage.mediaUrl;
            let mediaType = realmMediaMessage.type;
            let id = realmMediaMessage.id;
            let threadId = realmMediaMessage.threadId;
            mediasForThread.push({id: id, threadId: threadId, mediaUrl: mediaUrl, type: mediaType});
            if(selectedMediaMessage){
                if(realmMediaMessage.id == selectedMediaMessage.id){
                    selectedMediaIndex = i;
                }
            }
        }
        mediaResult.mediasForThread = mediasForThread;
        mediaResult.selectedMediaIndex = selectedMediaIndex;
        return mediaResult;
    }

    deleteMessages(messagesToBeDeleted){
        try{
            realm.write(() => {
                for(let i=0; i< messagesToBeDeleted.length; i++){
                    let messageToBeDeleted = messagesToBeDeleted[i];
                    let realmMessage = realm.objects('Message').filtered('id = $0', messageToBeDeleted.id)[0];
                    if(realmMessage){
                        realm.delete(realmMessage);
                    }
                }
            });
            console.log('after deleting realm message');
        }catch(err){
            console.error("exception deleting selected messages "+err);
        }
    }

}

export default new MessageDao();