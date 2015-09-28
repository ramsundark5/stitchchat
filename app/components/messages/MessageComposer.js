import React, { Component, PropTypes, View, Text, TextInput } from 'react-native';
import MessageTextInput from './MessageTextInput';
import MessageOptionsBox from './MessageOptionsBox';
import { Icon } from 'react-native-icons';
import {commons} from '../../styles/CommonStyles';

class MessageComposer extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { isEditing, actions } = this.props;
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
                <MessageTextInput style={commons.defaultTextInput}
                                  addMessage = {actions.addMessage}
                                  placeholder='Type here'/>
            );
        }
    }
}

MessageComposer.propTypes = {
    actions: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired
};

export default MessageComposer;
