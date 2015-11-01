import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNNetworkingManager;
    }

    uploadFile(filePath){
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

        /*FileUpload.upload(options, function(err, result) {
            console.log('upload:', err, result);
        });*/
        let getSignedUrl = '';
        fetch
       /* this.fileManager.requestFile(url, {
            'method': 'POST',
            'data' : filePath
        }, function(results) {
            console.log(results);
        });*/
    }

    getSignedUrl(){
        var options = {
            method: 'GET'
        };

        fetch('http://localhost:3000/attachment', options)
            .then((response) => response.json())
            .then((jsonData) => {
                let signedUrl = jsonData.url;
                return signedUrl;
            }).catch((error) => {
                console.log('auth failed'+ error);
                return null;
            })
    }

}

module.exports = new FileUploadService();