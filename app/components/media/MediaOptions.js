import React, { Component, View, TextInput, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeModules} from 'react-native';
import FileUploadService from '../../services/FileUploadService';

class MediaOptions extends Component {
    constructor(props, context) {
        super(props, context);
    }

    async openMediaGallery(){
        //this.props.router.toMediaGalleryView();
        let RNMediaPicker = NativeModules.RNMediaPicker;
        let selectedMedias = await RNMediaPicker.showMediaPicker();
        if(!selectedMedias){
            return;
        }
        debugAsyncObject(selectedMedias);
        for(let i = 0; i<selectedMedias.length; i++ ){
            FileUploadService.uploadFile(selectedMedias[i].localIdentifier);
            //console.log("upload completed with response "+uploadResponse);
        }
    }

    render() {
        return (
            <View>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={this.openMediaGallery.bind(this)}>
                    <Icon name='android-send'
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
