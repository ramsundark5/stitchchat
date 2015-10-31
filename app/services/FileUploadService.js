import {NativeModules} from 'react-native';

class FileUploadService{

    constructor(){
        this.fileManager = NativeModules.RNNetworkingManager;
    }

    uploadFile(fileList){
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
    }

}

export default FileUploadService;