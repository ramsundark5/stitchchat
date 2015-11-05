import React, { Component, View, Text, TextInput, TouchableOpacity, PropTypes } from 'react-native';
import styles from '../navbar/styles';
import { connect } from 'react-redux/native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {mediaStyle} from './MediaStyles';
import MediaService from '../../services/MediaService';

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

    getTitleElement(title) {
        return (
            <Text
                style={[styles.navBarTitleText, ]}>
                {title}
            </Text>
        );
    }

    getLeftButtonElement(title) {
        return (
            <TouchableOpacity onPress={() => this.goBackToPrevPage()}>
                <View style={styles.navBarButton}>
                    <Text style={[styles.navBarButtonText ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    getRightButtonElement(title) {
        return (
            <TouchableOpacity onPress={() => this.onFinishMediaSelection()}>
                <View style={styles.navBarButton}>
                    <Text style={[styles.navBarButtonText ]}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render(){
        return (
            <View style={[styles.navBarContainer]}>
                <View style={[styles.navBar, this.props.style, ]}>
                    {this.getTitleElement('Gallery')}
                    {this.getLeftButtonElement('Cancel', { marginLeft: 8, })}
                    {this.getRightButtonElement('Next', { marginRight: 8, })}
                </View>
            </View>
        );
    }
}

MediaGalleryHeader.propTypes = {
    router: PropTypes.object.isRequired,
    selectedMedias: PropTypes.array.isRequired
};

export default MediaGalleryHeader;