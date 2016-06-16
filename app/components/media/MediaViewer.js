import React, {Component, PropTypes} from 'react';
import {View, Text, ListView, StyleSheet, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import { Dimensions } from 'react-native';
import {InteractionManager} from 'react-native';
import MediaViewHeader from './MediaViewHeader';
import MessageDao from '../../dao/MessageDao';
import LoadingSpinner from '../common/LoadingSpinner';
import MediaRenderer from './MediaRenderer';
import ImageCarousell from './ImageCarousell';

class MediaViewer extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {mediasForThread: [], index: 0, isLoading: true};
    }

    componentDidMount(){
        let threadId = this.props.threadId;
        let selectedMedia  = this.props.selectedMedia;
        InteractionManager.runAfterInteractions(() => {
            this.openGalleryForThread(threadId, selectedMedia);
        });
    }

    openGalleryForThread(threadId, selectedMedia){
        let mediaResult = MessageDao.getMediasForThread(threadId, selectedMedia);
        this.setState({
            mediasForThread: mediaResult.mediasForThread,
            index: mediaResult.selectedMediaIndex,
            isLoading: false
        });
    }

    render() {
        let imageDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        imageDS = imageDS.cloneWithRows(this.state.mediasForThread);

        if(this.state.isLoading){
            return(
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size="large"/>
                </View>
            );
        }
        else{
            return (
                <View>
                    <ImageCarousell
                        dataSource={imageDS}
                        initialIndex={this.state.index}
                        renderRow={(rowData, sectionID, rowID) => this.renderMedia(rowData, sectionID, rowID)}
                        renderPagination={(index, total, context)=>this.renderPagination(index, total, context)}
                    />
                </View>
            );
        }
    }

    renderPagination (index, total, context) {
        let activeMediaUrl = null;
        if(this.state.mediasForThread && this.state.mediasForThread.length >= index){
            activeMediaUrl = this.state.mediasForThread[index];
        }

        return(
            <MediaViewHeader router={this.props.router}
                             total={total}
                             currentIndex={index}
                             threadId={this.props.threadId}
                             activeMediaUrl={activeMediaUrl}/>
        );
    }

    renderMedia(rowData, sectionID, rowID) {
        console.log("mediatype is "+rowData.type);
        return(
            <MediaRenderer media={rowData}
                           router={this.props.router}
                           threadId={this.props.threadId}
                           playVideoOnPress={true}
                           mediaContainerStyle={styles.slide}
                           resizeMode="contain"/>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        justifyContent: 'center',
        backgroundColor: 'black',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
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

MediaViewer.propTypes = {
    threadId: PropTypes.number.isRequired,
    selectedMedia: PropTypes.object,
    router: PropTypes.object.isRequired
};

export default MediaViewer;
