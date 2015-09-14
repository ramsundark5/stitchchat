import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {messageStyle} from '../../styles/MessageStyles';
import {commons, smallIconSize} from '../../styles/CommonStyles';
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
        const { threads, isEditing, actions, router } = this.props;
        let threadsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        threadsDS = threadsDS.cloneWithRows(threads);
        return (
            <View style={commons.listContainer}>
                <ListView
                    dataSource={threadsDS}
                    loadData={actions.loadMoreThreads()}
                    renderRow={this.renderThreadItem.bind(this)}/>

                <TouchableHighlight onPress={actions.deleteSelected}>
                    <Text>Delete</Text>
                </TouchableHighlight>
            </View>
        );
    }

    renderThreadItem(rowData, sectionID, rowID) {
        return (
            <ThreadItem key={rowData.id} thread={rowData}
                         router = {this.props.router}
                         isEditing={this.props.isEditing}
                         {...this.props.actions}/>
        );
    }
}

ThreadList.propTypes = {
    threads: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

export default ThreadList;
