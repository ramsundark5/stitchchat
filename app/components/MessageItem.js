import React, { Component, View, Text, TextInput, TouchableHighlight, PropTypes, StyleSheet, SwitchIOS } from 'react-native';

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
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <SwitchIOS
                        onValueChange={() => this.handleSelectedClick(message.id)}
                        style={{marginBottom: 20}}
                        value={message.selected}/>
                    <Text style={styles.default}>
                        {message.text}
                    </Text>
                </View>
            </View>
        );
    }
}

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    selectMessage: PropTypes.func.isRequired
};

var styles = StyleSheet.create({
    page: {
        paddingBottom: 300,
    },
    default: {
        height: 20,
        flex: 1,
        fontSize: 13,
        padding: 4,
    }
});

export default MessageItem;
