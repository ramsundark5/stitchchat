import FirebaseMessageHandler from '../transport/FirebaseMessageHandler';
import FirebasePresenceHandler from '../transport/FirebasePresenceHandler';
import Message from '../models/Message';
import MessageDao from '../dao/MessageDao';
import ContactsDao from '../dao/ContactsDao';
import ThreadService from './ThreadService';
import GroupInfoService from './GroupInfoService';
import * as MessageActions from '../actions/MessageActions';
import store from '../config/ConfigureStore';
import * as AppConstants from '../constants/AppConstants';
import FileDownloadService from './FileDownloadService';
import {Clipboard} from 'react-native';
import MediaUtility from '../modules/MediaUtility';

class MessageService{

    handleOutgoingTextMessage(thread, text){
        let newMessage         = new Message(text);
        let messageToBeSent    = this.addMessage(thread, newMessage);
        this.sendMessage(messageToBeSent);
    }

    handleIncomingTextMessage(incomingMessage, isGroupMessage, groupUid){
        let newMessage = new Message();
        newMessage = Object.assign(newMessage, incomingMessage);
        let threadForMessage;
        if(isGroupMessage){
            console.log('got group message with id '+groupUid);
            threadForMessage = GroupInfoService.getThreadForGroupId(groupUid);
        }else{
            console.log('got private message from '+newMessage.senderId);
            let contactForPhoneNumber = ContactsDao.getContactForPhoneNumber(newMessage.senderId);
            if(contactForPhoneNumber && contactForPhoneNumber.phoneNumber){
                threadForMessage = ThreadService.getThreadForContact(contactForPhoneNumber);
            }else{
                threadForMessage = ThreadService.getThreadForPhoneNumber(newMessage.senderId);
            }
        }
        if(threadForMessage){
            newMessage.threadId  = threadForMessage.id;
        }
        newMessage.direction  = AppConstants.RECEIVED;
        newMessage.newMessage = false;
        newMessage.timestamp  = new Date();
        let newlyAddedMessage = this.addMessage(threadForMessage, newMessage);
        return newlyAddedMessage;
    }

    handleIncomingMediaMessage(incomingMessage, isGroupMessage, groupUid){
        let messageToBeAdded = this.handleIncomingTextMessage(incomingMessage, isGroupMessage, groupUid);
        FileDownloadService.downloadFile(messageToBeAdded);
    }

    addMessage(thread, newMessage){
        if(!thread){
            return;
        }
        let messageToBeAdded = this.buildMessageDetails(thread, newMessage);
        let messageId = MessageDao.addMessage(messageToBeAdded);
        messageToBeAdded.id = messageId;
        console.log('message saved to db and generated id is '+ messageId);
        if(this.isMessageForCurrentThread(messageToBeAdded)){
            console.log("message is for current thread");
            store.dispatch(MessageActions.addMessage(messageToBeAdded));
        } else{
            console.log("message is NOT for current thread. sending local notification");
            //send local notification
        }
        ThreadService.updateThreadWithNewMessage(thread, messageToBeAdded);
        return messageToBeAdded;
    }

    deleteMessage(message){
        console.log("delete message is called");
        store.dispatch(MessageActions.deleteMessage(message));
        MessageDao.deleteMessages([message]);
        if(message.type != AppConstants.PLAIN_TEXT){
            MediaUtility.deleteMedia(message.mediaUrl);
        }
    }
    
    deleteSelectedMessages(){
        let selectedMessages = this.getSelectedMessages();
        MessageDao.deleteMessages(selectedMessages);
        store.dispatch(MessageActions.deleteSelected());
        for (let selectedMessage of selectedMessages){
            if(selectedMessage.type != AppConstants.PLAIN_TEXT){
                MediaUtility.deleteMedia(selectedMessage.mediaUrl);
            }
        }
    }

    buildMessageDetails(thread, newMessage){
        newMessage.threadId    = thread.id;
        if(thread.isGroupThread){
            newMessage.receiverId=thread.groupInfo.uid;
            newMessage.isGroupThread = true;
        }
        else{
            newMessage.receiverId=thread.recipientPhoneNumber;
        }
        return newMessage;
    }

    isMessageForCurrentThread(newMessage){
        let currentThreadState = store.getState().threadState;
        let currentThread = currentThreadState.currentThread;
        if(currentThread && newMessage.threadId == currentThread.id){
            console.log('message is for current thread');
            return true;
        }
        console.log('message is not for current thread');
        return false;
    }

     sendMessage(message:Message){
        let transportMessage = message.getMessageForTransport();
         console.log('ready to send messgae to '+message.receiverId);
         const self = this;
        if(message.isGroupThread){
            FirebaseMessageHandler.sendGroupMessage(message.receiverId, transportMessage, function(error){
                self.updateMessageStatus(AppConstants.STATUS_SENT, message);
            });
            this.sendNotificationToOfflineGroupMembers(message);
        }else{
            FirebaseMessageHandler.sendPrivateMessage(message.receiverId, transportMessage, function(error){
                console.log('updated message status');
                self.updateMessageStatus(AppConstants.STATUS_SENT, message);
            });
            FirebasePresenceHandler.isUserOnline(message.receiverId).then(function(isRecipientOnline){
                console.log('isRecipientOnline '+ isRecipientOnline);
                if(isRecipientOnline !== true){
                    console.log('adding to notification queue');
                    FirebasePresenceHandler.addToNotificationQueue(message);
                }
            });

        }
     }

    async sendNotificationToOfflineGroupMembers(message){
        let groupId = message.receiverId;
        let groupMembers = await FirebasePresenceHandler.getGroupMembers(groupId);
        for(let groupMember of groupMembers){
            let isGroupMemberOnline = await FirebasePresenceHandler.isUserOnline(groupMember);
            console.log('isGroupMemberOnline '+ isGroupMemberOnline);
            if(isGroupMemberOnline !== true){
                console.log('adding to notification queue');
                FirebasePresenceHandler.addToNotificationQueue(message);
            }
        }
    }

    updateMessageStatus(status, message){
        store.dispatch(MessageActions.updateMessageStatus(message.id, status));
        MessageDao.updateMessageStatus(message.id, status);
    }

    retryPendingMessages(){
        let pendingMessages = MessageDao.getAllPendingMessages();
        for(let message of pendingMessages){
            this.sendMessage(message);
        }
    }

    copyMessages(){
        let selectedMessages = this.getSelectedMessages();
        let messageToBeCopied = [];
        for(let selectedMessage of selectedMessages){
            messageToBeCopied.push(selectedMessage.message);
        }
        let copiedMessages = messageToBeCopied.join('\n');
        Clipboard.setString(copiedMessages);
        store.dispatch(MessageActions.clearSelected());
    }

    getSelectedMessages(){
        let currentMessageState = store.getState().messageState;
        let selectedMessages = [];
        for (let messageDate in currentMessageState.messages) {
            if (currentMessageState.messages.hasOwnProperty(messageDate)) {
                if(!(currentMessageState.messages[messageDate] && currentMessageState.messages[messageDate].length > 0)){
                    continue;
                }
                for(let messageForDate of currentMessageState.messages[messageDate]){
                    if(messageForDate.selected){
                        try{
                            selectedMessages.push(messageForDate);
                        }catch(err){
                            console.log('error trying to forward message to thread '+thread.id);
                        }

                    }
                }
            }
        }
        return selectedMessages;
    }
}

export default new MessageService();