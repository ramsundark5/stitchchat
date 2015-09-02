import React, { Component, PropTypes, View, Text, TextInput } from 'react-native';
import MessageTextInput from './MessageTextInput';
import { Icon } from 'react-native-icons';
import {commons, defaultIconColor, defaultIconSize} from '../styles/Styles';

class MessageComposer extends Component {

    handleSave(text) {
        if (text.length !== 0) {
            this.props.addMessage(text);
        }
    }

    render() {
        return (
            <MessageTextInput newMessage={true}
                              style={commons.defaultTextInput}
                              onSave={this.handleSave.bind(this)}
                              placeholder='Type here'/>
        );
    }
}

MessageComposer.propTypes = {
    addMessage: PropTypes.func.isRequired
};

export default MessageComposer;
