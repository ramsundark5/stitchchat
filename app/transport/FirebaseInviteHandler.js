import GroupInfoService from '../services/GroupInfoService';
import Firebase from 'firebase';

class FirebaseInviteHandler{

    init(firebaseRef, phoneNumber, displayName){
        this.phoneNumber = phoneNumber;
        this.displayName = displayName;
        this._firebase          = firebaseRef;

        this._userRef           = this._firebase.child('users').child(this.phoneNumber);
        this._groupMessageRef   = this._firebase.child('group_messages');
        this._groupInfoRef      = this._firebase.child('group_info');
        this.initInvitesListener();
    }

    initInvitesListener(){
        if(!this._userRef){
            return;
        }
        const self = this;
        this._userRef.child('invites').on('child_added', function(snapshot){
            let invite = snapshot.val();

            // Skip invites we've already responded to.
            if (invite.status) {
                return;
            }
            invite.id = invite.id || snapshot.key();
            self.getGroupInfo(invite.groupId, function(groupInfo) {
                invite.toGroupName = groupInfo.displayName;
                console.log(invite.phoneNumber+" invited you to join "+ invite.toGroupName);
                GroupInfoService.createGroupFromInvite(invite);
            });
        });
        console.log('firebase initialized');
    }

    createNewGroup(groupInfo){
        if(!this._groupInfoRef){
            return;
        }
        try{
            this._groupInfoRef.child(groupInfo.uid).set({
                'creator': this.phoneNumber,
                'displayName': groupInfo.displayName,
                'timestamp': Firebase.ServerValue.TIMESTAMP
            });
            console.log('group created');
        }catch(err){
            console.log('error creating group in firebase '+ err);
        }
    }

    inviteUser(invitedPhoneNumber, groupInfo) {
        if(!this._groupInfoRef){
            return;
        }
        const self = this;
        let groupMembersRef = this._groupInfoRef.child(groupInfo.uid).child('groupMembers');
        groupMembersRef.child(invitedPhoneNumber).set(true, function(error) {
            if (!error) {
                self.sendInvite(invitedPhoneNumber, groupInfo.uid);
            }
        });
    }

    sendInvite(invitedPhoneNumber, groupId) {
        if(!this._firebase){
            return;
        }
        var inviteRef = this._firebase.child('users').child(invitedPhoneNumber).child('invites').push();
        inviteRef.set({
            id: inviteRef.key(),
            fromPhoneNumber: this.phoneNumber,
            fromUserName: this.displayName,
            groupId: groupId,
            timestamp: Firebase.ServerValue.TIMESTAMP
        });

        // Handle listen
        inviteRef.on('value', this.onInviteResponse);
    };

    onInviteResponse(snapshot){
        let invite = snapshot.val();
        invite.id = invite.id || snapshot.key();
        if(invite.status == 'accepted'){
            console.log("invite accepted by "+ invite.toPhoneNumber);
        }
    }

    acceptInvite(inviteId) {
        const self = this;
        if(!this._userRef){
            return;
        }
        this._userRef.child('invites').child(inviteId).once('value', function(snapshot) {
            let invite = snapshot.val();
            if (invite === null) {
                console.log('acceptInvite(' + inviteId + '): invalid invite id');
            } else {
                self.joinGroup(invite.groupId);
                self._userRef.child('invites').child(inviteId).update({
                    status: 'accepted',
                    toPhoneNumber: self.phoneNumber,
                    toUserName: self.displayName,
                    timestamp: Firebase.ServerValue.TIMESTAMP
                });
            }
        });
    };

    declineInvite(inviteId) {
        if(!this._userRef){
            return;
        }
        let updates = { status: 'declined',
            toPhoneNumber: this.phoneNumber,
            toUserName: this.displayName,
            timestamp: Firebase.ServerValue.TIMESTAMP
        };

        this._userRef.child('invites').child(inviteId).update(updates);
    };

    joinGroup(groupUid){
        if(!this._groupMessageRef){
            return;
        }
        const self = this;
        this._groupMessageRef.child(groupUid).on("child_added", function(snapshot, prevChildKey) {
            self.onGroupMessageReceived(groupUid, snapshot.key(), snapshot.val());
        });
    }

    leaveGroup(groupUid){
        if(!this._groupMessageRef){
            return;
        }
        this._groupMessageRef.child(groupUid).off();

        this._groupInfoRef.child(groupUid)
            .child('groupMembers')
            .child(this.phoneNumber)
            .set(null);
    }

    getGroupInfo(groupId, callback) {
        if(!this._groupInfoRef){
            return;
        }
        this._groupInfoRef.child(groupId).once('value', function(snapshot) {
            callback(snapshot.val());
        });
    };

}

export default new FirebaseInviteHandler();