import React, { Component, View, TextInput, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeModules} from 'react-native';

class MediaOptions extends Component {
    constructor(props, context) {
        super(props, context);
    }

    openMediaGallery(){
        //this.props.router.toMediaGalleryView();
        let RNMediaPicker = NativeModules.RNMediaPicker;
        RNMediaPicker.showMediaPicker();
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
