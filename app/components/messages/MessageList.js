import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import MessageItem from './MessageItem';
import {messageStyle} from './MessageStyles';
import {commons, defaultStyle} from '../styles/CommonStyles';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import moment from 'moment';

class MessageList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    groupMessagesByDate(messages){
        let groupedMessage = {};
        for(let i=0; i < messages.length; i++){
            let date = messages[i].timestamp;
            let formattedDate = moment(date).format('MM/DD/YYYY');
            if(!groupedMessage[formattedDate]){
                groupedMessage[formattedDate] = [];
            }
            groupedMessage[formattedDate].push(messages[i]);
        }
        return groupedMessage;
    }

    loadOlderMessages(){
        this.props.loadOlderMessages();
    }

    render() {
        const { messages, loadOlderMessages, deleteSelected} = this.props;
        //let groupedMessages = this.groupMessagesByDate(messages);

        let rowIds = messages.map((row, index) => index).reverse();
        let messagesDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2});
        messagesDS = messagesDS.cloneWithRows(messages, rowIds);
        return (
            <View style={commons.listContainer}>
                <ListView
                    ref="messageListRef"
                    renderScrollComponent={props => <InvertibleScrollView {...props} inverted/>}
                    dataSource={messagesDS}
                    renderRow={this.renderMessageItem.bind(this)}/>
                <TouchableHighlight onPress={deleteSelected}>
                    <Text>Delete</Text>
                 </TouchableHighlight>
            </View>
        );
    }

    renderMessageItem(rowData, sectionID, rowID) {
        return (
            <MessageItem key={rowData.id} message={rowData}
                         isEditing={this.props.isEditing}
                         selectMessage={this.props.selectMessage}
                         router={this.props.router}/>
        );
    }

    renderSectionHeader(sectionData, sectionID){
        return(
            <View style={messageStyle.msgDivider}><Text style={commons.defaultText}>{sectionID}</Text></View>
        );
    }
}

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    currentThread: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired,
    loadOlderMessages: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default MessageList;
