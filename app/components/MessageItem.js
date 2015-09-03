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
        return (
            <View style={[messageStyle.msgItemContainer, commons.pullRight]}
                                onLongPress={() => this.handleSelectedClick(message.id)}>
                <View style={[messageStyle.msgItem, messageStyle.msgItemSender]}>
                    <Text style={messageStyle.msgSentText}>
                        {message.text}
                    </Text>
                </View>
            </View>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    selectMessage: PropTypes.func.isRequired
};

export default MessageItem;
