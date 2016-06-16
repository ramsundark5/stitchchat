import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {Theme} from '../common/Themes';
import FirebaseInviteHandler from '../../transport/FirebaseInviteHandler';
import TimeAgo from '../common/TimeAgo';
import GroupInfoService from '../../services/GroupInfoService';

export default class GroupInviteItem extends Component{

    acceptInvite(thread){
        GroupInfoService.acceptInvite(thread);
    }

    declineInvite(thread){
        GroupInfoService.declineInvite(thread);
    }

    render(){
        const {thread} = this.props;
        let displayName = thread.displayName && thread.displayName.length > 0 ? thread.displayName : thread.recipientPhoneNumber;
        return(
            <View>
                <View style={styles.threadItemContainer}>
                    <View style={{marginLeft: 10}}>
                        <Text style={[styles.title]}>{displayName}</Text>
                        <View>
                            <TouchableHighlight
                                onPress={() => this.acceptInvite(thread)}
                                style={styles.acceptButton}>
                                <Text style={styles.inviteText}>
                                    Accept
                                </Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={() => this.declineInvite(thread)}
                                style={styles.declineButton}>
                                <Text style={styles.inviteText}>
                                    Decline
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.threadStatus}>
                        <TimeAgo time={thread.lastMessageTime}/>
                    </View>
                </View>
                <View style={styles.threadDivider}/>
            </View>
        );
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
    threadDivider:{
        margin: 10,
        height: 1,
        backgroundColor: '#dddddd'
    },
    threadStatus:{
        position: 'absolute',
        right: 10,
    },
    acceptButton:{
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        borderRadius: 5,
        height: 30,
        width: 60,
        justifyContent: 'center',
    },
    declineButton:{
        borderColor: Theme.primaryColor,
        backgroundColor: Theme.primaryColor,
        borderRadius: 5,
        height: 30,
        width: 60,
        justifyContent: 'center',
    },
    inviteText:{
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
        fontSize: 10,
        textAlign: 'center',
    },
});

GroupInviteItem.propTypes = {
    thread: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};