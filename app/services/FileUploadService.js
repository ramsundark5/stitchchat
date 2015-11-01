import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNNetworkingManager;
    }

    async uploadFile(filePath){
        let options = {
            uploadUrl: 'http://127.0.0.1:3000',
            method: 'POST', // default 'POST',support 'POST' and 'PUT'
            headers: {
                'Accept': 'application/json',
            },
            fields: {
                'hello': 'world',
            },
            files: [
                {
                    filename: 'one.w4a', // require, file name
                    filepath: '/xxx/one.w4a', // require, file absoluete path
                    filetype: 'audio/x-m4a', // options, if none, will get mimetype from `filepath` extension
                },
            ]
        };

        let signedUrl = await this.getSignedUrl();
        console.log("signed url is: "+ signedUrl);
        if(signedUrl){
            this.uploadFileInternal(signedUrl, filePath);
        }

    }

    uploadFileInternal(signedUrl, filePath){
        this.fileManager.requestFile(signedUrl, {
            'method': 'POST',
            'data' : filePath
        }, function(results) {
            console.log(results);
        });
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

module.exports = new FileUploadService();