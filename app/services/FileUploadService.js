import {NativeModules} from 'react-native';
import MessageDao from '../dao/MessageDao';
import * as AppConstants from '../constants/AppConstants';
import MediaUtility from '../modules/MediaUtility';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNFileManager;
    }

    async uploadFile(mediaMessage, mediaExtension){
        console.log('media to be uploaded '+JSON.stringify(mediaMessage));
        try{
            let response = await this.getSignedUrl(mediaExtension);
            console.log("signed url is: "+ response);
            if(response){
                this.uploadFileInternal(response.url, response.attachmentId, mediaMessage);
            }
        }catch(err){
            console.log("Error uploading media "+ err);
        }
    }

     uploadFileInternal(signedUrl, attachmentId, mediaMessage){
        try{
            MessageDao.updateMessageWithAttachmentId(mediaMessage, attachmentId);
            MessageDao.updateMediaStatus(mediaMessage.id, AppConstants.UPLOAD_IN_PROGRESS);
            if(mediaMessage.mediaUrl.startsWith("ph://")){
                this.uploadMediaWithIdentifier(mediaMessage, signedUrl);
            }else{
                this.uploadMediaWithUrl(mediaMessage, signedUrl);
            }
        }catch(err){
            console.log("upload errored out "+ err);
            MessageDao.updateMediaStatus(mediaMessage.id, AppConstants.UPLOAD_FAILED);
        }
    }

    async uploadMediaWithIdentifier(mediaMessage, signedUrl){
        let localMediaUrl = MediaUtility.removePrefixFromLocalMediaIdentifier(mediaMessage.mediaUrl);
        let response = await this.fileManager.uploadMedia(localMediaUrl, signedUrl, mediaMessage.id);
        console.log("upload response is "+ response);
        debugAsyncObject(response);
    }

    async uploadMediaWithUrl(mediaMessage, signedUrl){
        let response = await this.fileManager.uploadMediaFromURL(mediaMessage.mediaUrl, signedUrl, mediaMessage.id);
        console.log("upload response is "+ response);
        debugAsyncObject(response);
    }

    getSignedUrl(mediaExtension){
        var options = {
            method: 'GET'
        };

        return fetch(AppConstants.SERVER_URL + '/attachments?ext='+mediaExtension, options)
            .then((response) => response.json())
            .then((jsonData) => {
                return jsonData;
            }).catch((error) => {
                console.log('Error getting signed url: '+ error);
                return null;
            });
    }
}

export default new FileUploadService();