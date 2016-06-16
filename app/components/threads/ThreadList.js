import React, {PropTypes} from 'react';
import {View, ListView, StyleSheet} from 'react-native';
import Component from '../PureComponent';
import ThreadItem from './ThreadItem';
import GroupInviteItem from './GroupInviteItem';
import ThreadOptionsBox from './ThreadOptionsBox';
import { SwipeListView } from 'react-native-swipe-list-view';

class ThreadList extends Component {
    constructor(props, context) {
        super(props, context);
        this.threadsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    loadMoreThreads(){
        //this.props.loadMoreThreads();
    }

    render() {
        const { threads } = this.props;
        const datasource = this.threadsDS.cloneWithRows(threads);
        return (
                <SwipeListView
                    dataSource={datasource}
                    enableEmptySections={true}
                    loadData={this.loadMoreThreads()}
                    renderRow={(thread, sectionID, rowID) => this.renderThreadItem(thread, sectionID, rowID)}
                    renderHiddenRow={ (thread, secId, rowId, rowMap) => (this.renderThreadOptions(thread, secId, rowId, rowMap))}
                    disableRightSwipe={true}
                    renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
                    rightOpenValue={-200}/>
        );
    }

    renderThreadItem(thread, sectionID, rowID) {
        if(thread.isGroupThread && thread.groupInfo.status == 'PENDING'){
            return(
                <View style={styles.threadItem}>
                    <GroupInviteItem key={thread.id}
                                     thread={thread}
                                     router={this.props.router}/>
                </View>
            );
        }else{
            return (
                <View style={styles.threadItem}>
                    <ThreadItem  key={thread.id}
                                 thread={thread}
                                 router={this.props.router}
                                 selectThread={this.props.selectThread}
                                 setCurrentThread={this.props.setCurrentThread}
                                 isEditing={this.props.isEditing}/>
                </View>
            );
        }
    }

    renderThreadOptions(thread, secId, rowId, rowMap){
        return(
            <ThreadOptionsBox thread={thread} key={thread.id}/>
        );
    }
}

const styles = StyleSheet.create({
    threadItem: {
        padding: 10,
        backgroundColor: '#FAFAFA',
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd',
    },
});

ThreadList.propTypes = {
    threads: PropTypes.array.isRequired,
    loadMoreThreads: PropTypes.func.isRequired,
    selectThread: PropTypes.func.isRequired,
    setCurrentThread: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired
};

export default ThreadList;
