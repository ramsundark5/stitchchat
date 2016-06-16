import React, {Component, PropTypes} from 'react';
import {View, Text, ListView, ScrollView, TouchableHighlight, Animated, StyleSheet, InteractionManager, Dimensions} from 'react-native';
import MessageItem from './MessageItem';
import MessageDao from '../../dao/MessageDao';
import CustomMessageListView from './CustomMessageListView';

class MessageList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { messages, loadOlderMessages, deleteSelected, scrollToBottom,
            retainScrollPosition, resetScrollToBottom, router, showLoadingSpinner} = this.props;

        return (
            <CustomMessageListView rows={messages}
                                   loadOlderMessages={loadOlderMessages}
                                   renderRow={(rowData, sectionID, rowID) => this.renderMessageItem(rowData, sectionID, rowID)}
                                   renderSectionHeader={(sectionData, sectionID)=>this.renderSectionHeader(sectionData, sectionID)}
                                   scrollToBottom={scrollToBottom}
                                   retainScrollPosition={retainScrollPosition}
                                   resetScrollToBottom={resetScrollToBottom}
                                   showLoadingSpinner={showLoadingSpinner}
                                   router={router}/>
        );

    }

    renderMessageItem(rowData, sectionID, rowID) {
        return (
            <MessageItem key={rowData.id} message={rowData}
                         isEditing={this.props.isEditing}
                         selectMessage={this.props.selectMessage}
                         selectMessageOnlyInEditingMode={this.props.selectMessageOnlyInEditingMode}
                         router={this.props.router}/>
        );
    }

    renderSectionHeader(sectionData, sectionID){
        return(
                <Text style={styles.date}>{sectionID}</Text>
        );
    }

}

const styles = StyleSheet.create({
    date: {
        color: '#9c9393',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

MessageList.propTypes = {
    messages: PropTypes.object.isRequired,
    currentThread: PropTypes.object.isRequired,
    selectMessage: PropTypes.func.isRequired,
    selectMessageOnlyInEditingMode: PropTypes.func.isRequired,
    loadOlderMessages: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.bool.isRequired,
    showLoadingSpinner: PropTypes.bool.isRequired,
    resetScrollToBottom: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default MessageList;
