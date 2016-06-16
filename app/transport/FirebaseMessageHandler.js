import MessageService from '../services/MessageService';
import * as AppConstants from '../constants/AppConstants';
import GroupInfoDao from '../dao/GroupInfoDao';
import Firebase from 'firebase';

class FirebaseMessageHandler{

    init(firebaseRef, phoneNumber, displayName){
        this.phoneNumber        = phoneNumber;
        this.displayName        = displayName;
        this._firebase          = firebaseRef;

        this._userRef           = this._firebase.child('users').child(this.phoneNumber);
        this._privateMessageRef = this._firebase.child('private_messages');
        this._groupMessageRef   = this._firebase.child('group_messages');
        this._groupInfoRef      = this._firebase.child('group_info');
        this._statusRef         = this._firebase.child('message_status');
        this.setupListeners(phoneNumber);
    }

    // Initialize Firebase listeners and callbacks for the supported bindings.
    setupListeners(phoneNumber){
        this.initMessageReceivedListener(phoneNumber);
        this.initGroupMessageListener();
    }

    initMessageReceivedListener(phoneNumber){
        const self = this;
        this._privateMessageRef.child(phoneNumber).on("child_added", function(snapshot, prevChildKey) {
            console.log(snapshot.key());
            let message = snapshot.val();
            self.onMessageReceived(message, false, null);

            //delete once read
            try{
                self._privateMessageRef.child(phoneNumber).child(snapshot.key()).set(null);
                this.updateStatus(message);
            }catch(err){
                console.log("error removing the message "+ err);
            }
        });
    }

    initGroupMessageListener(){
        const self = this;
        let groupIDList = GroupInfoDao.getGroupIdList();
        for(let i=0; i< groupIDList.length; i++){
            let groupId = groupIDList[i];
            this._groupMessageRef.child(groupId).on("child_added", function(snapshot, prevChildKey) {
                self.onGroupMessageReceived(groupId, snapshot.key(), snapshot.val());
            });
        }
    }

    sendPrivateMessage(recipientPhoneNumber, message, callback){
        if(!this._privateMessageRef || !recipientPhoneNumber){
            return;
        }
        message.senderId = this.phoneNumber;
        message.displayName = this.displayName;
        message.timestamp = Firebase.ServerValue.TIMESTAMP;
        this.removeUndefinedProps(message);
        let recipientMessageRef = this._privateMessageRef.child(recipientPhoneNumber);
        let newMessageRef = recipientMessageRef.push();
        newMessageRef.setWithPriority(message, Firebase.ServerValue.TIMESTAMP, callback);
    }

    sendGroupMessage(groupId, message, callback) {
        if(!this._groupMessageRef || !groupId){
            return;
        }
        message.senderId = this.phoneNumber;
        message.displayName = this.displayName;
        message.timestamp = Firebase.ServerValue.TIMESTAMP;
        this.removeUndefinedProps(message);
        console.log('groupId to send message is '+groupId);
        let targetGroupRef = this._groupMessageRef.child(groupId);
        let newMessageRef = targetGroupRef.push();
        newMessageRef.setWithPriority(message, Firebase.ServerValue.TIMESTAMP, callback);
    }

    onGroupMessageReceived(groupId, key, message){
        this.onMessageReceived(message, true, groupId);
        //delete once read
        try{
            self._groupMessageRef.child(groupId).child(key).set(null);
            this.updateStatus(message);
        }catch(err){
            console.log("error removing the group message "+ err);
        }
    }

    onMessageReceived(message, isGroupMessage, groupUid){
        switch (message.type) {
            case AppConstants.PLAIN_TEXT:
                MessageService.handleIncomingTextMessage(message, isGroupMessage, groupUid);
                console.log("received message in UI "+ message);
                break;

            case AppConstants.IMAGE_MEDIA:
                console.log("received media message in UI "+ message);
                message.mediaStatus = AppConstants.PENDING_DOWNLOAD;
                MessageService.handleIncomingMediaMessage(message, isGroupMessage, groupUid);
                break;

            default:
                break;
        }
    }

    updateStatus(message){
        if(!this._statusRef){
            return;
        }
        let statusUpdateRef = this._statusRef.child(message.senderId);
        let newStatusUpdateRef = statusUpdateRef.push();
        let statusMessage = {'status' : AppConstants.RECEIVED, 'receivedBy': this.phoneNumber, 'timestamp': Firebase.ServerValue.TIMESTAMP};
        newStatusUpdateRef.setWithPriority(statusMessage, Firebase.ServerValue.TIMESTAMP);
    }

    removeUndefinedProps(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
                delete obj[prop];
            }
        }
    }

}
export default new FirebaseMessageHandler();