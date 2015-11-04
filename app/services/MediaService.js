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
        let newMessage      = this.buildMediaMessage(media);
        let messageToBeSent = await MessageService.addMessage(newMessage);
        try{
            let uploadResponse  = await FileUploadService.uploadFile(media.uri);
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
        newMessage.mediaUrl      = media.mediaUrl;
        newMessage.mediaMimeType = media.mimeType;
        newMessage.mediaStatus   = '';
        //newMessage.type =
        return newMessage;
    }
}

module.exports = new MediaService();