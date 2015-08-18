import React, { Component, PropTypes, View, Text, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import MessageTextInput from './MessageTextInput';

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
            </View>
        );
    }
}

var styles = StyleSheet.create({
    default: {
        height: 26,
        borderWidth: 0.5,
        borderColor: '#0f0f0f',
        flex: 1,
        fontSize: 13,
        padding: 4,
    }
});

MessageComposer.propTypes = {
    addMessage: PropTypes.func.isRequired
};

export default MessageComposer;
