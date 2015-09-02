import React, { Component, View, Text, PropTypes, SwitchIOS, TouchableHighlight } from 'react-native';
import {commons} from '../styles/Styles';

class MessageItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            editing: false
        };
    }

    handleSave(id, text) {
        if (text.length === 0) {
            this.props.deleteMessage(id);
        }
    }

    handleSelectedClick(id) {
        this.props.selectMessage(id);
    }

    render() {
        const {message, selectMessage, deleteMessage} = this.props;
        return (
            <TouchableHighlight style={[commons.message, commons.pullRight]}
                                onLongPress={() => this.handleSelectedClick(message.id)}>

                    <Text style={commons.defaultText}>
                        {message.text}
                    </Text>
            </TouchableHighlight>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    selectMessage: PropTypes.func.isRequired
};

export default MessageItem;
