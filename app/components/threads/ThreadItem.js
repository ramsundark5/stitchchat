import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';
import { Icon } from 'react-native-icons';
import MessageDao from '../../dao/MessageDao';

class ThreadItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    openMessagesPage(thread){
        this.props.setCurrentThread(thread);
        this.props.router.toMessageView(thread);
        this.loadMessagesForThread(thread);
    }

    async loadMessagesForThread(thread){
        let messagesStr = await MessageDao.getMessages(thread.id);
        let messages = JSON.parse(messagesStr);
        this.props.loadMessagesForThread(messages);
    }

    render() {
        const {thread} = this.props;
        return (
            <TouchableHighlight onPress={() => this.openMessagesPage(thread)}>
                <View>
                    <View style = {threadStyle.threadItemContainer}>
                        <Text style={[threadStyle.title]}>{thread.recipientContactInfo.phoneNumber}</Text>
                        <Text style={[threadStyle.timestamp]}>{thread.lastMessageTime}</Text>
                    </View>
                    {this._renderTimeStamp(thread)}
                    <View style={commons.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    _renderBadge(){
        return(
            <View style={threadStyle.badgeContainer}>
                <Text style={defaultStyle.badgeText}>10</Text>
            </View>
        );
    }

    _renderTimeStamp(thread){
        return (
            <Text style={threadStyle.lastMessageText} numberOfLines={1}>
                {thread.lastMessageText}
            </Text>
        );
    }

}

ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    selectThread: PropTypes.func.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default ThreadItem;
