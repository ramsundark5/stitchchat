import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import React, { AsyncStorage } from 'react-native';
import CacheService from './CacheService';

class LoginService{
    constructor(){
        RCTDeviceEventEmitter.addListener('registrationSuccess', this.onRegistrationSuccess);
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

    onRegistrationSuccess(data){
        console.log(data.phoneNumber +"/"+ data.authToken);
        CacheService.setAndPersist("phoneNumber", data.phoneNumber);
        var options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Service-Provider': data['X-Auth-Service-Provider'],
                'X-Verify-Credentials-Authorization': data['X-Verify-Credentials-Authorization'],
                'phoneNumber': data['phoneNumber']
            }
        };
        fetch('http://localhost:3000/register', options)
            .then(function(res) {
                console.log("response is "+res);
                return res.json();
            })
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