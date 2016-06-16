import React, {Component, PropTypes} from 'react';
import {Animated, Easing, TextInput, TouchableOpacity, ImagePickerIOS, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {NativeModules} from 'react-native';
import MediaService from '../../services/MediaService';
import { View } from 'react-native-animatable';

class MediaOptionsBox extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        console.log('making sure box component is not loaded multiple times');
    }

    async openMediaGallery(){
        try{
            let RNMediaPicker = NativeModules.RNMediaPicker;
            let selectedMedias = await RNMediaPicker.showMediaPicker();
            if(!selectedMedias){
                return;
            }
            debugAsyncObject(selectedMedias);
            MediaService.addSelectedMedias(selectedMedias);
            this.props.hideMediaOptions();
        }catch(err){
            console.log("error opening media gallery");
        }

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
                  style={[ styles.optionsModal, styles.horizontalNoWrap]} >
                <View style={[styles.optionsIconContainer, {backgroundColor: '#3498db'}]}>
                    <TouchableOpacity onPress={() => this.openMediaGallery()}>
                        <Icon name='md-images'
                              style={[styles.optionIcon, {color: 'white'}]}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.optionsIconContainer, {backgroundColor: '#FF6F60'}]}>
                    <TouchableOpacity onPress={() => this.openMediaGallery()}>
                        <Icon name='md-camera'
                              style={styles.optionIcon}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.optionsIconContainer, {backgroundColor: '#1abc9c'}]}>
                    <TouchableOpacity onPress={() => this.openMediaGallery()}>
                        <Icon name='ios-plus-empty'
                              style={styles.optionIcon}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    horizontalNoWrap:{
        flexDirection : 'row',
        flexWrap      : 'nowrap'
    },
    optionsModal: {
        backgroundColor: 'transparent',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        position: 'absolute',
        width: 300,
        height: 80,
        bottom: 35,
    },
    optionsIconContainer:{
        margin: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionIcon:{
        color: 'white',
        fontSize: 35
    },
});

MediaOptionsBox.propTypes = {
    hideMediaOptions: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    animation: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    delay: PropTypes.number.isRequired,
};
export default MediaOptionsBox;
