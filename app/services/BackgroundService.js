import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';
import MessageService from './MessageService';
import FirebaseUserPreferenceHandler from '../transport/FirebaseUserPreferenceHandler';
import LoginService from './LoginService';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import MessageDao from '../dao/MessageDao';
import * as MessageConstants from '../constants/AppConstants';
import ProfileService from './ProfileService';

class BackgroundService{

    init(){
        this.initFirebase();
        this.initPushNotification();
        RCTDeviceEventEmitter.addListener('fileUploadCompleted', this.onFileUploadCompleted.bind(this));
        RCTDeviceEventEmitter.addListener('fileUploadFailed', this.onFileUploadFailed.bind(this));
        RCTDeviceEventEmitter.addListener('fileDownloadCompleted', this.onFileDownloadCompleted.bind(this));
        RCTDeviceEventEmitter.addListener('fileDownloadFailed', this.onFileDownloadFailed.bind(this));
    }

    initFirebase(){
        let isRegistered = ProfileService.isAppRegistered();
        if(isRegistered){
            //calling loginservice will init firebase
            LoginService.authenticateWithDigits();
        }
    }

    initPushNotification(){
        let isRegistered = ProfileService.isAppRegistered();
        if(!isRegistered){
            return;
        }

        PushNotification.configure({

            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(response) {
                console.log( 'TOKEN:', response.token );
               /* let type = 'ios';
                if (Platform.OS === 'android') {
                    type = 'android';
                }*/
                FirebaseUserPreferenceHandler.updatePushNotificationDetails(response);
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.log( 'NOTIFICATION:', notification );
                this._onNotification(notification);
            },

            // ANDROID ONLY: (optional) GCM Sender ID.
            senderID: "YOUR GCM SENDER ID",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * IOS ONLY: (optional) default: true
             * - Specified if permissions will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true
        });
    }

    onFileUploadCompleted(messageId){
        console.log("onFileUploadCompleted "+messageId);
        MessageDao.updateMediaStatus(messageId, MessageConstants.UPLOAD_COMPLETED);
        let messageForId = MessageDao.getMessageById(messageId);
        MessageService.sendMessage(messageForId);
    }

    onFileDownloadCompleted(response){
        console.log("onFileDownloadCompleted "+response.messageId);
        MessageDao.updateMessageWithDownloadedMediaUrl(response.messageId, response.mediaUrl);
    }

    onFileUploadFailed(messageId){
        MessageDao.updateMediaStatus(messageId, MessageConstants.UPLOAD_FAILED);
    }

    onFileDownloadFailed(messageId){
        MessageDao.updateMediaStatus(messageId, MessageConstants.DOWNLOAD_FAILED);
    }

    _onNotification(notification) {
        PushNotification.localNotification({
            'userInfo': {},
            'message': notification.getMessage()
        });
    }
}
export default new BackgroundService();