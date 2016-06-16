import * as _ from 'lodash';

export default class Thread{
    constructor(recipientPhoneNumber: String, isGroupThread: boolean, groupInfo){
        this.id                     = null;
        this.recipientPhoneNumber   = recipientPhoneNumber;
        this.contactInfo            = null;
        this.displayName            = '';
        this.isGroupThread          = isGroupThread;
        this.groupInfo              = groupInfo;
        this.direction              = 0; //sent or received
        this.count                  = 0;
        this.unreadCount            = 0;
        this.mimeType               = null;
        this.lastMessageText        = null;
        this.lastMessageTime        = new Date();
        this.isMuted                = false;
        this.selected               = false;
    }
}

