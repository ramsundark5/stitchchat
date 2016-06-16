import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import ThreadService from '../../services/ThreadService';
import GroupInfoService from '../../services/GroupInfoService';
import * as AppConstants from '../../constants/AppConstants';

class ThreadOptionsBox extends Component {

    deleteThread(thread){
        ThreadService.deleteThread(thread);
    }

    muteThread(thread){
        thread.isMuted = !thread.isMuted;
        ThreadService.muteThread(thread);
    }

    blockContact(thread){
        let contact = thread.contactInfo;
        if(contact){
            ThreadService.blockUser(thread, contact);
        }
    }

    leaveGroup(thread){
        GroupInfoService.leaveGroup(thread);
    }
    
    render() {
        const {thread} = this.props;
        return(
            <View>
                {this.renderMuteOption(thread)}
                {this.renderBlockOrLeaveOption(thread)}
                <TouchableOpacity style={[styles.optionsButton, styles.deleteButton]}
                                  onPress={() => this.deleteThread(thread)}>
                    <Text style={styles.optionsText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderMuteOption(thread){
        let muteText = 'Mute';
        if(thread.isMuted){
            muteText = 'Unmute';
        }
        return(
            <TouchableOpacity style={[styles.optionsButton, styles.muteButton]}
                              onPress={() => this.muteThread(thread)}>
                <Text style={styles.optionsText}>{muteText}</Text>
            </TouchableOpacity>
        );
    }

    renderBlockOrLeaveOption(thread){
        if(thread.isGroupThread){
            return this.renderLeaveGroupOption(thread);
        }else{
            return this.renderBlockOption(thread);
        }
    }

    renderLeaveGroupOption(thread){
        if(thread.groupInfo.status == AppConstants.LEFT_GROUP){
            return(
                <View style={[styles.optionsButton, styles.groupExitedButton]}>
                    <Text style={styles.optionsText}>Exited</Text>
                </View>
            )
        }else{
            return(
                <TouchableOpacity style={[styles.optionsButton, styles.blockButton]}
                                  onPress={() => this.leaveGroup(thread)}>
                    <Text style={styles.optionsText}>Leave</Text>
                </TouchableOpacity>
            );
        }

    }
    
    renderBlockOption(thread){
        let blockText = 'Block';
        if(thread.contactInfo.isBlocked){
            blockText = 'Unblock';
        }
        return(
            <TouchableOpacity style={[styles.optionsButton, styles.blockButton]}
                              onPress={() => this.blockContact(thread)}>
                <Text style={styles.optionsText}>{blockText}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    threadItem: {
        padding: 10,
        backgroundColor: '#FAFAFA',
    },
    optionsButton: {
        position: 'absolute',
        top: 0,
        width: 60,
        marginBottom: 20,
        height: 90,
    },
    muteButton: {
        justifyContent: 'center',
        backgroundColor: '#1abc9c',
        right: 120,
    },
    blockButton: {
        justifyContent: 'center',
        backgroundColor: '#3498db',
        right: 60
    },
    groupExitedButton:{
        justifyContent: 'center',
        backgroundColor: '#EBEBE4',
        right: 60
    },
    deleteButton: {
        justifyContent: 'center',
        backgroundColor: 'rgba(231,76,60,1)',
        right: 0
    },
    optionsText:{
        textAlign: 'center',
        color: '#fff'
    }
});

ThreadOptionsBox.propTypes = {
    thread: PropTypes.object.isRequired
};

export default ThreadOptionsBox;
