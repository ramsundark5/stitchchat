import {NativeModules} from 'react-native';
const RNMediaPlayer = NativeModules.RNMediaPlayer;
const  MediaUtilityModule = NativeModules.MediaUtility;
import RNFS from 'react-native-fs';

class MediaUtility{

    getImageURLforVideo(url){
        url = this.removePrefixFromLocalMediaIdentifier(url);
        let imageURLPromise = MediaUtilityModule.getImageURLforVideo(url);
        return imageURLPromise;
    }

    async getURLForMediaID(mediaId){
        let mediaUrl = await MediaUtilityModule.getURLForMediaID(mediaId);
        return mediaUrl;
    }

    deleteMedia(mediaUrl){
        if(!mediaUrl){
            return;
        }
        if(mediaUrl.startsWith("ph://")){
            MediaUtilityModule.deleteMedia(mediaUrl);
        }else{
            RNFS.unlink(mediaUrl)
                // spread is a method offered by bluebird to allow for more than a
                // single return value of a promise. If you use `then`, you will receive
                // the values inside of an array
                .spread((success, mediaUrl) => {
                    console.log('FILE DELETED', success, mediaUrl);
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch((err) => {
                    console.log(err.message);
                });
        }
    }

    playVideo(mediaUrl){
        mediaUrl = this.removePrefixFromLocalMediaIdentifier(mediaUrl);
        RNMediaPlayer.open({uri: mediaUrl});
    }

    //remove the ph://prefix from media identifier
    removePrefixFromLocalMediaIdentifier(mediaUrlWithPrefix){
        if(!mediaUrlWithPrefix){
            return null;
        }
        let mediaUrl = mediaUrlWithPrefix;
        if(mediaUrlWithPrefix.startsWith("ph://")){
            mediaUrl = mediaUrlWithPrefix.substring(5);
        }
        return mediaUrl;
    }
}

export default new MediaUtility();