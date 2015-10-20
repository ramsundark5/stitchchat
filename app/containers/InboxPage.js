import React, { Component, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import ThreadList from '../components/threads/ThreadList';
import ThreadComposer from '../components/threads/ThreadComposer';
import * as ThreadActions from '../actions/ThreadActions';
import * as MessageActions from '../actions/MessageActions';
import {commons} from '../components/styles/CommonStyles';
import LoginService from '../services/LoginService';

class InboxPage extends Component {

    componentWillMount(){
        LoginService.showLoginPage();
    }

    render() {
        const { threads, threadActions, messageActions, isEditing, router } = this.props;

        return (
            <View style={commons.container}>
                <View style={{flex: 1}}>
                    <ThreadList threads={threads}
                                loadMoreThreads={threadActions.loadMoreThreads}
                                selectThread={threadActions.selectThread}
                                setCurrentThread={threadActions.setCurrentThread}
                                loadMessagesForThread={messageActions.loadMessagesForThread}
                                isEditing={isEditing}
                                router={router}/>
                </View>
                <View style={[{flex: 0}, commons.horizontalNoWrap]}>
                    <ThreadComposer addNewThread={threadActions.addNewThread}
                                    addNewGroupThread={threadActions.addNewGroupThread}
                                    searchThreads={threadActions.searchThreads}
                                    isEditing={isEditing}
                                    router={router}/>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        threads: state.threadState.threads,
        isEditing: state.threadState.isEditing
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        messageActions: bindActionCreators(MessageActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(InboxPage);
