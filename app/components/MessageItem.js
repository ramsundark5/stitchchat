import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/Styles';
import {messageStyle} from '../styles/MessageStyle';
import { Icon } from 'react-native-icons';
import * as Status from '../constants/MessageConstants.js';

class MessageItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    selectMessage(id) {
        this.props.selectAndSetEditingMode(id);
    }

    selectMessageOnlyInEditingMode(id){
        if(this.props.isEditing){
            this.selectMessage(id);
        }
    }

    getStatusIcon(msgStatus){
        let statusIconName = 'ion|load-c';
        if(msgStatus === Status.STATUS_SENT){
            statusIconName = 'ion|android-done';
        }
        else if(msgStatus === Status.STATUS_RECEIVED){
            statusIconName = 'ion|android-done-all';
        }
        return statusIconName;
    }
    render() {
        const {message, isEditing} = this.props;
        let msgItemStyle = message.owner? messageStyle.msgItemSender : messageStyle.msgItemReceiver;
        let msgTextStyle = message.owner? messageStyle.msgSentText : messageStyle.msgReceivedText;
        let msgAlign     = message.owner? commons.pullRight : commons.pullLeft;
        let statusIcon   = this.getStatusIcon(message.state);
        let messageBgColor = message.selected ? messageStyle.msgSelected : messageStyle.msgUnselected;
        return (
            <TouchableHighlight style={[messageStyle.msgItemContainer, msgAlign, messageBgColor]}
                                onPress = {() => this.selectMessageOnlyInEditingMode(message.id)}
                                onLongPress={() => this.selectMessage(message.id)}>
                <View style={[messageStyle.msgItem, msgItemStyle]}>
                    <Text style={msgTextStyle}>
                        {message.text}
                    </Text>
                    <View style={[commons.horizontalNoWrap, commons.pullRight]}>
                        <Text style={commons.smallText}>sent</Text>
                        <Icon name={statusIcon}
                              size={defaultStyle.smallIconSize}
                              style={commons.smallIcon}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired
};

export default MessageItem;
