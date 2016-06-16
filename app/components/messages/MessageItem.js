import React, {Component, PropTypes} from 'react';
import {View, Text, Image, TouchableHighlight, StyleSheet} from 'react-native';
import * as MessageConstants from '../../constants/AppConstants.js';
import {Theme} from '../common/Themes';
import MessageTextItem from './MessageTextItem';
import MediaRenderer from '../media/MediaRenderer';
import MessageStatusIcon from './MessageStatusIcon';

class MessageItem extends Component {

    selectMessage(message) {
        this.props.selectMessage(message.id);
    }

    selectMessageOnlyInEditingMode(message){
        this.props.selectMessageOnlyInEditingMode(message);
    }

    render() {
        const {message, router} = this.props;
        let msgAlign     = message.isOwner? styles.pullRight : styles.pullLeft;
        let messageBgColor = message.selected ? styles.msgSelected : styles.msgUnselected;
        return (
            <View style={messageBgColor}>
                <TouchableHighlight style={[styles.msgItemContainer, msgAlign]}
                                    onPress = {() => this.selectMessageOnlyInEditingMode(message)}
                                    onLongPress={() => this.selectMessage(message)}>
                    <View>
                        {this._renderMessageItem(message, router)}
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderMessageItem(message, router){
        switch (message.type) {
            case MessageConstants.PLAIN_TEXT:
                return(
                    <MessageTextItem message={message} router={router} style={this.props.style}/>
                );
            case MessageConstants.IMAGE_MEDIA:
            case MessageConstants.VIDEO_MEDIA:
                return(
                    <TouchableHighlight onPress={() => this.openMediaViewer(message)}
                                        onLongPress={() => this.selectMessage(message)}>
                        <View style={[styles.msgItem, this.props.style]}>
                            <MediaRenderer media={message}
                                           router={router}
                                           threadId={message.threadId}
                                           mediaViewerEnabled={true}
                                           mediaStyle={styles.image}/>
                            <MessageStatusIcon message={message}/>
                        </View>
                    </TouchableHighlight>
                );
            default:
                return(
                    <View></View>
                );
        }
    }

    openMediaViewer(message){
        let isEditingMode = this.props.selectMessageOnlyInEditingMode(message);
        if(!isEditingMode){
            this.props.router.toMediaViewer({selectedMedia: message, threadId: message.threadId});
        }
    }
}

const styles = StyleSheet.create({
    pullRight:{
        alignSelf: 'flex-end',
    },
    pullLeft:{
        alignSelf: 'flex-start',
    },
    msgItemContainer: {
        //flex: 1,
        //flexDirection: 'column',
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        margin: 10,
        justifyContent: 'center',
    },
    msgItem: {
        paddingTop: 8,
        //flexDirection: 'column',
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 15,
    },
    msgSelected: {
        backgroundColor: Theme.selectedColor,
    },
    msgUnselected: {
        backgroundColor: 'transparent',
    },
});

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired,
    selectMessageOnlyInEditingMode: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

export default MessageItem;
