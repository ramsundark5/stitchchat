export default class Thread{
    constructor(){
        this.id              = 0;
        this.messageId       = '';
        this.contactId       = '';
        this.groupId         = '';
        this.direction       = 0; //sent or received
        this.count           = 0;
        this.unreadCount     = 0;
        this.mimeType        = '';
        this.lastMessageText = '';
        this.lastMessageTime = 0;
        this.extras          = '';
        this.isMuted         = false;
    }
}