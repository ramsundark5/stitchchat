import { AsyncStorage, Platform } from 'react-native';
import * as AppConstants from '../constants/AppConstants';
import Firebase from 'firebase';

class FirebaseUserPreferenceHandler{

    init(firebaseRef, phoneNumber, displayName){
        this._firebase   = firebaseRef;
        this.phoneNumber = phoneNumber;
        this.displayName = displayName;
        this._userRef    = this._firebase.child('users').child(this.phoneNumber);
        this._userRef.update({active: true});
        this.updatePushNotificationDetailsFromStorage();
    }

    updatePublicProfile(profile){
        //update name, photo, status message, etc
        //this._userRef.child('public');
    }

    async updatePushNotificationDetailsFromStorage(){
        let pushToken = await AsyncStorage.getItem(AppConstants.PENDING_PUSH_TOKEN);
        if(pushToken){
            console.log('ready to update pushtoken with token value '+pushToken);
            this.updateUserNotificationPref(Platform.OS, pushToken);
            AsyncStorage.removeItem(AppConstants.PENDING_PUSH_TOKEN);
        }
    }

    updatePushNotificationDetails(response){
        if(!this._userRef){
            AsyncStorage.setItem(AppConstants.PENDING_PUSH_TOKEN, response.token );
            console.log('store pushtoken to asyncstorage with the value '+response.token);
        }
        else{
            this.updateUserNotificationPref(response.os, response.token);
        }
    }

    updateUserNotificationPref(os, token){
        if(!this._userRef){
            return;
        }
        this._userRef.set({
            phoneType: os,
            pushToken: token,
            timestamp: Firebase.ServerValue.TIMESTAMP
        });
    }
    
    blockUser(phoneNumberToBlock, isBlocked){
        if(!this._userRef){
            console.log('firebase not initialized yet');
            return;
        }
        let blockedFlag = null;
        if(isBlocked){
            blockedFlag = true;
        }
        this._userRef.child('blocked')
            .child(phoneNumberToBlock)
            .set(blockedFlag, function(error){
                if(!error){
                    console.log('block flag updated in firebase');
                }else{
                    console.log('error updating block flag '+err);
                }
            });
    }

    muteUser(phoneNumberToMute, isMuted){
        if(!this._userRef){
            return;
        }
        let mutedFlag = null;
        if(isMuted){
            mutedFlag = true;
        }
        this._userRef.child('muted')
            .child(phoneNumberToMute)
            .set(mutedFlag);
    }

}

export default new FirebaseUserPreferenceHandler();