import * as AppConstants from '../constants/AppConstants.js';
import * as _ from 'lodash';

export default class Message{
    constructor(text, threadId) {
        this.id                     = undefined;
        this.threadId               = threadId;
        this.senderTrackingId       = -1;
        this.receiverTrackingId     = -1;
        this.contactInfo            = null;
        this.senderId               = null;
        this.receiverId             = null;
        this.isGroupThread          = false;
        this.message                = text;
        this.thumbImageUrl          = null;
        this.mediaUrl               = null;  //this is the local url of stored media
        this.remoteName             = null;
        this.attachmentId           = null; //this is the unique id to lookup media in aws s3
        this.mediaMimeType          = null;
        this.mediaDesc              = null;
        this.latitude               = null;
        this.longitude              = null;
        this.type                   = AppConstants.PLAIN_TEXT;
        this.ttl                    = 0;

        //internal use fields not required when sending via mqtt
        this.selected               = false;
        this.status                 = AppConstants.STATUS_PENDING;
        this.mediaStatus            = AppConstants.PENDING_UPLOAD;
        this.isOwner                = true;
        this.displayName            = ''; //internal use for group chat. will be derived from contacts table.
        this.timestamp              = new Date();
        this.direction              = AppConstants.SENT; //sent or received
        this.needsPush              = true; //indicates pending/draft message
    }

    getMessageForTransport(){
        let transportMessage =  _.clone(this);
        delete transportMessage.threadId;
        delete transportMessage.selected;
        delete transportMessage.status;
        delete transportMessage.mediaStatus;
        delete transportMessage.displayName;
        delete transportMessage.contactInfo;
        delete transportMessage.owner;
        delete transportMessage.direction;
        delete transportMessage.needsPush;
        delete transportMessage.senderTrackingId;
        delete transportMessage.id;

        transportMessage.receiverTrackingId  = this.id;
        return transportMessage;
    }

}

