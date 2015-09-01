import React, { Component, View, TextInput, Text, PropTypes } from 'react-native';
import {commons} from '../styles/Styles';

class MessageTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ''
        };
    }

    handleSubmit(text) {
        this.props.onSave(text);
        this.setState({text: ''});
    }

    handleChange(changedtext) {
        this.setState({text: changedtext});
    }

    render() {
        return (
                <View>
                    <TextInput
                        placeholder={this.props.placeholder}
                        autoFocus={true}
                        value={this.state.text}
                        style={commons.defaultTextInput}
                        onChange={(event) => this.handleChange(event.nativeEvent.text)}
                        onSubmitEditing={(event) => this.handleSubmit(event.nativeEvent.text)}/>

                </View>
        );
    }
}

MessageTextInput.propTypes = {
    onSave: PropTypes.func.isRequired,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    newMessage: PropTypes.bool
};

export default MessageTextInput;
