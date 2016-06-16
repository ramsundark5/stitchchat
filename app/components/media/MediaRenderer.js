import React, {Component, PropTypes} from 'react';
import {View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import * as MessageConstants from '../../constants/AppConstants.js';
import MediaUtility from '../../modules/MediaUtility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MediaProgressIndicator from './MediaProgressIndicator';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as Status from '../../constants/AppConstants';

class MediaRenderer extends Component{

    shouldComponentUpdate(nextProps, nextState) {
        let urlChanged = this.props.media.mediaUrl !== nextProps.media.mediaUrl;
        let statusChanged = this.props.media.mediaStatus !== nextProps.media.mediaStatus;
        return urlChanged || statusChanged;
    }

    componentDidMount(){
        if(this.props.media && this.props.media.mediaStatus != (Status.DOWNLOAD_COMPLETED || Status.UPLOAD_COMPLETED)){
            this.fileDownloadListener = RCTDeviceEventEmitter.addListener('fileDownloadCompleted', this.onFileDownloadCompleted.bind(this));
        }
    }

    componentWillUnmount(){
        if(this.fileDownloadListener){
            this.fileDownloadListener.remove();
        }
    }

    onFileDownloadCompleted(response){
        if(response.messageId == this.props.media.id){
            console.log('media url is');
            this.props.media.mediaUrl = response.mediaUrl;
            this.forceUpdate();
            this.fileDownloadListener.remove();
        }
    }

    renderMedia(media) {

        switch (media.type) {
            case MessageConstants.IMAGE_MEDIA:
                return this.renderImage(media);
            case MessageConstants.VIDEO_MEDIA:
                return this.renderVideo(media);
            default:
                console.log('rendering empty view');
                return(
                    <View></View>
                );
        }
    }

    renderImage(media){
        let imageStyle = this.props.mediaStyle || styles.image;
        return(
            <Image style={imageStyle}
                   resizeMode={this.props.resizeMode}
                   source={{uri: media.mediaUrl}}>
                {this.renderProgressBar(media)}
            </Image>
        );
    }

     renderVideo(media){
        let videoUrl = media.mediaUrl;
        if(!videoUrl){
             return null;
        }
        console.log('video url is '+videoUrl);
        let videoStyle = this.props.mediaStyle || styles.image;
        if(videoUrl.startsWith("ph://")){
            //this will invoke the custom image loader in ios
            videoUrl = "v"+videoUrl;
        }else{
            //this will invoke the custom image loader in ios
            videoUrl = "vuri://"+videoUrl;
        }
         return(
             <Image
                 style={videoStyle}
                 resizeMode={this.props.resizeMode}
                 source={{ uri: videoUrl }}>
                 {this.renderPlayVideoIcon(media)}
                 {this.renderProgressBar(media)}
             </Image>
         );

    }

    renderPlayVideoIcon(media){
        if(this.props.playVideoOnPress){
            return(
                <TouchableHighlight onPress={() => this.openVideoViewer(media)}>
                    <Icon name='play-circle-outline'
                          style={[styles.playIcon]}/>
                </TouchableHighlight>
            );
        }else{
            return(
                <View style={{backgroundColor: 'transparent'}}>
                    <Icon name='play-circle-outline'
                          style={[styles.playIcon]}/>
                </View>
            );
        }

    }

    renderProgressBar(media){
        if(media.id){
            return(
                <MediaProgressIndicator media={media} />
            );
        }
        return null;
    }

    openVideoViewer(media){
        MediaUtility.playVideo(media.mediaUrl);
    }

    render(){
        const {media, mediaContainerStyle} = this.props;
        //console.log('media style '+this.props.mediaStyle);
        return (
            <View  style={mediaContainerStyle}>
                {this.renderMedia(media)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    playIcon:{
        fontSize: 70,
        color:'#ffffff',
        textAlign: 'center',
        marginBottom: 10,
    }
});

MediaRenderer.propTypes = {
    router: PropTypes.object.isRequired,
    mediaStyle: PropTypes.object,
    mediaContainerStyle: PropTypes.object,
    resizeMode: PropTypes.object,
    playVideoOnPress: PropTypes.bool,
};

export default MediaRenderer;