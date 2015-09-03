import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons} from '../styles/Styles';
import {messageStyle} from '../styles/MessageStyle';

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

    render() {
        const {message} = this.props;
        let msgItemStyle = message.owner? messageStyle.msgItemSender : messageStyle.msgItemReceiver;
        let msgTextStyle = message.owner? messageStyle.msgSentText : messageStyle.msgReceivedText;
        let msgAlign     = message.owner? commons.pullRight : commons.pullLeft;
        return (
            <TouchableHighlight style={[messageStyle.msgItemContainer, msgAlign]}
                                onLongPress={() => this.handleSelectedClick(message.id)}>
                <View style={[messageStyle.msgItem, msgItemStyle]}>
                    <Text style={msgTextStyle}>
                        {message.text}
                    </Text>
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
