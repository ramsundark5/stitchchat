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

    _renderBadge(){
        return(
            <View style={threadStyle.badgeContainer}>
                <Text style={threadStyle.badgeText}>10</Text>
            </View>
        );
    }

    _renderLastReceivedMessage(thread){
        return (
            <View style={commons.horizontalNoWrap}>
                <Text style={threadStyle.lastMessageText} numberOfLines={1}>
                    {thread.lastMessageText}
                </Text>
                {this._renderBadge()}
            </View>

        );
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
