import {NativeModules} from 'react-native';
import React, { AsyncStorage } from 'react-native';
import * as AppConfig from '../config/AppConfig';

class MQTTClient{

    constructor(){
        this.mqttClient = NativeModules.RNMQTTClient;
    }

    async init(){
        let phoneNumber = await AsyncStorage.getItem("phoneNumber");
        let token = await AsyncStorage.getItem("token");
        if(!phoneNumber){
            phoneNumber = '%2B13392247442';
        }
        if(phoneNumber && token){
            console.log("got phone number from async storage as "+ phoneNumber);
            console.log("got token from async storage as "+ token);
            this.connect(phoneNumber, token);
        }
    }

    connect(phoneNumber, token){
        let encodedPhoneNumber = encodeURIComponent(phoneNumber);
        console.log('encodedPhoneNumber is '+encodedPhoneNumber);

        var connectionDetails = {
            host: 'localhost',
            port: 1883,
            tls : false,
            cleanSession: false,
            clientId: phoneNumber,
            username: phoneNumber,
            password: token,
            auth: true
        }

        if(!this.mqttClient){
            return;
        }
        //console.log('platform is '+Platform.OS);
        let inboxSubscribeTopic = AppConfig.PRIVATE_PUBSUB_TOPIC + encodedPhoneNumber;
        this.mqttClient.connect(connectionDetails, inboxSubscribeTopic, 1);
    }

    publish(topicName, message, qosLevel = 1, retain = false){
        if(!topicName){
            throw("topic name is required to publish message");
        }
        if(!message){
            throw("message is required to publish message");
        }
        let messageJson = JSON.stringify(message);
        this.mqttClient.publish(topicName, messageJson, qosLevel, retain);
    }

    subscribeTo(topicName, qosLevel){
        this.mqttClient.subscribeTo(topicName, qosLevel);
    }

    onStatusChanged(newStatus){
        console.log("new status is "+newStatus);
    }

    disconnect(){
        this.mqttClient.disconnect();
    }


}
module.exports = new MQTTClient();