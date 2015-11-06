import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNFileManager;
    }

    async uploadFile(filePath){
        try{
            let signedUrl = await this.getSignedUrl();
            let fileName  = 'file1.jpg';
            console.log("signed url is: "+ signedUrl);
            if(signedUrl){
                this.uploadFileInternal(signedUrl, filePath, fileName);
            }
        }catch(err){
            console.log("Error uploading media "+ err);
        }
    }

    async uploadFileInternal(signedUrl, filePath, fileName){
        try{
            let response = await this.fileManager.uploadFile(filePath, fileName, signedUrl);
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