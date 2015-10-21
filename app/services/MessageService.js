import MQTTClient from '../transport/MQTTClient';
import store from '../config/ConfigureStore';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as MessageActions from '../actions/MessageActions';
import * as AppConfig from '../config/AppConfig';
import Message from '../models/Message';
import MessageDao from '../dao/MessageDao';

class MessageService{

    init(){
        MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
    }

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
        return newMessage;
    }

    sendMessage(message:Message){
        let encodedReceiverId = encodeURIComponent(message.receiverId);
        let publishTopic = AppConfig.PRIVATE_PUBSUB_TOPIC + encodedReceiverId;
        if(message.isGroupThread){
            publishTopic = AppConfig.GROUP_PUBSUB_TOPIC + encodedReceiverId;
        }
        this.sendMessageToTopic(publishTopic, message);
    }

    sendMessageToTopic(topic:String, message:Message){
        try{
            let transportMessage = message.getMessageForTransport();
            let transportMessageWrapper = {};
            transportMessageWrapper.header = {};
            transportMessageWrapper.message = transportMessage;
            MQTTClient.publish(topic, transportMessageWrapper);
        }catch(err){
            console.log("error publishing message" +err);
        }
    }

    onConnected(){
        console.log("connection initialized invoked");
        //resend all pending messages
    }

    onMessageReceived(message){
        if(message && message.data){
            let messageWrapperObj = JSON.parse(message.data);
            let messageObj = messageWrapperObj.message;
            //store.dispatch(MessageActions.addMessage(message));
            console.log("received message in UI "+ messageObj.text);
        }else{
            console.log("got empty messages. something is wrong.");
        }

    }
}

module.exports = new MessageService();