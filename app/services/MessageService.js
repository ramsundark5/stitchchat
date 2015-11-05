import MQTTClient from '../transport/MQTTClient';
import * as AppConfig from '../config/AppConfig';
import Message from '../models/Message';
import MessageDao from '../dao/MessageDao';
import ThreadService from './ThreadService';
import * as MessageActions from '../actions/MessageActions';
import store from '../config/ConfigureStore';
import FileUploadService from './FileUploadService';

class MessageService{

    async handleOutgoingTextMessage(text){
        let newMessage      = new Message(text);
        let messageToBeSent = await this.addMessage(newMessage);
        this.sendMessage(messageToBeSent);
    }

    handleIncomingTextMessage(newMessage){
        this.addMessage(newMessage);
    }

    async addMessage(newMessage){
        let messageToBeSent = this.buildNewMessage(newMessage);
        let messageId = await MessageDao.addMessage(messageToBeSent.threadId, messageToBeSent);
        messageToBeSent.id = messageId;
        ThreadService.updateThreadWithNewMessage(messageToBeSent);
        if(this.isMessageForCurrentThread(messageToBeSent)){
            store.dispatch(MessageActions.addMessage(messageToBeSent));
        }
        return messageToBeSent;
    }

    buildNewMessage(newMessage){
        let currentThreadState = store.getState().threadState;
        let currentThread      = currentThreadState.currentThread;
        newMessage.threadId    = currentThread.id;
        if(currentThread.isGroupThread){
            newMessage.receiverId=currentThread.groupUid;
            newMessage.isGroupThread = true;
        }
        else{
            newMessage.receiverId=currentThread.recipientPhoneNumber;
        }
        return newMessage;
    }

    isMessageForCurrentThread(newMessage){
        let currentThreadState = store.getState().threadState;
        let currentThread = currentThreadState.currentThread;
        if(newMessage.threadId == currentThread.id){
            return true;
        }
        return false;
    }

    sendMessage(message:Message){
        let encodedReceiverId = encodeURIComponent(message.receiverId);
        let publishTopic = AppConfig.PRIVATE_PUBSUB_TOPIC + encodedReceiverId;
        if(message.isGroupThread){
            publishTopic = AppConfig.GROUP_PUBSUB_TOPIC + encodedReceiverId;
        }
        let transportMessage = message.getMessageForTransport();
        this.sendMessageToTopic(publishTopic, transportMessage);
    }

    sendMessageToTopic(topic:String, content){
        try{
            let transportMessageWrapper = {};
            transportMessageWrapper.header = {};
            transportMessageWrapper.message = content;
            MQTTClient.publish(topic, transportMessageWrapper);
        }catch(err){
            console.log("error publishing message" +err);
        }
    }

}

module.exports = new MessageService();