import React, {Component, PropTypes} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MessageStatusIcon from './MessageStatusIcon';

class MessageTextItem extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        let statusChanged = this.props.message.status !== nextProps.message.status;
        return statusChanged;
    }

    render() {
        const {message} = this.props;
        const msgItemStyle = message.isOwner? styles.msgItemSender : styles.msgItemReceiver;
        const msgTextStyle = message.isOwner? styles.msgSentText : styles.msgReceivedText;
        return(
            <View style={[styles.msgItem, msgItemStyle, this.props.style]}>
                <Text style={msgTextStyle}>
                    {message.message}
                </Text>
                <MessageStatusIcon message={message}/>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    msgItem: {
        paddingTop: 8,
        flexDirection: 'column',
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 15,
    },
    msgItemSender: {
        marginRight: 10, // Offset for the image
        marginLeft: 35,
        backgroundColor: '#257DF7'
    },
    msgItemReceiver: {
        marginRight: 35, // Offset for the image
        marginLeft: 10,
        backgroundColor: '#D1D1D1'
    },
    msgSentText: {
        fontSize: 14,
        color: '#FFFFFF'
    },
    msgReceivedText: {
        fontSize: 14,
        color: '#000000'
    },
});

MessageTextItem.propTypes = {
    message: PropTypes.object.isRequired,
};

export default MessageTextItem;
