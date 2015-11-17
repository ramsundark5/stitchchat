import React, { Component, View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/messages/MessageComposer';
import MessageList from '../components/messages/MessageList';
import * as MessageActions from '../actions/MessageActions';
import {commons} from '../components/styles/CommonStyles';
import MediaOptions from '../components/media/MediaOptions';
import MessageDao from '../dao/MessageDao';

class MessagePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.loadInitialMessages();
    }

    async loadInitialMessages(){
        let thread = this.props.currentThread;
        console.log("current thread is "+thread.id);
        let threadMessages = [];
        try{
            if(thread.isGroupThread){
                threadMessages = await MessageDao.getGroupMessages(thread.id);
            }else{
                threadMessages = await MessageDao.getMessages(thread.id);
            }
            this.props.messageActions.loadMessagesForThread(threadMessages);
        }catch(err){
            console.log("error loading messages" + err);
        }
    }

    render() {
        const { messages, messageActions, isEditing, isMediaOptionsVisible, currentThread, router } = this.props;

        return (
            <View style={commons.container}>
                <View style={{flex: 1}}>
                    <MessageList messages={messages}
                                 isEditing={isEditing}
                                 currentThread={currentThread}
                                 selectMessage={messageActions.selectMessage}
                                 loadOlderMessages={messageActions.loadOlderMessages}
                                 router={router}/>
                </View>
                <View style={[commons.horizontalNoWrap]}>
                    {this._renderMediaOptions(isEditing, isMediaOptionsVisible, messageActions, router)}
                    <View style={{flex: 1}}>
                        <MessageComposer isEditing={isEditing}
                                         currentThread={currentThread}
                                         actions={messageActions}/>
                    </View>
                </View>
            </View>
        );
    }

    _renderMediaOptions(isEditing, isMediaOptionsVisible, messageActions, router){
        //don't show media options in editing state
        if(isEditing){
            return;
        }
        return(
            <MediaOptions router={router} isMediaOptionsVisible={isMediaOptionsVisible}
                          showMediaOptions={messageActions.showMediaOptions}
                          hideMediaOptions={messageActions.hideMediaOptions}/>
        );
    }
}

function mapStateToProps(state) {
    console.log("mapStateToProps is triggered in message page");
    return {
        messages: state.messageState.messages,
        isEditing: state.messageState.isEditing,
        isMediaOptionsVisible: state.messageState.isMediaOptionsVisible,
        currentThread: state.threadState.currentThread
    };
}

function mapDispatchToProps(dispatch) {
    return {
        messageActions: bindActionCreators(MessageActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
