import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import MessageItem from './MessageItem';

class MessageList extends Component {
    constructor(props, context) {
        super(props, context);
        this.actions = props.actions;
    }

    render() {
        const { messages, actions } = this.props;
        let messagesDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        messagesDS = messagesDS.cloneWithRows(messages);

        return (
            <View>
                <ListView
                    dataSource={messagesDS}
                    renderRow={(rowData) => <MessageItem key={rowData.id} message={rowData} {...actions}/>}/>
            </View>
        );
    }

    renderTodoRow(rowData, sectionID, rowID) {
        return (
            <TodoItem key={rowData.id} todo={rowData}/>
        );
    }
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default MessageList;
