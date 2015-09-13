export class Contact{
    constructor(){
        this.id                 = '';
        this.displayName        = '';
        this.phoneType          = ''; //ios, android, web, etc
        this.phoneLabel         = '';
        this.phoneNumber        = '';
        this.localContactIdLink = 0;
        this.isRegisteredUser   = false;
        this.status             = '';
        this.photo              = '';
        this.lastSeenTime       = 0;
        this.extras             = '';
    }
}