import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import React, { AsyncStorage } from 'react-native';
import CacheService from './CacheService';
import MQTTClient from '../transport/MQTTClient';

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
        let serverVerifiedPhoneNumber = data.phoneNumber;
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
            .then((response) => response.json())
            .then((jsonData) => {
                let jwtToken = jsonData.jwt;
                CacheService.setAndPersist("token", jwtToken);
                MQTTClient.connect(serverVerifiedPhoneNumber, jwtToken);
            }).catch((error) => {
                console.log('auth failed'+ error);
            })
    }

    onRegistrationCancelled(reason){
        console.log(reason);
    }

}

module.exports = new LoginService();