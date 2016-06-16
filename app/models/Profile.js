export default class Profile{
    constructor(){
        this.displayName            = null;
        this.phoneNumber            = null;
        this.countryCode            = null;
        this.isContactInitialized   = false;
        this.lastContactSyncTime    = new Date();
        this.statusMessage          = null;
        this.thumbNailPhoto         = null;
        this.photo                  = null;
    }
}