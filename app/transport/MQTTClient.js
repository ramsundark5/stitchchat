import {NativeModules, Platform} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import store from '../store/ConfigureStore';
import * as MessageActions from '../actions/MessageActions';
import React, { AsyncStorage } from 'react-native';

class MQTTClient{

    constructor(){
        this.mqttClient = NativeModules.RNMQTTClient;
    }

    async init(){
        let phoneNumber = await AsyncStorage.getItem("phoneNumber");
        if(!phoneNumber){
            phoneNumber = '3392247442';
        }
        if(phoneNumber){
            console.log("got phone number from async storage as "+ phoneNumber);
            this.connect(phoneNumber);
        }
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
        //RCTDeviceEventEmitter.addListener('onStatusChanged', this.onStatusChanged);
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnectionInitialized.bind(this));
    }

    connect(phoneNumber){
        var connectionDetails = {
            host: 'broker.mqttdashboard.com',
            port: 1883,
            tls : false,
            clientId: phoneNumber
        }

        if(!this.mqttClient){
            return;
        }
        console.log('platform is '+Platform);
        //this.mqttClient.connect(connectionDetails);
        this.mqttClient.connect(connectionDetails, 'MQTTChatReceive', 1);
    }

    onConnectionInitialized(){
        console.log("connection initialized invoked");
        this.subscribeTo('MQTTChatReceive', 1);
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

    onMessageReceived(message){
        store.dispatch(MessageActions.addMessage(message));
        console.log("received message in UI "+ message);
    }

    onDisconnected(){

    }

    disconnect(){

    }


}
module.exports = new MQTTClient();