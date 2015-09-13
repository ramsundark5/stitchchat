export default class GroupMember{
    constructor(){
        this.groupId           = 0;
        this.localContactId    = '';
        this.remoteName        = ''; //name registered in server, maybe different from local contact name
        this.status            = '';
        this.lastSeenTime      = 0;
    }
}