import React, { Component, View, Text, PropTypes, SwitchIOS } from 'react-native';
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
        } else {
            this.props.editMessage(id, text);
        }
        this.setState({editing: false});
    }

    handleSelectedClick(id) {
        this.props.selectMessage(id);
    }

    render() {
        const {message, selectMessage, deleteMessage} = this.props;
        let element;
        return (
            <View style={commons.messagesSender}>
                {/* <SwitchIOS
                    onValueChange={() => this.handleSelectedClick(message.id)}
                    style={{marginBottom: 20}}
                    value={message.selected}/>*/}
                <Text style={commons.defaultText}>
                    {message.text}
                </Text>
            </View>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    selectMessage: PropTypes.func.isRequired
};

export default MessageItem;
