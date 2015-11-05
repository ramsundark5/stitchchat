import * as Status from '../constants/MessageConstants.js';
import * as _ from 'lodash';
import uuid from 'node-uuid';

export default class Message{
    constructor(text, threadId) {
        this.id                     = undefined;
        this.uid                    = uuid.v4();
        this.threadId               = threadId;
        this.senderId               = '';
        this.receiverId             = '';
        this.isGroupThread          = false;
        this.message                = text;
        this.thumbImageUrl          = '';
        this.mediaUrl               = '';  //this is the local url of stored media
        this.mediaMimeType          = 'image/jpeg';
        this.mediaDesc              = '';
        this.latitude               = '';
        this.longitude              = '';
        this.type                   = 0;
        this.ttl                    = 0;
        this.extras                 = '';

        //internal use fields
        this.selected               = false;
        this.status                 = Status.STATUS_PENDING;
        this.mediaStatus            = Status.PENDING_UPLOAD;
        this.isOwner                = true;
        this.timestamp              = 0;
        this.direction              = 0; //sent or received
        this.needsPush              = true; //indicates pending/draft message
    }

    getMessageForTransport(){
        let transportMessage           =  _.clone(this);
        transportMessage.sequenceId    = undefined;

        //thread Id needs to be sent only for group chats. For private chats
        if(!this.isGroupThread){
            transportMessage.threadId  = undefined;
        }
        transportMessage.selected      = undefined;
        transportMessage.status        = undefined;
        transportMessage.owner         = undefined;
        transportMessage.direction     = undefined;
        transportMessage.needsPush     = undefined;
        return transportMessage;
    }

    getMessageForDBSave(){
        let messageForDB         = _.clone(this);
        messageForDB.selected    = undefined;
        messageForDB.uid         = undefined;
        return messageForDB;
    }
}

