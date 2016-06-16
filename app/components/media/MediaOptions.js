import React, {Component, PropTypes} from 'react';
import {Animated, Easing, ActionSheetIOS, TouchableHighlight, Platform, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeModules} from 'react-native';
import {Theme} from '../common/Themes';
import MediaService from '../../services/MediaService';
var { View } = require('react-native-animatable');
var ImagePickerManager = require('NativeModules').ImagePickerManager;
import * as AppConstants from '../../constants/AppConstants';

class MediaOptions extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        console.log('making sure this component is not loaded multiple times');
    }

    async openMediaGallery() {
        try {
            let RNMediaPicker = NativeModules.RNMediaPicker;
            let selectedMedias = await RNMediaPicker.showMediaPicker();
            if (!selectedMedias) {
                return;
            }
            debugAsyncObject(selectedMedias);
            MediaService.addSelectedMedias(selectedMedias);
            this.props.hideMediaOptions();
        } catch (err) {
            console.log("error opening media gallery");
        }

    }

    openCamera(captureVideo = false) {
        let options = {
            noData: true,
            storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
                skipBackup: true, // ios only - image will NOT be backed up to icloud
                path: 'images' // ios only - will save image at /Documents/images rather than the root
            }
        };

        if(captureVideo){
            options.mediaType = 'video';
            options.videoQuality = 'medium';
        }
        //ImagePickerIOS.openCameraDialog(null, this.onImageCaptureSuccess, this.onImageCaptureFailure);
        try{
            ImagePickerManager.launchCamera(options, (response)  => {
                if (response.error) {
                    console.log('ImagePickerManager Error: ', response.error);
                }else{
                    let mediaObj = {};
                    mediaObj.mediaUrl = response.uri;
                    if(Platform.OS == 'ios'){
                        mediaObj.mediaUrl = response.uri.replace('file://', '');
                    }
                    mediaObj.mediaType = AppConstants.IMAGE_MEDIA;
                    mediaObj.mimeType = 'image/jpeg';
                    if(captureVideo){
                        mediaObj.mediaType = AppConstants.VIDEO_MEDIA;
                        mediaObj.mimeType = 'video/quicktime';
                    }
                    console.log('filename is '+response.fileName);
                    console.log('imageUri is '+response.uri);
                    MediaService.addSelectedMedias([mediaObj]);
                    this.props.hideMediaOptions();
                }

            });
        }catch(err){
            console.log('error capturing image '+err);
        }

    }

    onImageCaptureSuccess(imageUri){
        console.log('imageUri is '+imageUri);
    }

    onImageCaptureFailure(){
        console.log('user cancelled the camera');
    }
    
    handleOptionsSelect(selectedOption) {
        switch (selectedOption){
            case 'Gallery':
                return this.openMediaGallery();
            case 'Camera':
                return this.openCamera();
            case 'Video':
                return this.openCamera(true);
            default:
                return;
        }
        console.log('selectedOption is ' + selectedOption);
    }

    _showMediaOptionsBoxIos(isMediaOptionsVisible, hideMediaOptions, router) {
        let OPTIONS = [
            'Gallery',
            'Camera',
            'Video',
            'GIF',
            'Cancel'
        ];

        ActionSheetIOS.showActionSheetWithOptions({
                options: OPTIONS,
                cancelButtonIndex: 4
            },
            (buttonIndex) => {
                this.handleOptionsSelect(OPTIONS[buttonIndex]);
            });
    }

    toggleShowMediaOptions(){
        /*if(this.props.isMediaOptionsVisible){
         this.props.hideMediaOptions();
         }else{
         this.props.showMediaOptions();
         }*/
        this._showMediaOptionsBoxIos();
    }

    render() {
        const { isMediaOptionsVisible, hideMediaOptions, router } = this.props;

        return (
            <View>
                <TouchableHighlight style={[styles.mediaOptionsContainer]}
                                    onPress={() => this.toggleShowMediaOptions()}>
                    <Icon name='md-add'
                          style={[styles.showOptionsIcon]}/>
                </TouchableHighlight>
            </View>
        );
    }

 /*   _showMediaOptionsBoxAndroid(isMediaOptionsVisible, hideMediaOptions, router){
        if(!isMediaOptionsVisible){
            //if coming for the first time, make sure the media options box remain hidden
            if(!this.refs.mboxRef){
                return;
            }else{
                return(
                    <MediaOptionsBox router={router} animation="fadeOutDownBig"
                                     duration={800} delay={200}
                                     hideMediaOptions={hideMediaOptions}/>
                );
            }

        }else{
            return(
                <MediaOptionsBox ref="mboxRef" router={router} animation="slideInUp"
                                 duration={200} delay={50}
                                 hideMediaOptions={hideMediaOptions}/>
            );
        }
    }*/

}

MediaOptions.propTypes = {
    isMediaOptionsVisible: PropTypes.bool.isRequired,
    showMediaOptions: PropTypes.func.isRequired,
    hideMediaOptions: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    mediaOptionsContainer:{
        paddingLeft: 10,
        paddingRight: 10,
    },
    showOptionsIcon: {
        padding: 2,
        fontWeight: 'bold',
        fontSize : 30,
        color: Theme.iconColor
    },
});

export default MediaOptions;
