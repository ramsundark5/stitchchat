import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {messageStyle} from './MessageStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Status from '../../constants/MessageConstants';
import MessageService from '../../services/MessageService';

class MessageItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    selectMessage(message) {
        this.props.selectMessage(message.id);
    }

    selectMessageOnlyInEditingMode(message){
        MessageService.sendMessage('1111', message);
        if(this.props.isEditing){
            this.selectMessage(message);
        }
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
        const {message} = this.props;
        let msgItemStyle = message.owner? messageStyle.msgItemSender : messageStyle.msgItemReceiver;
        let msgTextStyle = message.owner? messageStyle.msgSentText : messageStyle.msgReceivedText;
        let msgAlign     = message.owner? commons.pullRight : commons.pullLeft;
        let messageBgColor = message.selected ? messageStyle.msgSelected : messageStyle.msgUnselected;
        return (
            <TouchableHighlight style={[messageStyle.msgItemContainer, msgAlign, messageBgColor]}
                                onPress = {() => this.selectMessageOnlyInEditingMode(message)}
                                onLongPress={() => this.selectMessage(message)}>
                <View style={[messageStyle.msgItem, msgItemStyle]}>
                    <Text style={msgTextStyle}>
                        {message.message}
                    </Text>
                    {this._renderStatusIcon(message)}
                </View>
            </TouchableHighlight>
        );
    }

    _renderStatusIcon(message){
        let statusIcon   = this.getStatusIcon(message.state);
        <View style={[commons.horizontalNoWrap, commons.pullRight]}>
            <Text style={commons.smallText}>sent</Text>
            <Icon name={statusIcon}
                  style={commons.smallIcon}/>
        </View>
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired
};

export default MessageItem;
