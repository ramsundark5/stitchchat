import {NativeModules} from 'react-native';
import * as AppConstants from '../constants/AppConstants';
import MessageDao from '../dao/MessageDao';

class FileDownloadService{

    constructor(){
        this.fileManager = NativeModules.RNFileManager;
    }

    async downloadFile(mediaMessage){
        try{
            let response = await this.getSignedUrlForDownload(mediaMessage.attachmentId);
            console.log("signed url for download is: "+ response);
            if(response){
                this.downloadFileInternal(response.url, mediaMessage);
            }
        }catch(err){
            console.log("Error downloading media "+ err);
        }
    }

    async downloadFileInternal(signedUrl, mediaMessage){
        try{
            MessageDao.updateMediaStatus(mediaMessage.id, AppConstants.DOWNLOAD_IN_PROGRESS);
            let response = await this.fileManager.downloadFile(signedUrl, mediaMessage.id);
            console.log("download response is "+ response);
            debugAsyncObject(response);

        }catch(err){
            console.log("download errored out "+ err);
            MessageDao.updateMediaStatus(mediaMessage.id, AppConstants.DOWNLOAD_FAILED);
        }
    }

    getSignedUrlForDownload(attachmentId){
        var options = {
            method: 'GET'
        };

        return fetch(AppConstants.SERVER_URL + '/attachments/' +attachmentId, options)
            .then((response) => response.json())
            .then((jsonData) => {
                return jsonData;
            }).catch((error) => {
                console.log('Error getting signed url for download: '+ error);
                return null;
            });
    }
}

export default new FileDownloadService();