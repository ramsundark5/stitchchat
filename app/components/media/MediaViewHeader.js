import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet, ActionSheetIOS, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Theme} from '../common/Themes';
import MediaUtility from '../../modules/MediaUtility';
import MessageService from '../../services/MessageService';

class MediaViewHeader extends Component{

    goBackToPrevPage(){
        this.props.router.pop();
    }

    handleGridDisplay(){
        this.props.router.toGalleryViewFromMediaViewer({threadId: this.props.threadId});
    }

    handleForward(){
        let activeMediaUrl = this.props.activeMediaUrl;
        if(activeMediaUrl){

        }
    }

    async handleShare(){
        let activeMediaUrl = this.props.activeMediaUrl;
        if(activeMediaUrl){
            let mediaUrl = activeMediaUrl.mediaUrl;
            if(mediaUrl && mediaUrl.startsWith("ph://")){
                let mediaUrlWithoutPrefix = MediaUtility.removePrefixFromLocalMediaIdentifier(mediaUrl);
                mediaUrl = await MediaUtility.getURLForMediaID(mediaUrlWithoutPrefix);
            }
            ActionSheetIOS.showShareActionSheetWithOptions({
                    url: mediaUrl,
                },
                (error) => console.log(error),
                (success, method) => {
                    var text;
                    if (success) {
                        text = `Shared via ${method}`;
                    } else {
                        text = 'You didn\'t share';
                    }
                    console.log(text);
                });
        }
    }

     handleDelete(){
        let activeMediaUrl = this.props.activeMediaUrl;
        if(activeMediaUrl){
            MessageService.deleteMessage(activeMediaUrl);
        }
    }

    render(){
        const { currentIndex, total } = this.props;

        return (
            <View style={[styles.paginationContainer]}>
                <View style={[styles.paginationBar]}>
                    <TouchableHighlight onPress={() => this.goBackToPrevPage()}>
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableHighlight>
                    <Text style={styles.paginationText}>
                        <Text>
                            {currentIndex + 1}
                        </Text>
                        /{total}
                    </Text>
                    <TouchableHighlight onPress={() => this.handleGridDisplay()}>
                        <Icon name='md-apps'
                              style={styles.paginationIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.handleForward()}>
                        <Icon name='md-share-alt'
                              style={styles.paginationIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.handleShare()}>
                        <Icon name='md-share'
                              style={styles.paginationIcon}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.handleDelete()}>
                        <Icon name='ios-trash'
                              style={styles.paginationIcon}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    paginationContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'black',
        height: 50,
        justifyContent: 'center',
    },
    paginationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 16,
    },
    paginationText:{
        alignSelf: 'center',
        color: Theme.iconColor,
        fontSize: 16,
    },
    closeText:{
        alignSelf: 'center',
        color: Theme.iconColor,
        fontSize: 16,
        paddingTop: 6
    },
    paginationIcon:{
        padding: 3,
        fontSize : 22,
        color: Theme.iconColor
    }
});

MediaViewHeader.propTypes = {
    currentIndex: PropTypes.number.isRequired,
    threadId: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    activeMediaUrl: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    router: PropTypes.object.isRequired
};

export default MediaViewHeader;