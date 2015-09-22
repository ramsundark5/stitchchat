import {RNMQTTClient} from 'NativeModules';
import * as NM from 'NativeModules';
var { NativeAppEventEmitter } = require('react-native');

class MQTTClient{

    constructor(){
        //console.log('native mods are '+NM);
    }
    init(){
        if(!RNMQTTClient){
            return;
        }
        var connectionDetails = {
            host: 'broker.mqttdashboard.com',
            port: 1883,
            tls : false
        }
        this.connect(connectionDetails);
        this.subscribeTo('MQTTChatReceive', 1);
        NativeAppEventEmitter.addListener('onMessageReceived', this.onReceiveMessaged);
        NativeAppEventEmitter.addListener( 'onStatusChanged', this.onStatusChanged);
    }

    connect(connectionDetails){
        RNMQTTClient.connect(connectionDetails);
    }

    publish(topicName, message, qosLevel = 0, retain = false){
        if(!topicName){
            throw("topic name is required to publish message");
        }
        if(!message || !message.text){
            throw("message is required to publish message");
        }
        RNMQTTClient.publish(topicName, message.text, qosLevel, retain);
    }

    subscribeTo(topicName, qosLevel){
        RNMQTTClient.subscribeTo(topicName, qosLevel);
    }

    onStatusChanged(newStatus){
        console.log("new status is "+newStatus);
    }

    onReceiveMessaged(message){
        console.log(message);
    }

    onConnected(){

    }

    onDisconnected(){

    }

    disconnect(){

    }


}
module.exports = MQTTClient;