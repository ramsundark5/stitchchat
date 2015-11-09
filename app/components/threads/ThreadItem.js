import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {threadStyle} from './ThreadStyles';
import MessageDao from '../../dao/MessageDao';
import TimeAgo from 'react-native-timeago';

class ThreadItem extends Component {
    constructor(props, context) {
        super(props, context);
    }

    onThreadClick(thread){
        if(this.props.isEditing){
            this.selectThread(thread);
        }else{
            this.props.setCurrentThread(thread);
            this.props.router.toMessageView(thread);
        }
    }

    selectThread(thread){
        this.props.selectThread(thread);
    }

    render() {
        const {thread} = this.props;
        let threadBgColor = thread.selected ? threadStyle.threadSelected : threadStyle.threadUnselected;
        let displayName = thread.displayName && thread.displayName.length > 0 ? thread.displayName : thread.recipientPhoneNumber;
        return (
            <TouchableHighlight onPress={() => this.onThreadClick(thread)}
                                onLongPress={() => this.selectThread(thread)}
                                style={threadBgColor}>
                <View>
                    <View style = {threadStyle.threadItemContainer}>
                        <Text style={[threadStyle.title]}>{displayName}</Text>
                        <TimeAgo time={thread.lastMessageTime} />
                    </View>
                    {this._renderLastReceivedMessage(thread)}
                    <View style={commons.separator}/>
                </View>
            </TouchableHighlight>
        );
    }

    _renderLastReceivedMessage(thread){
        return (
            <View style={[commons.horizontalNoWrap, {flex:1}]}>
                <Text style={threadStyle.lastMessageText} numberOfLines={1}>
                    {thread.lastMessageText}
                </Text>
                {this._renderBadge(thread)}
            </View>

        );
    }

    _renderBadge(thread){
        if(thread.unreadCount && thread.unreadCount > 0){
            return(
                <View style={[threadStyle.badgeContainer]}>
                    <Text style={threadStyle.badgeText}>{thread.unreadCount}</Text>
                </View>
            );
        }else{
            return;
        }
    }
}

ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    selectThread: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default ThreadItem;
