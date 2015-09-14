import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {threadStyle} from '../../styles/ThreadStyles';
import { Icon } from 'react-native-icons';

class ThreadItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    openMessagesPage(thread){
        this.props.router.toMessageView(thread);
    }

    render() {
        const {thread, isEditing, router} = this.props;
        return (
            <TouchableHighlight onPress={() => this.openMessagesPage(thread)}>
                <View>
                    <View style = {threadStyle.threadItemContainer}>
                        <Text style={[threadStyle.title]}>{thread.recipientContactInfo.phoneNumber}</Text>
                        <Text style={[threadStyle.timestamp]}>{thread.lastMessageTime}</Text>
                    </View>
                    <Text style={threadStyle.lastMessageText} numberOfLines={1}>
                        {thread.lastMessageText}
                    </Text>
                    <View style={commons.separator}/>
                </View>
            </TouchableHighlight>
        );
    }
}

ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    selectThread: PropTypes.func.isRequired
};

export default ThreadItem;
