import MQTTClient from '../transport/MQTTClient';
import * as AppConfig from '../config/AppConfig';
import Message from '../models/Message';
import MessageDao from '../dao/MessageDao';
import ThreadService from './ThreadService';
import CacheService from './CacheService';
import * as MessageActions from '../actions/MessageActions';
import store from '../config/ConfigureStore';
import * as AppConstants from '../constants/AppConstants';

class MessageService{

    async handleOutgoingTextMessage(text){
        let newMessage      = new Message(text);
        let currentThreadState = store.getState().threadState;
        let currentThread      = currentThreadState.currentThread;
        let messageToBeSent = await this.addMessage(currentThread, newMessage);
        this.sendMessage(messageToBeSent);
    }

    handleIncomingTextMessage(newMessage){
        this.addMessage(newMessage);
    }

    async addMessage(thread, newMessage){
        let messageToBeSent = this.buildMessageDetails(thread, newMessage);
        let messageId = await MessageDao.addMessage(messageToBeSent.threadId, messageToBeSent);
        messageToBeSent.id = messageId;
        console.log('message saved to db and generated id is '+ messageId);
        let currentTime = new Date().getTime();
        messageToBeSent.timestamp = currentTime;
        ThreadService.updateThreadWithNewMessage(messageToBeSent);
        if(this.isMessageForCurrentThread(messageToBeSent)){
            store.dispatch(MessageActions.addMessage(messageToBeSent));
        } else{
            //send local notification
        }
        return messageToBeSent;
    }

    buildMessageDetails(thread, newMessage){
        newMessage.threadId    = thread.id;
        newMessage.remoteName  = CacheService.get(AppConstants.PROFILE_NAME);
        if(thread.isGroupThread){
            newMessage.receiverId=thread.groupUid;
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
        if(newMessage.threadId == currentThread.id){
            console.log('message is for current thread');
            return true;
        }
        console.log('message is not for current thread');
        return false;
    }
l
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

export default new MessageService();