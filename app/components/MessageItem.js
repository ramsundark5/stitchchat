import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, smallIconSize} from '../styles/Styles';
import {messageStyle} from '../styles/MessageStyle';
import { Icon } from 'react-native-icons';
import * as Status from '../constants/MessageConstants.js';

class MessageItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            editing: false
        };
    }

    handleSelectedClick(id) {
        this.props.selectMessage(id);
    }

    getStatusIcon(state){
        let statusIconName = 'ion|load-c';
        if(state === Status.STATUS_SENT){
            statusIconName = 'ion|android-done';
        }
        else if(state === Status.STATUS_RECEIVED){
            statusIconName = 'ion|android-done-all';
        }
        return statusIconName;
    }
    render() {
        const {message} = this.props;
        let msgItemStyle = message.owner? messageStyle.msgItemSender : messageStyle.msgItemReceiver;
        let msgTextStyle = message.owner? messageStyle.msgSentText : messageStyle.msgReceivedText;
        let msgAlign     = message.owner? commons.pullRight : commons.pullLeft;
        let statusIcon   = this.getStatusIcon(message.state);
        return (
            <TouchableHighlight style={[messageStyle.msgItemContainer, msgAlign]}
                                onLongPress={() => this.handleSelectedClick(message.id)}>
                <View style={[messageStyle.msgItem, msgItemStyle]}>
                    <Text style={msgTextStyle}>
                        {message.text}
                    </Text>
                    <View style={[commons.horizontalNoWrap, commons.pullRight]}>
                        <Text style={commons.smallText}>sent</Text>
                        <Icon name={statusIcon}
                              size={smallIconSize}
                              style={commons.smallIcon}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    selectMessage: PropTypes.func.isRequired
};

export default MessageItem;
