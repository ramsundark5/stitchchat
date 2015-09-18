import Contact from './Contact';
import GroupInfo from './GroupInfo';
import * as _ from 'lodash';

export default class Thread{
    constructor(recipientContactInfo: Contact, isGroupThread: boolean, groupInfo: GroupInfo){
        this.id                     = _.uniqueId('thread');
        this.recipientContactInfo   = recipientContactInfo;
        this.isGroupThread          = isGroupThread;
        this.groupInfo              = groupInfo;
        this.direction              = 0; //sent or received
        this.count                  = 0;
        this.unreadCount            = 0;
        this.mimeType               = '';
        this.lastMessageText        = '';
        this.lastMessageTime        = 0;
        this.extras                 = '';
        this.isMuted                = false;
        this.selected               = false;
    }
}