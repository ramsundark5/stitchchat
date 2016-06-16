import MessageService from './MessageService';
import store from '../config/ConfigureStore';
import Message from '../models/Message';
import * as MessageConstants from '../constants/AppConstants';
import FileUploadService from './FileUploadService';

class MediaService{

    async addSelectedMedias(selectedMedias){
        if(!selectedMedias || selectedMedias.length <= 0){
            return;
        }
        for(let i = 0; i<selectedMedias.length; i++ ){
            this.uploadMedia(selectedMedias[i]);
        }
    }

    uploadMedia(media){
        let currentThreadState = store.getState().threadState;
        let currentThread      = currentThreadState.currentThread;
        let newMessage      = this.buildMediaMessage(media, true);
        let messageToBeSent = MessageService.addMessage(currentThread, newMessage);
        if(!media.extension){
            media.extension = "jpg";
            if(media.type == MessageConstants.VIDEO_MEDIA){
                media.extension = "mov";
            }
        }
        try{
            FileUploadService.uploadFile(messageToBeSent, media.extension);
        }catch(err){
            console.log("error uploading media "+ err);
        }
    }

    buildMediaMessage(media, isOutgoing){
        let text = 'Attachment';
        let newMessage           = new Message(text);
        newMessage.type          = media.mediaType || MessageConstants.IMAGE_MEDIA;
        if(isOutgoing){
            //hack for photo kit library
            if(media.localIdentifier && media.localIdentifier.length > 1){
                newMessage.mediaUrl  = 'ph://'+media.localIdentifier;
            }else{
                newMessage.mediaUrl  = media.mediaUrl;
            }
        }else{
            newMessage.mediaUrl  = media.uri;
        }
        console.log('mediaUrl is '+ newMessage.mediaUrl);
        console.log('media mimeType is '+ media.mimeType);
        newMessage.mediaMimeType = media.mimeType || 'image/jpeg';
        newMessage.mediaStatus   = MessageConstants.PENDING_UPLOAD;
        return newMessage;
    }
}

export default new MediaService();