import React, { Component, PropTypes, View } from 'react-native';
import MessageTextInput from './MessageTextInput';
import { Icon } from 'react-native-icons';
import {commons, iconColor, iconSize} from '../styles/Styles';

class MessageComposer extends Component {

    handleSave(text) {
        if (text.length !== 0) {
            this.props.addMessage(text);
        }
    }

    render() {
        return (
            <View>
                <MessageTextInput newMessage={true}
                                  onSave={this.handleSave.bind(this)}
                                  placeholder='Type here'/>
                <Icon name='material|face'
                      size={iconSize} color={iconColor}
                      style={commons.defaultTextInput}
                />
            </View>
        );
    }
}

MessageComposer.propTypes = {
    addMessage: PropTypes.func.isRequired
};

export default MessageComposer;
