import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import React, { AsyncStorage } from 'react-native';
import CacheService from '../services/CacheService';

class LoginService{
    constructor(){
        RCTDeviceEventEmitter.addListener('registrationSuccessIOS', this.onRegistrationSuccessIOS);
        RCTDeviceEventEmitter.addListener('registrationSuccessIAndroid', this.onRegistrationSuccessAndroid);
        RCTDeviceEventEmitter.addListener('registrationCancelled', this.onRegistrationCancelled);
    }

    showLoginPage(){
        let DigitsLogin = NativeModules.DigitsLogin;
        DigitsLogin.startLoginProcess();
    }

    logout(){
        let DigitsLogin = NativeModules.DigitsLogin;
        DigitsLogin.logout();
    }

    onRegistrationSuccessIOS(data){
        console.log(data.phoneNumber +"/"+ data.authToken);
        CacheService.setAndPersist("phoneNumber", data.phoneNumber);
    }

    onRegistrationSuccessAndroid(data){
        console.log(data.phoneNumber +"/"+ data. X-Auth-Service-Provider);
        CacheService.setAndPersist("phoneNumber", data.phoneNumber);
    }

    onRegistrationCancelled(reason){
        console.log(reason);
    }

    async putMessage(threadId, newMessage){
        let threadMessagesStr = await AsyncStorage.getItem(threadId);
        let threadMessages = JSON.parse(threadMessagesStr);
        if(!threadMessages || threadMessages.constructor != Array){
            threadMessages = [];
        }
        threadMessages.push(newMessage);
        let stringMsg = JSON.stringify(threadMessages);
        AsyncStorage.setItem(threadId, stringMsg);
    }

}

module.exports = new LoginService();