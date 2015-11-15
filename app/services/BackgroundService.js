import MQTTClient from '../transport/MQTTClient';
import {NativeModules} from 'react-native';
import CacheService from './CacheService';
import MessageService from './MessageService';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as AppConstants from '../constants/AppConstants';
import MessageDao from '../dao/MessageDao';
import * as MessageConstants from '../constants/MessageConstants';
import moment from 'moment';

class BackgroundService{

    init(){
        //MQTTClient.init();
        RCTDeviceEventEmitter.addListener('onMQTTConnected', this.onConnected.bind(this));
        RCTDeviceEventEmitter.addListener('onMessageReceived', this.onMessageReceived);
        RCTDeviceEventEmitter.addListener('fileUploadCompleted', this.onFileUploadCompleted);
        RCTDeviceEventEmitter.addListener('fileUploadFailed', this.onFileUploadFailed);
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

    onFileUploadCompleted(messageId){
        MessageDao.updateUploadStatus(messageId, MessageConstants.UPLOAD_COMPLETED)
    }

    onFileUploadFailed(messageId){
        MessageDao.updateUploadStatus(messageId, MessageConstants.UPLOAD_FAILED)
    }
}
export default new BackgroundService();