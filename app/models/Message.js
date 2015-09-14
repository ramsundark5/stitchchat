import uuid from 'node-uuid';
import * as Status from '../constants/MessageConstants.js';
import * as _ from 'lodash';

export default class Message{
    constructor(text) {
        this.id                     = uuid.v4();
        this.sequenceId             = _.uniqueId('message'); //used for sorting
        this.threadId               = '';
        this.senderId               = '';
        this.recipientContactInfo   = '';
        this.groupInfo              = '';
        this.isGroupThread          = false;
        this.text                   = text;
        this.selected               = false;
        this.status                 = Status.STATUS_PENDING;
        this.owner                  = true;
        this.timestamp              = new Date().toJSON();
        this.direction              = 0; //sent or received
        this.thumbImageUrl          = '';
        this.mediaUrl               = '';
        this.mediaMimeType          = '';
        this.mediaDesc              = '';
        this.latitude               = '';
        this.longitude              = '';
        this.needsPush              = true; //indicates pending/draft message
        this.type                   = '';
        this.extras                 = '';
    }
}

