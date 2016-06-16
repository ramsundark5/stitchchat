import React, {Component, PropTypes} from 'react';
import {View, ListView, Image, CameraRoll, TouchableHighlight, StyleSheet} from 'react-native';
import MessageDao from '../../dao/MessageDao';
import LoadingSpinner from '../common/LoadingSpinner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MediaRenderer from './MediaRenderer';
import {InteractionManager} from 'react-native';
import { Dimensions } from 'react-native';

class MediaGallery extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {mediasForThread: [], isLoading: true};
    }

    componentDidMount(){
        let threadId = this.props.threadId;
        InteractionManager.runAfterInteractions(() => {
            requestAnimationFrame(() => {
                this.openGalleryForThread(threadId);
            });
        });
    }

    reloadMedia(){
        let threadId = this.props.threadId;
        this.openGalleryForThread(threadId);
    }

    openGalleryForThread(threadId){
        let mediaResult = MessageDao.getMediasForThread(threadId);
        this.setState({
            mediasForThread: mediaResult.mediasForThread,
            isLoading: false
        });
    }

    render() {
        const {router} = this.props;
        let imagesDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2});

        //let lotOfImages = [];
        //const images = this.state.mediasForThread;
        //lotOfImages = lotOfImages.concat(images, images, images);
        //imagesDS = imagesDS.cloneWithRows(lotOfImages);
        imagesDS = imagesDS.cloneWithRows(this.state.mediasForThread);

        if(this.state.isLoading){
            return(
                <View style={[styles.loadingContainer]}>
                    <LoadingSpinner size="large"/>
                </View>
            );
        }
        else{
            return (
                <View style={[styles.container]}>
                    <ListView contentContainerStyle={styles.imageGrid}
                              enableEmptySections={true}
                              dataSource={imagesDS}
                              renderRow={(media) => this.renderMedia(media)}
                              initialListSize={15}
                              scrollRenderAheadDistance={500}
                              pagingEnabled={true}
                              pageSize={1}
                              removeClippedSubviews={true} />
                </View>
            );
        }
    }

    renderMedia(media){
        return(
            <TouchableHighlight onPress={() => this.openMediaViewer(media)}>
                <View>
                    <MediaRenderer media={media}
                                   router={this.props.router}
                                   threadId={this.props.threadId}
                                   mediaViewerEnabled={true}
                                   mediaStyle={styles.image}/>
                </View>
            </TouchableHighlight>
        );
    }

    openMediaViewer(media){
        this.props.router.toMediaViewer({selectedMedia: media, threadId: this.props.threadId});
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        paddingBottom: 10
    },
    loadingContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
    },
    image: {
        width: 100,
        height: 100,
        margin: 2,
        justifyContent: 'center',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 50
    },
});

MediaRenderer.propTypes = {
    router: PropTypes.object.isRequired,
    threadId: PropTypes.number.isRequired,
};
export default MediaGallery;