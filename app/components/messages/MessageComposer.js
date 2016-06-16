import React, {Component, PropTypes} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import MessageTextInput from './MessageTextInput';
import MessageOptionsBox from './MessageOptionsBox';
import {Theme} from '../common/Themes';

class MessageComposer extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { isEditing, currentThread, actions, showMessageComposer } = this.props;
        if(showMessageComposer ){
            return;
        }

        if(isEditing){
            return(
                <MessageOptionsBox isEditing={isEditing} actions={actions}
                                   copySelectedMessages={actions.copySelectedMessages}
                                   forwardSelected={actions.forwardSelected}
                                   deleteSelected={actions.deleteSelected}/>
            );
        }
       else{
            return (
                <MessageTextInput style={[styles.messageInput, styles.messageInputUnderline]}
                                  addMessage={actions.addMessage}
                                  currentThread={currentThread}
                                  placeholder='Type here'/>
            );
        }
    }
}

const styles = StyleSheet.create({
    messageInput: {
        height  : 26,
        fontSize: 14,
        flex    : 1,
    },
    messageInputUnderline: {
        borderBottomWidth: 1.5,
        borderColor: Theme.primaryColor,
    },
});

MessageComposer.propTypes = {
    actions: PropTypes.object.isRequired,
    currentThread: PropTypes.object.isRequired,
    //showMessageComposer: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired
};

export default MessageComposer;
