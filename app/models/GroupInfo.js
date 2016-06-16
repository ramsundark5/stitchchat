import uuid from '../utils/uuid';

export default class GroupInfo{

    constructor(displayName){
        this.uid               = uuid.v1();
        this.displayName       = displayName;
        this.photoUrl          = null;
        this.thumbNailPhotoUrl = null;
        this.ownerId           = null;
        this.lastMessageOwner  = null;
        this.status            = null;
        this.statusMessage     = null;
    }
}