import React, { Component, Animated, Easing, TextInput, TouchableHighlight, PropTypes, ImagePickerIOS } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {mediaStyle} from './MediaStyles';
import {NativeModules} from 'react-native';
import FileUploadService from '../../services/FileUploadService';
import MediaService from '../../services/MediaService';
var { createAnimatableComponent, View } = require('react-native-animatable');

class MediaOptions extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            fadeAnim: new Animated.Value(0), // opacity 0
        };
    }

    componentDidMount() {
        Animated.timing(       // Uses easing functions
            this.state.fadeAnim, // The value to drive
            {
                toValue: 1,        // Target
                duration: 2000,    // Configuration
            }
        ).start();             // Don't forget start!
    }

    async openMediaGallery(){
        //this.props.router.toMediaGalleryView();
        let RNMediaPicker = NativeModules.RNMediaPicker;
        let selectedMedias = await RNMediaPicker.showMediaPicker();
        if(!selectedMedias){
            return;
        }
        debugAsyncObject(selectedMedias);
        /*for(let i = 0; i<selectedMedias.length; i++ ){
            FileUploadService.uploadFile(selectedMedias[i].localIdentifier);
            //console.log("upload completed with response "+uploadResponse);
        }*/
        MediaService.addSelectedMedias(selectedMedias);
    }

    openCamera(){
        ImagePickerIOS.openCameraDialog(null, this.callback, this.callback);
    }
    callback(){
        console.log('callback invoked');
    }
    render() {
        return (
            <View animation="bounceInUp" duration={800} delay={100} style={[{
                opacity: this.state.fadeAnim,  // Binds
              }, mediaStyle.optionsModal]} >
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={this.openMediaGallery.bind(this)}>
                    <Icon name='ios-plus-empty'
                          size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
            </View>
        );
    }
}

MediaOptions.propTypes = {
};

export default MediaOptions;
