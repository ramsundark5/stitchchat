import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';
//import { RCTDeviceEventEmitter } from 'react-native';
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
class MQTTClient{

    constructor(){
        console.log('native mods are '+NativeModules);
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
        if(NativeAppEventEmitter){
            NativeAppEventEmitter.addListener('onMessageReceived', this.onReceiveMessaged);
            NativeAppEventEmitter.addListener( 'onStatusChanged', this.onStatusChanged);
        }
        if(RCTDeviceEventEmitter){
            RCTDeviceEventEmitter.addListener('onMessageReceived', this.onReceiveMessaged);
            RCTDeviceEventEmitter.addListener( 'onStatusChanged', this.onStatusChanged);
        }

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