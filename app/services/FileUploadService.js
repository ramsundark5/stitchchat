import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNFileManager;
    }

    async uploadFile(filePath, messageId, extension){
        try{
            let signedUrl = await this.getSignedUrl(extension);
            console.log("signed url is: "+ signedUrl);
            if(signedUrl){
                this.uploadFileInternal(signedUrl, filePath, messageId);
            }
        }catch(err){
            console.log("Error uploading media "+ err);
        }
    }

    async uploadFileInternal(signedUrl, filePath, messageId){
        try{
            let response = await this.fileManager.uploadMedia(filePath, signedUrl, messageId);
            console.log("upload response is "+ response);
            debugAsyncObject(response);
        }catch(err){
            console.log("upload errored out "+ err);
        }
    }

    getSignedUrl(extension){
        var options = {
            method: 'GET'
        };

        var url = 'http://localhost:3000/attachments'+'?ext='+extension;
        return fetch(url, options)
            .then((response) => response.json())
            .then((jsonData) => {
                let signedUrl = jsonData.url;
                return signedUrl;
            }).catch((error) => {
                console.log('Error getting signed url: '+ error);
                return null;
            });
    }

}

export default new FileUploadService();
//export default new FileUploadService();