import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {messageStyle} from '../../styles/MessageStyle';
import {commons, smallIconSize} from '../../styles/Styles';
import moment from 'moment';

class ThreadList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    loadOlderThreads(){
        this.props.actions.loadOlderThreads();
    }
    render() {
        const { threads, isEditing, actions } = this.props;
        let threadsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        threadsDS = threadsDS.cloneWithRows(threads);
        return (
            <View style={messageStyle.messageListContainer}>
                <ListView
                    dataSource={threadsDS}
                    loadData={actions.loadOlderThreads()}
                    refreshDescription="Loading messages"
                    renderRow={(rowData) => <ThreadItem key={rowData.id} message={rowData}
                                                isEditing={isEditing} {...actions}/>}/>
                <TouchableHighlight onPress={actions.deleteSelected}>
                    <Text>Delete</Text>
                </TouchableHighlight>
            </View>
        );
    }

}

MessageList.propTypes = {
    threads: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default ThreadList;
