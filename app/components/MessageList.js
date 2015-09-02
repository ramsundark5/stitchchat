import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import MessageItem from './MessageItem';
import {commons} from '../styles/Styles';

class MessageList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { messages, actions } = this.props;
        let messagesDS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        messagesDS = messagesDS.cloneWithRows(messages);

        return (
            <View style={commons.messagesList}>
                <ListView
                    dataSource={messagesDS}
                    renderRow={(rowData) => <MessageItem key={rowData.id} message={rowData} {...actions}/>}/>
                <TouchableHighlight underlayColor="transparent" onPress={actions.deleteSelected}>
                    <Text>Delete</Text>
                 </TouchableHighlight>
            </View>
        );
    }

}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default MessageList;
