import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import MediaService from '../../services/MediaService';
import NavigationBar from '../navbar/NavigationBar';

class MediaGalleryHeader extends Component{

    constructor(props, context) {
        super(props, context);
    }

    goBackToPrevPage(){
        this.props.router.pop();
    }

    onFinishMediaSelection(){
        this.props.router.pop();
        let selectedMedias = this.props.selectedMedias;
        MediaService.addSelectedMedias(selectedMedias);
    }

    render(){
        return (
            <NavigationBar
                title={{ title: 'Gallery', }}
                leftButton={{ title: 'Cancel', handler: () => this.goBackToPrevPage()}}
                rightButton={{ title: 'Next', handler: () => this.onFinishMediaSelection()}} />
        );
    }
}

MediaGalleryHeader.propTypes = {
    router: PropTypes.object.isRequired,
    selectedMedias: PropTypes.array.isRequired
};

export default MediaGalleryHeader;