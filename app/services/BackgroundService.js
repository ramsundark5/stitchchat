import MQTTClient from '../transport/MQTTClient';
import * as MessageActions from '../actions/MessageActions';
import store from '../config/ConfigureStore';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class BackgroundService{

    init(){
        MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
    }

    onConnected(){
        console.log("connection initialized invoked");
        //resend all pending messages
    }

    onMessageReceived(message){
        if(message && message.data){
            let messageWrapperObj = JSON.parse(message.data);
            let messageObj = messageWrapperObj.message;

            //check if message belongs to current thread before dispatching
            store.dispatch(MessageActions.addMessage(message));
            //MessageDao.addMessage();
            console.log("received message in UI "+ messageObj.text);
        }else{
            console.log("got empty messages. something is wrong.");
        }
    }
}
module.exports = new BackgroundService();