import Firebase from 'firebase';

class FirebasePresenceHandler{

    init(firebaseRef, phoneNumber, displayName){
        this._firebase          = firebaseRef;
        this._usersPresenceRef  = this._firebase.child('presence');
        this._groupInfoRef      = this._firebase.child('group_info');
        this._queueRef          = this._firebase.child('queue/tasks');
        this._myPresenceRef     = this._usersPresenceRef.child(phoneNumber);
        let connectedRef        = this._firebase.child('.info/connected');
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                this._myPresenceRef.set(true);

                // when I disconnect, update the last time I was seen online
                this._myPresenceRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
            }
        });
    }

    isUserOnline(userPhoneNumber){
        console.log('checking presence of '+userPhoneNumber);
        if(!this._usersPresenceRef){
            return Promise.resolve(null);
        }

        return this._usersPresenceRef.child(userPhoneNumber).once('value').then(function(snapshot) {
            return snapshot.val();
        });
    }

    getGroupMembers(groupId){
        if(!this._groupInfoRef){
            return Promise.resolve(null);
        }
        return this._groupInfoRef.child(groupId).child('groupMembers').then(function(snapshot) {
            return snapshot.val();
        });
    }

    addToNotificationQueue(message){
        if(!this._queueRef){
            return Promise.resolve(null);
        }
        this._queueRef.push(message);
    }
}

export default new FirebasePresenceHandler();