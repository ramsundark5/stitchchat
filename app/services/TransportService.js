import MQTTClient from '../transport/MQTTClient';
import store from '../config/ConfigureStore';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as MessageActions from '../actions/MessageActions';

class TransportService{
    init(){
        MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
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

    onConnected(){
        console.log("connection initialized invoked");
        //resend all pending messages
    }

    onMessageReceived(message){
        if(message && message.data){
            let messageWrapperObj = JSON.parse(message.data);
            let messageObj = messageWrapperObj.message;
            store.dispatch(MessageActions.addMessage(message));
            //MessageDao.addMessage();
            console.log("received message in UI "+ messageObj.text);
        }else{
            console.log("got empty messages. something is wrong.");
        }

    }
}
module.exports = new TransportService();