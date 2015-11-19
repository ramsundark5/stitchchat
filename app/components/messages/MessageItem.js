import React, { Component, View, Text, PropTypes, Image, TouchableHighlight } from 'react-native';
import * as MessageConstants from '../../constants/MessageConstants.js';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {messageStyle} from './MessageStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Status from '../../constants/MessageConstants';
import moment from 'moment';

class MessageItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    selectMessage(message) {
        this.props.selectMessage(message.id);
    }

    selectMessageOnlyInEditingMode(message){
        if(this.props.isEditing){
            this.selectMessage(message);
        }
    }

    openImageViewer(message){
        //this.props.router.toImageViewer(message);
    }

    getStatusIcon(msgStatus){
        let statusIconName = 'load-c';
        if(msgStatus === Status.STATUS_SENT){
            statusIconName = 'android-done';
        }
        else if(msgStatus === Status.STATUS_RECEIVED){
            statusIconName = 'android-done-all';
        }
        return statusIconName;
    }
    render() {
        const {message, router} = this.props;
        let msgAlign     = message.owner? commons.pullRight : commons.pullLeft;
        let messageBgColor = message.selected ? messageStyle.msgSelected : messageStyle.msgUnselected;
        return (
            <TouchableHighlight style={[messageStyle.msgItemContainer, msgAlign, messageBgColor]}
                                onPress = {() => this.selectMessageOnlyInEditingMode(message)}
                                onLongPress={() => this.selectMessage(message)}>
                <View>
                    {this._renderTextMessage(message)}
                    {this._renderMediaMessage(message, router)}
                </View>
            </TouchableHighlight>
        );
    }

    _renderTextMessage(message){
        if(message.type !=  MessageConstants.PLAIN_TEXT){
            return;
        }
        let msgItemStyle = message.owner? messageStyle.msgItemSender : messageStyle.msgItemReceiver;
        let msgTextStyle = message.owner? messageStyle.msgSentText : messageStyle.msgReceivedText;
        return(
            <View style={[messageStyle.msgItem, msgItemStyle]}>
                <Text style={msgTextStyle}>
                    {message.message}
                </Text>
                {this._renderStatusIcon(message)}
            </View>
        );
    }

    _renderMediaMessage(message){
        if(message.type !=  MessageConstants.IMAGE_MEDIA){
            return;
        }
        return(
            <TouchableHighlight onPress={() => this.openImageViewer(message)}>
                <View style={[messageStyle.msgItem, messageStyle.imageContainer]}>
                    <Image
                        style={messageStyle.image}
                        source={{ uri: message.mediaUrl }}/>
                    {this._renderStatusIcon(message)}
                </View>
            </TouchableHighlight>
        );
    }

    _renderStatusIcon(message){
        let statusIcon   = this.getStatusIcon(message.state);
        let statusTime   = moment(message.timestamp).format("hh:mm a");
        return(
            <View style={[commons.horizontalNoWrap, commons.pullRight]}>
                <Text style={commons.smallText}>{statusTime}</Text>
                <Icon name={statusIcon}
                      style={commons.smallIcon}/>
            </View>
        );
    }

}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

export default MessageItem;
