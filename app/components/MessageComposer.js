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
            <View style={commons.horizontalNoWrap}>
                <MessageTextInput newMessage={true}
                                  style={commons.defaultTextInput}
                                  onSave={this.handleSave.bind(this)}
                                  placeholder='Type here'/>
                <Icon name='material|face'
                      size={defaultIconSize} color={defaultIconColor}
                      style={commons.defaultIcon}/>
            </View>
        );
    }
}

MessageComposer.propTypes = {
    addMessage: PropTypes.func.isRequired
};

export default MessageComposer;
