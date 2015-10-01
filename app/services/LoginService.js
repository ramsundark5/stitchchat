import {NativeModules} from 'react-native';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class LoginService{

    showLoginPage(){
        let DigitsLogin = NativeModules.DigitsLogin;
        DigitsLogin.startLoginProcess();
    }

    logout(){
        let DigitsLogin = NativeModules.DigitsLogin;
        DigitsLogin.logout();
    }
}