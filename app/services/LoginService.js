import {NativeModules} from 'react-native';
import ProfileDao from '../dao/ProfileDao';
import FirebaseClient from '../transport/FirebaseClient';
import ContactsManager from './ContactsManger';
import PhoneFormat from 'phoneformat.js';

class LoginService{
    constructor(){
    }

    authenticateWithDigits(){
        const self = this;
        let DigitsLogin = NativeModules.DigitsLogin;
        let digitsOption = {
            accentColor: '#16a085',
            backgroundColor: '#ffffff',
            title: ''
        };
        let authenticatePromise = DigitsLogin.authenticateWithDigits(digitsOption);
        authenticatePromise.then(function(authResponse){
            self.onRegistrationSuccess(authResponse);
        });
        return authenticatePromise;
    }

    logout(){
        let DigitsLogin = NativeModules.DigitsLogin;
        DigitsLogin.logout();
        ProfileDao.unregisterUser();
    }

    onRegistrationSuccess(data){
        console.log(data.phoneNumber +"/"+ data.authToken);
        this.initializeContactsDB(data.phoneNumber);

        let providerUrl = data.providerUrl;
        let authHeaders  = data.authHeader;
        let phoneNumber = data.phoneNumber;
        FirebaseClient.connect(phoneNumber, providerUrl, authHeaders);
    }

    initializeContactsDB(phoneNumber){
        let countryCode = PhoneFormat.countryForE164Number(phoneNumber);
        console.log("country code is "+countryCode);
        ProfileDao.setPhoneNumberAndCountryCode(phoneNumber, countryCode);
        if(countryCode){
            ContactsManager.init(countryCode);
        }
    }
}

export default new LoginService();