import MQTTClient from '../transport/MQTTClient';
import {NativeModules} from 'react-native';
import CacheService from './CacheService';
import MessageService from './MessageService';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as AppConstants from '../constants/AppConstants';
import moment from 'moment';

class BackgroundService{

    init(){
        //MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
        this.syncContacts();
    }

    async syncContacts(){
        try{
            let ContactsSyncer = NativeModules.ContactsSyncer;
            ContactsSyncer.syncContacts();
        }catch(err){
            console.log("Error syncing contacts "+err);
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

            MessageService.handleIncomingTextMessage(messageObj);
            console.log("received message in UI "+ messageObj.text);
        }else{
            console.log("got empty messages. something is wrong.");
        }
    }
}
export default new BackgroundService();