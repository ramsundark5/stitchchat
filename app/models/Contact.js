export default class Contact{
    constructor(){
        this.phoneNumber        = null;
        this.displayName        = '';
        this.phoneType          = null; //ios, android, web, etc
        this.phoneLabel         = null;
        this.localContactIdLink = null;
        this.abRecordIdLink     = null;
        this.androidLookupKey   = null;
        this.isRegisteredUser   = false;
        this.status             = "Hey there! I'm using stitchchat"; //
        this.photo              = null;
        this.thumbNailPhoto     = null;
        this.lastSeenTime       = null;
        this.isBlocked          = false;
        this.lastModifiedTime   = new Date();
    }
}
