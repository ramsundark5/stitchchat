import Firebase from 'firebase';
import ProfileDao from '../dao/ProfileDao';
import FirebaseInviteHandler from './FirebaseInviteHandler';
import FirebaseMessageHandler from './FirebaseMessageHandler';
import FirebaseUserPreferenceHandler from './FirebaseUserPreferenceHandler';
import FirebasePresenceHandler from './FirebasePresenceHandler';
import * as AppConstants from '../constants/AppConstants';
import MessageService from '../services/MessageService';

class FirebaseClient{

    constructor(){
        //this.connect();
    }

    connect(phoneNumber, providerUrl, authHeaders){
        let profile = ProfileDao.getProfile();
        this.phoneNumber = profile.phoneNumber;
        this.displayName = profile.displayName;
        if(!this.phoneNumber){
            //app is not registered. nothing to initialize
            return;
        }
        this._firebase = new Firebase("https://stitchchat.firebaseio.com/");

        this.getAuthToken(phoneNumber, providerUrl, authHeaders)
            .then((response) =>this.initFirebase(response));

    }

    initFirebase(response){
        const self = this;
        this._firebase.authWithCustomToken(response.token, (error, authData) => {
            if (error) {
                console.log("Authentication Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                self.setupListeners(self.phoneNumber);
                MessageService.retryPendingMessages();
            }
        });
    }
    // Initialize Firebase listeners and callbacks for the supported bindings.
    setupListeners(phoneNumber){
        this._userRef           = this._firebase.child('users').child(this.phoneNumber);
        this._moderatorsRef     = this._firebase.child('moderators');
        this._suspensionsRef    = this._firebase.child('suspensions');
        this._usersOnlineRef    = this._firebase.child('users_online');

        FirebaseInviteHandler.init(this._firebase, this.phoneNumber, this.displayName);
        FirebaseMessageHandler.init(this._firebase, this.phoneNumber, this.displayName);
        FirebaseUserPreferenceHandler.init(this._firebase, this.phoneNumber, this.displayName);
        FirebasePresenceHandler.init(this._firebase, this.phoneNumber, this.displayName);
    }

    getAuthToken(phoneNumber, providerUrl, authHeaders){
        var options = {
            method: 'GET',
            headers: {
                'x-auth-service-provider': providerUrl,
                'x-verify-credentials-authorization': authHeaders,
                'phonenumber': phoneNumber
            },
        };

        return fetch(AppConstants.SERVER_URL + '/authenticate', options)
            .then((response) => response.json())
            .then((jsonData) => {
                return jsonData;
            }).catch((error) => {
                console.log('Error getting firebase token: '+ error);
                return null;
            });
    }
}

export default new FirebaseClient();