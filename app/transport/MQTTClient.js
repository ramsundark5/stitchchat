import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import store from '../store/ConfigureStore';
import * as MessageActions from '../actions/MessageActions';

class MQTTClient{

    constructor(){
        this.mqttClient = NativeModules.RNMQTTClient;
    }

    init(){
        var connectionDetails = {
            host: 'broker.mqttdashboard.com',
            port: 1883,
            tls : false
        }
        if(!this.mqttClient){
            return;
        }

        this.connect(connectionDetails);

        this.subscribeTo('MQTTChatReceive', 1);

        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onReceiveMessaged);
        RCTDeviceEventEmitter.addListener( 'onStatusChanged', this.onStatusChanged);

    }

    connect(connectionDetails){
        this.mqttClient.connect(connectionDetails);
    }

    publish(topicName, message, qosLevel = 0, retain = false){
        if(!topicName){
            throw("topic name is required to publish message");
        }
        if(!message || !message.text){
            throw("message is required to publish message");
        }
        this.mqttClient.publish(topicName, message.text, qosLevel, retain);
    }

    subscribeTo(topicName, qosLevel){
        this.mqttClient.subscribeTo(topicName, qosLevel);
    }

    onStatusChanged(newStatus){
        console.log("new status is "+newStatus);
    }

    onReceiveMessaged(message){
        store.dispatch(MessageActions.addMessage(message));
        console.log("received message in UI "+ message);
    }

    onConnected(){

    }

    onDisconnected(){

    }

    disconnect(){

    }


}
module.exports = new MQTTClient();