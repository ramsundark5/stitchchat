import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class LoginService{
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
    }

    onRegistrationCancelled(reason){
        console.log(reason);
    }
}

module.exports = new LoginService();