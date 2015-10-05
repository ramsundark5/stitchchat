import {NativeModules} from 'react-native';
import React, { AsyncStorage } from 'react-native';
var {Platform} = React;
import * as AppConfig from '../config/AppConfig';

class MQTTClient{

    constructor(){
        this.mqttClient = NativeModules.RNMQTTClient;
    }

    async init(){
        let phoneNumber = await AsyncStorage.getItem("phoneNumber");
        if(!phoneNumber){
            phoneNumber = '%2B13392247442';
        }
        if(phoneNumber){
            console.log("got phone number from async storage as "+ phoneNumber);
            this.connect(phoneNumber);
        }

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
        console.log('platform is '+Platform.OS);
        let encodedPhoneNumber = encodeURIComponent(phoneNumber);
        console.log('encodedPhoneNumber is '+encodedPhoneNumber);
        let inboxSubscribeTopic = AppConfig.INBOX_TOPIC_PREFIX + encodedPhoneNumber;
        this.mqttClient.connect(connectionDetails, inboxSubscribeTopic, 1);
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

    disconnect(){
        this.mqttClient.disconnect();
    }


}
module.exports = new MQTTClient();