import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

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
    }

    onRegistrationSuccessAndroid(data){
        console.log(data.phoneNumber +"/"+ data. X-Auth-Service-Provider);
    }

    onRegistrationCancelled(reason){
        console.log(reason);
    }
}

module.exports = new LoginService();