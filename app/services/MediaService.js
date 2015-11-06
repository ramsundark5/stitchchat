import uuid from 'node-uuid';
import ThreadDao from '../dao/ThreadDao';
import * as ThreadActions from '../actions/ThreadActions';
import MessageService from './MessageService';
import * as AppConfig from '../config/AppConfig';
import store from '../config/ConfigureStore';
import Message from '../models/Message';
import * as MessageConstants from '../constants/MessageConstants';
import FileUploadService from './FileUploadService';
import MessageDao from '../dao/MessageDao';

class MediaService{

    async addSelectedMedias(selectedMedias){
        if(!selectedMedias || selectedMedias.length <= 0){
            return;
        }
        for(let i = 0; i<selectedMedias.length; i++ ){
            this.handleOutgoingMediaMessage(selectedMedias[i]);
        }
    }

    async handleOutgoingMediaMessage(media){
        let currentThreadState = store.getState().threadState;
        let currentThread      = currentThreadState.currentThread;
        let newMessage      = this.buildMediaMessage(media);
        let messageToBeSent = await MessageService.addMessage(currentThread, newMessage);
        try{
            let uploadResponse  = await FileUploadService.uploadFile(media.uri);
            console.log("upload completed with response "+uploadResponse);
            MessageDao.updateUploadStatus(messageToBeSent, MessageConstants.UPLOAD_COMPLETED);
            MessageService.sendMessage(messageToBeSent);
        }catch(err){
            MessageDao.updateUploadStatus(messageToBeSent, MessageConstants.UPLOAD_FAILED);
        }
        return messageToBeSent;
    }

    buildMediaMessage(media){
        let text = 'Attachment';
        let newMessage           = new Message(text);
        newMessage.type          = MessageConstants.IMAGE_MEDIA;
        newMessage.mediaUrl      = media.uri;
        newMessage.mediaMimeType = 'image/jpeg';//media.mimeType;
        newMessage.mediaStatus   = '';
        return newMessage;
    }
}

export default new MediaService();