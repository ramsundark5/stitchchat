import Contact from './Contact';
import GroupInfo from './GroupInfo';
import * as _ from 'lodash';

export default class Thread{
    constructor(recipientPhoneNumber: String, isGroupThread: boolean, groupUid: String){
        this.id                     = null;
        this.recipientPhoneNumber   = recipientPhoneNumber;
        this.displayName            = '';
        this.isGroupThread          = isGroupThread;
        this.groupUid               = groupUid;
        this.direction              = 0; //sent or received
        this.count                  = 0;
        this.unreadCount            = 0;
        this.mimeType               = '';
        this.lastMessageText        = '';
        this.lastMessageTime        = 0;
        this.extras                 = '';
        this.isMuted                = false;
        this.selected               = false;
        this.extras                 = '';
        this.lastModifiedTime       = 0;
    }
}

