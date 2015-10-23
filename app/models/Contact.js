export default class Contact{
    constructor(){
        this.phoneNumber        = '';
        this.displayName        = '';
        this.phoneType          = ''; //ios, android, web, etc
        this.phoneLabel         = '';
        this.localContactIdLink = 0;
        this.isRegisteredUser   = false;
        this.status             = ''; //
        this.photo              = '';
        this.lastSeenTime       = 0;
        this.extras             = '';
    }
}