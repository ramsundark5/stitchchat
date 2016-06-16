import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, StyleSheet, Image} from 'react-native';
import {Theme} from '../common/Themes';
import TimeAgo from '../common/TimeAgo';
import UserAvatar from '../common/UserAvatar';

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

    render() {
        const {thread} = this.props;
        let displayName = thread.displayName && thread.displayName.length > 0 ? thread.displayName : thread.recipientPhoneNumber;
        return(
            <TouchableHighlight onPress={() => this.onThreadClick(thread)}>
                <View>
                    <View style={styles.threadItemContainer}>
                            <UserAvatar
                                size={50}
                                username={displayName}
                                onPressIn={() => {}}
                                onPressOut={() => {}}/>
                            <View style={{marginLeft: 10}}>
                                <Text style={[styles.title]}>{displayName}</Text>
                                <Text style={styles.lastMessageText} numberOfLines={1}>
                                    {thread.lastMessageText}
                                </Text>
                            </View>
                            <View style={styles.threadStatus}>
                                <TimeAgo time={thread.lastMessageTime}/>
                                {this._renderBadge(thread)}
                            </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderBadge(thread){
        if(thread.unreadCount && thread.unreadCount > 0){
            return(
                <View style={[styles.badgeContainer]}>
                    <Text style={styles.badgeText}>{thread.unreadCount}</Text>
                </View>
            );
        }else{
            return;
        }
    }
}

const styles = StyleSheet.create({
    threadItemContainer:{
        flexDirection : 'row',
        margin: 10
    },
    title: {
        fontSize: 14,
        color: '#656565',
        fontWeight: 'bold',
        flex: 1,
    },
    threadStatus:{
        position: 'absolute',
        right: 10,
    },
    lastMessageContainer:{
        flexDirection : 'row',
        justifyContent: 'space-between'
    },
    lastMessageText: {
        marginTop: 10,
        fontSize: 14,
        flex:1
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 20,
        backgroundColor: '#dddddd'
    },
    badgeContainer: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: Theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: 10,
        right: 1,
    },
    badgeText: {
        fontSize: 8,
        color: 'white',
        fontWeight: 'bold',
    },
});

ThreadItem.propTypes = {
    thread: PropTypes.object.isRequired,
    selectThread: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default ThreadItem;
