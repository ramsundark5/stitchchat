import MQTTClient from '../transport/MQTTClient';
import * as AppConfig from '../config/AppConfig';
import Message from '../models/Message';
import MessageDao from '../dao/MessageDao';
import ThreadService from './ThreadService';

class MessageService{

    async addMessage(thread, text){
        let newMessage = new Message(text, thread.id);
        if(thread.isGroupThread){
            newMessage.receiverId=thread.groupUid;
            newMessage.isGroupThread = true;
        }
        else{
            newMessage.receiverId=thread.recipientPhoneNumber;
        }

        let messageId = await MessageDao.addMessage(newMessage.threadId, newMessage);
        newMessage.id = messageId;
        this.sendMessage(newMessage);
        ThreadService.updateThreadWithNewMessage(newMessage);
        return newMessage;
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