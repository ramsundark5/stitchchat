import React, { Component, View, TextInput, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import { Icon } from 'react-native-icons';

class MessageTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: ''
        };
    }

    handleSubmit() {
        this.props.onSave(this.state.text);
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
                    <Icon name='ion|android-send'
                        size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                        style={commons.defaultIcon}/>
                </TouchableHighlight>
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
