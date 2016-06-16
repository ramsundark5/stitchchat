import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import * as Status from '../../constants/AppConstants';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import * as Progress from 'react-native-progress';

export default class MediaProgressIndicator extends Component {

    constructor(props, context) {
        super(props, context);
        this.state={
            showIndicator: false,
            progress: 0
        }
    }

    componentDidMount(){
        if(this.shouldDisplayProgressIndicator(this.props.media)){
            const messageId = this.props.media.id;
            this.setState({showIndicator: true});
            //console.log("progress listener initialized for "+messageId);
            this.fileProgressListener = RCTDeviceEventEmitter.addListener('fileProgress'+messageId, this.onProgress.bind(this));
        }
    }

    componentWillUnmount(){
        if(this.fileProgressListener){
            this.fileProgressListener.remove();
        }
    }

    onProgress(progress){
        this.setState({progress: progress.fractionCompleted});
        if(progress.fractionCompleted >= 1){
            this.setState({showIndicator: false});
        }
    }

    shouldDisplayProgressIndicator(media){
        let showProgress = false;
        if(!media){
            return showProgress;
        }

        if(media.mediaStatus == Status.PENDING_UPLOAD || media.mediaStatus == Status.UPLOAD_IN_PROGRESS
        || media.mediaStatus == Status.PENDING_DOWNLOAD || media.mediaStatus == Status.DOWNLOAD_IN_PROGRESS){
            showProgress = true;
        }
        return showProgress;
    }
    render() {
        const {media} = this.props;
        const {progress, showIndicator} = this.state;
        if(showIndicator && this.shouldDisplayProgressIndicator(media)){
            return(
                <View style={styles.progressIndicator}>
                    <Progress.Circle size={70} showsText={true} progress={progress}/>
                </View>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
    progressIndicator:{
        marginBottom: 10,
        alignSelf: 'center',
    },
});

MediaProgressIndicator.propTypes = {
    media: PropTypes.object,
    fractionCompleted: PropTypes.object,
};

