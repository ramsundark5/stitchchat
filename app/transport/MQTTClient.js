import {RNMQTTClient} from 'NativeModules';
import * as NM from 'NativeModules';
var { NativeAppEventEmitter } = require('react-native');

class MQTTClient{

    constructor(){
        //console.log('native mods are '+NM);
    }
    init(){
        this.connect("broker.mqttdashboard.com", 1883);
        var subscription = NativeAppEventEmitter.addListener(
            'onMessageReceived',
            (message) => console.log(message)
        );
    }

    connect(host, port, clientId){
        RNMQTTClient.connect(host, port);
    }

    publish(message){
        RNMQTTClient.send(message.text);
    }

    subscribe(){

    }

    onReceiveMessage(message){

    }

    onConnected(){

    }

    onDisconnected(){

    }

    disconnect(){

    }


}
module.exports = MQTTClient;