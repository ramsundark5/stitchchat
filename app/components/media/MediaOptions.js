import React, { Component, Animated, Easing, TextInput, TouchableHighlight, PropTypes, ImagePickerIOS } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import {mediaStyle} from './MediaStyles';
import {NativeModules} from 'react-native';
import FileUploadService from '../../services/FileUploadService';
import MediaService from '../../services/MediaService';
import MediaOptionsBox from './MediaOptionsBox';
var { createAnimatableComponent, View } = require('react-native-animatable');

class MediaOptions extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        console.log('making sure this component is not loaded multiple times');
    }

    render() {
        const { isMediaOptionsVisible, hideMediaOptions, router } = this.props;

        return (
            <View>
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={this.toggleShowMediaOptions.bind(this)}>
                    <Icon name='ios-plus-empty'
                          size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                          style={commons.defaultIcon}/>
                </TouchableHighlight>
                {this._showMediaOptionsBox(isMediaOptionsVisible, hideMediaOptions, router)}
            </View>
        );
    }

    _showMediaOptionsBox(isMediaOptionsVisible, hideMediaOptions, router){
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
                <MediaOptionsBox ref="mboxRef" router={router} animation="bounceInUp"
                                 duration={800} delay={200}
                                 hideMediaOptions={hideMediaOptions}/>
            );
        }
    }

    toggleShowMediaOptions(){
        if(this.props.isMediaOptionsVisible){
            this.props.hideMediaOptions();
        }else{
            this.props.showMediaOptions();
        }
    }
}

MediaOptions.propTypes = {
    isMediaOptionsVisible: PropTypes.bool.isRequired,
    showMediaOptions: PropTypes.func.isRequired,
    hideMediaOptions: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default MediaOptions;
