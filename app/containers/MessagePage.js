import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/messages/MessageComposer';
import MessageList from '../components/messages/MessageList';
import * as MessageActions from '../actions/MessageActions';
import {commons} from '../styles/CommonStyles';
import MediaOptions from '../components/media/MediaOptions';

class MessagePage extends Component {

    _renderMediaOptions(isEditing, router){
        //don't show media options in editing state
        if(isEditing){
            return;
        }
        return(
            <MediaOptions router={router}/>
        );
    }

    render() {
        const { messages, messageActions, isEditing, currentThread, router } = this.props;

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <MessageList messages={messages}
                                 isEditing={isEditing}
                                 selectMessage={messageActions.selectMessage}
                                 loadOlderMessages={messageActions.loadOlderMessages}
                                 router={router}/>
                </View>
                <View style={[commons.horizontalNoWrap]}>
                    {this._renderMediaOptions(isEditing, router)}
                    <View style={{flex: 1}}>
                        <MessageComposer isEditing={isEditing}
                                         currentThread={currentThread}
                                         actions={messageActions}/>
                    </View>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    }
});

function mapStateToProps(state) {
    console.log("mapStateToProps is triggered in message page");
    return {
        messages: state.messageState.messages,
        isEditing: state.messageState.isEditing,
        currentThread: state.threadState.currentThread
    };
}

function mapDispatchToProps(dispatch) {
    return {
        messageActions: bindActionCreators(MessageActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagePage);
