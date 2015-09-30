import * as Status from '../constants/MessageConstants.js';
import * as _ from 'lodash';

export default class Message{
    constructor(text, threadId) {
        this.id                     = _.uniqueId('message');
        this.sequenceId             = _.uniqueId('message'); //used for sorting
        this.threadId               = '';
        this.senderId               = '';
        this.receiverId             = '';
        this.isGroupThread          = false;
        this.text                   = text;
        this.selected               = false;
        this.status                 = Status.STATUS_PENDING;
        this.owner                  = true;
        this.timestamp              = 0;
        this.direction              = 0; //sent or received
        this.thumbImageUrl          = '';
        this.mediaUrl               = '';
        this.mediaMimeType          = '';
        this.mediaDesc              = '';
        this.latitude               = '';
        this.longitude              = '';
        this.needsPush              = true; //indicates pending/draft message
        this.type                   = '';
        this.ttl                    = 0;
        this.extras                 = '';
    }
}

