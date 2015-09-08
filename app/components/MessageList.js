import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import MessageItem from './MessageItem';
import {messageStyle} from '../styles/MessageStyle';
import {commons, smallIconSize} from '../styles/Styles';
import moment from 'moment';

class MessageList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    renderSectionHeader(sectionData, sectionID){
        return(
          <View style={messageStyle.msgDivider}><Text style={commons.defaultText}>{sectionID}</Text></View>
        );
    }

    groupMessagesByDate(messages){
        let groupedMessage = {};
        for(let i=0; i < messages.length; i++){
            let date = messages[i].date;
            let formattedDate = moment(date).format('MM/DD/YYYY');
            if(!groupedMessage[formattedDate]){
                groupedMessage[formattedDate] = [];
            }
            groupedMessage[formattedDate].push(messages[i]);
        }
        return groupedMessage;
    }
    render() {
        const { messages, isEditing, actions } = this.props;
        let groupedMessages = this.groupMessagesByDate(messages);
        let messagesDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
        messagesDS = messagesDS.cloneWithRowsAndSections(groupedMessages);

        return (
            <View style={messageStyle.messageListContainer}>
                <ListView
                    dataSource={messagesDS}
                    renderSectionHeader={this.renderSectionHeader}
                    renderRow={(rowData) => <MessageItem key={rowData.id} message={rowData}
                                                isEditing={isEditing} {...actions}/>}/>
                <TouchableHighlight onPress={actions.deleteSelected}>
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
