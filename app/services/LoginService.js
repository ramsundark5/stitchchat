var NativeModules = require('react-native').NativeModules;
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

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