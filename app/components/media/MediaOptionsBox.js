import React, { Component, Animated, Easing, TextInput, TouchableOpacity, PropTypes, ImagePickerIOS } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {mediaStyle} from './MediaStyles';
import {NativeModules} from 'react-native';
import FileUploadService from '../../services/FileUploadService';
import MediaService from '../../services/MediaService';
var { createAnimatableComponent, View } = require('react-native-animatable');

class MediaOptionsBox extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        console.log('making sure box component is not loaded multiple times');
    }

    async openMediaGallery(){
        let RNMediaPicker = NativeModules.RNMediaPicker;
        let selectedMedias = await RNMediaPicker.showMediaPicker();
        if(!selectedMedias){
            return;
        }
        debugAsyncObject(selectedMedias);
        MediaService.addSelectedMedias(selectedMedias);
        this.props.hideMediaOptions();
    }

    openCamera(){
        ImagePickerIOS.openCameraDialog(null, this.callback, this.callback);
    }

    callback(){
        console.log('callback invoked');
    }

    render() {
        const { animation, duration, delay, router } = this.props;

        return (
            <View animation={animation} duration={duration} delay={delay}
                  style={[ mediaStyle.optionsModal, commons.horizontalNoWrap]} >
                <View style={[mediaStyle.optionsIconContainer, {backgroundColor: 'blue'}]}>
                    <TouchableOpacity onPress={this.openMediaGallery.bind(this)}>
                        <Icon name='images'
                              style={[mediaStyle.optionIcon, {color: 'white'}]}/>
                    </TouchableOpacity>
                </View>
                <View style={[mediaStyle.optionsIconContainer, {backgroundColor: 'red'}]}>
                    <TouchableOpacity onPress={this.openMediaGallery.bind(this)}>
                        <Icon name='android-camera'
                              style={mediaStyle.optionIcon}/>
                    </TouchableOpacity>
                </View>
                <View style={[mediaStyle.optionsIconContainer, {backgroundColor: 'green'}]}>
                    <TouchableOpacity onPress={this.openMediaGallery.bind(this)}>
                        <Icon name='ios-plus-empty'
                              style={mediaStyle.optionIcon}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

MediaOptionsBox.propTypes = {
    hideMediaOptions: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    animation: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
};
export default MediaOptionsBox;
