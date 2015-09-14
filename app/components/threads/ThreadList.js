import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {messageStyle} from '../../styles/MessageStyle';
import {commons, smallIconSize} from '../../styles/Styles';
import moment from 'moment';
import ThreadItem from './ThreadItem';

class ThreadList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    loadMoreThreads(){
        this.props.actions.loadMoreThreads();
    }
    render() {
        const { threads, isEditing, actions } = this.props;
        let threadsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        threadsDS = threadsDS.cloneWithRows(threads);
        return (
            <View style={commons.listContainer}>
                <ListView
                    dataSource={threadsDS}
                    loadData={actions.loadMoreThreads()}
                    refreshDescription="Loading messages"
                    renderRow={(rowData) => <ThreadItem key={rowData.id} thread={rowData}
                                                isEditing={isEditing} {...actions}/>}/>
                <TouchableHighlight onPress={actions.deleteSelected}>
                    <Text>Delete</Text>
                </TouchableHighlight>
            </View>
        );
    }

}

ThreadList.propTypes = {
    threads: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default ThreadList;
