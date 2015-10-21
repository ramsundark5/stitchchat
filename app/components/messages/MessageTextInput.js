import React, { Component, View, TextInput, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import Message from '../../models/Message';
import MessageDao from '../../dao/MessageDao';
import MessageService from '../../services/MessageService';

class MessageTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ''
        };
    }

    async handleSubmit() {
        let messageText = this.state.text;
        if (messageText.length > 0) {
            let currentThread = this.props.currentThread;
            let newMessage = await MessageService.addMessage(currentThread, messageText);
            this.props.addMessage(newMessage);
        }
        this.setState({text: ''});
    }

    handleChange(changedtext) {
        this.setState({text: changedtext});
    }

    render() {
        return (
            <View style={commons.horizontalNoWrap}>
                    <TextInput
                        placeholder={this.props.placeholder}
                        multiline={true}
                        value={this.state.text}
                        style={this.props.style}
                        onChange={(event) => this.handleChange(event.nativeEvent.text)}
                        />
                <TouchableHighlight style={commons.defaultIconContainer}
                                    onPress={this.handleSubmit.bind(this)}>
                    <Icon name='android-send'
                        style={commons.defaultIcon}/>
                </TouchableHighlight>
            </View>
        );
    }
}

MessageTextInput.propTypes = {
    addMessage: PropTypes.func.isRequired,
    currentThread: PropTypes.object.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string
};

export default MessageTextInput;
