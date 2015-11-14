import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNFileManager;
    }

    async uploadFile(filePath, messageId){
        try{
            let signedUrl = await this.getSignedUrl();
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
            let RNMediaPicker = NativeModules.RNMediaPicker;
            let response = await RNMediaPicker.uploadMedia(filePath, signedUrl, messageId);
            console.log("upload response is "+ response);
            debugAsyncObject(response);
        }catch(err){
            console.log("upload errored out "+ err);
        }
    }

    getSignedUrl(){
        var options = {
            method: 'GET'
        };

        return fetch('http://localhost:3000/attachments', options)
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