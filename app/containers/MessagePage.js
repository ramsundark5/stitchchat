import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, InteractionManager} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MessageList from '../components/messages/MessageList';
import * as MessageActions from '../actions/MessageActions';
import MediaGallery from '../components/media/MediaGallery';
import MessagePageFooter from './MessagePageFooter';
import MessageDao from '../dao/MessageDao';
import ThreadDao from '../dao/ThreadDao';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import MessageViewTabBar from '../components/messages/MessageViewTabBar';
const { width } = Dimensions.get('window');
const Incremental = require('Incremental');
const IncrementalGroup = require('IncrementalGroup');

class MessagePage extends Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount(){
        if(this.props.currentThread){
            this.loadInitialMessages();
            InteractionManager.runAfterInteractions(() => {
                let thread = this.props.currentThread;
                ThreadDao.resetUnreadCount(thread.id);
            });
        }
    }

    componentWillUnmount(){
        this.props.messageActions.resetMessageState();
    }

    loadInitialMessages(){
        let thread = this.props.currentThread;
        console.log("current thread is "+thread.id);
        let groupedMessages = [];
        try{
            let threadMessages = MessageDao.getMessages(thread.id);
            this.props.messageActions.loadMessagesForThread(threadMessages);
        }catch(err){
            console.log("error loading messages" + err);
        }
        return groupedMessages;
    }

    loadOlderMessages(rowCount, messageLimit = 35){
        let thread = this.props.currentThread;
        console.log("current thread is "+thread.id);
        let groupedMessages = [];
        try{
            this.props.messageActions.showLoadingSpinner();
            let threadMessages = MessageDao.getMessages(thread.id, rowCount, messageLimit);
            this.props.messageActions.loadOlderMessages(threadMessages);
            setTimeout(() => {
                this.props.messageActions.resetRetainScrollPosition();
            }, 200);

        }catch(err){
            console.log("error loading messages" + err);
        }
        return groupedMessages;
    }

    selectMessageOnlyInEditingMode(message){
        if(this.props.isEditing){
            this.props.messageActions.selectMessage(message.id);
            return true;
        }
        return false;
    }

    onTabChanged(activeTab){
        if(activeTab.i == 1){
            if(this.refs.mediaGallery){
                this.refs.mediaGallery.reloadMedia();
            }
        }
    }

    render() {
        const { messages, messageActions, isEditing, scrollToBottom,
            isMediaOptionsVisible, currentThread, router, retainScrollPosition, showLoadingSpinner } = this.props;

        if(!currentThread){
            return null;
        }
        return(
            <ScrollableTabView renderTabBar={() => <MessageViewTabBar />}
                               onChangeTab={(activeTab) => this.onTabChanged(activeTab)}
                contentProps={{'keyboardShouldPersistTaps': true, 'keyboardDismissMode': 'interactive'}}>
                    <View style={styles.tabView} tabLabel="ios-chatboxes">
                        <MessageList messages={messages}
                                     ref="messageList"
                                     isEditing={isEditing}
                                     currentThread={currentThread}
                                     selectMessageOnlyInEditingMode={(message) => this.selectMessageOnlyInEditingMode(message)}
                                     selectMessage={messageActions.selectMessage}
                                     loadOlderMessages={(rowCount, messageLimit) => this.loadOlderMessages(rowCount, messageLimit)}
                                     showLoadingSpinner={showLoadingSpinner}
                                     scrollToBottom={scrollToBottom}
                                     retainScrollPosition={retainScrollPosition}
                                     resetScrollToBottom={messageActions.resetScrollToBottom}
                                     router={router}/>
                        <MessagePageFooter  isMediaOptionsVisible={isMediaOptionsVisible}
                                            isEditing={isEditing}
                                            currentThread={currentThread}
                                            messageActions={messageActions}
                                            router={router}/>
                    </View>
                    <View style={styles.tabView} tabLabel="md-images">
                        <IncrementalGroup>
                            <Incremental key="threadMedias">
                                <MediaGallery tabLabel="Media"
                                              ref="mediaGallery"
                                              threadId={currentThread.id}
                                              router={router}/>
                            </Incremental>
                        </IncrementalGroup>

                    </View>
            </ScrollableTabView>
        );
    }

}

const styles = StyleSheet.create({
    tabView: {
        width: width,
        flex: 1,
        backgroundColor: '#FAFAFA',
        // padding: 10,
        //backgroundColor: 'rgba(0,0,0,0.01)',
    },
    messagePageContainer:{
        backgroundColor: '#FAFAFA',
    },
});

function mapStateToProps(state) {
    console.log("mapStateToProps is triggered in message page");
    return {
        messages: state.messageState.messages,
        isEditing: state.messageState.isEditing,
        scrollToBottom: state.messageState.scrollToBottom,
        retainScrollPosition: state.messageState.retainScrollPosition,
        isMediaOptionsVisible: state.messageState.isMediaOptionsVisible,
        showLoadingSpinner: state.messageState.showLoadingSpinner,
        currentThread: state.threadState.currentThread
    };
}

function mapDispatchToProps(dispatch) {
    return {
        messageActions: bindActionCreators(MessageActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
