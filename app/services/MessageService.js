import MQTTClient from '../transport/MQTTClient';
import store from '../store/ConfigureStore';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as MessageActions from '../actions/MessageActions';
import * as AppConfig from '../config/AppConfig';

class MessageService{

    init(){
        MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
    }

    sendMessage(message){
        sendMessage(AppConfig.PUBLISH_TOPIC, message);
    }

    sendMessage(topic, message){
        try{
            MQTTClient.publish(topic, message);
        }catch(err){
            console.log("error publishing message" +err);
        }
    }

    onConnected(){
        console.log("connection initialized invoked");
        //resend all pending messages
    }

    onMessageReceived(message){
        store.dispatch(MessageActions.addMessage(message));
        console.log("received message in UI "+ message);
    }
}

module.exports = new MessageService();