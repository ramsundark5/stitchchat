import React, { Component, View, Text, TouchableHighlight } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/messages/MessageComposer';
import MessageList from '../components/messages/MessageList';
import * as MessageActions from '../actions/MessageActions';
import {commons, defaultStyle} from '../components/styles/CommonStyles';
import MediaOptions from '../components/media/MediaOptions';
import MessageDao from '../dao/MessageDao';
import Icon from 'react-native-vector-icons/Ionicons';
class MessagePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            mediaOptionsVisible: false
        };
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
        const { messages, messageActions, isEditing, currentThread, router } = this.props;

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
                {this._showMediaOptionsBox(router)}
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

    toggleShowMediaOptions(){
        let newShowMediaOptionsState = !this.state.mediaOptionsVisible;
        this.setState({mediaOptionsVisible: newShowMediaOptionsState});
    }

    _showMediaOptionsBox(router){
        if(!this.state.mediaOptionsVisible){
            return;
        }else{
         return(
            <MediaOptions router={router} animation="bounceInUp" duration={800} delay={1400}/>
         );
        }

    }

    _renderMediaOptions(isEditing, router){
        //don't show media options in editing state
        if(isEditing){
            return;
        }else{
            return (
                <View>
                    <TouchableHighlight style={commons.defaultIconContainer}
                                        onPress={this.toggleShowMediaOptions.bind(this)}>
                        <Icon name='ios-plus-empty'
                              size={defaultStyle.iconSize} color={defaultStyle.iconColor}
                              style={commons.defaultIcon}/>
                    </TouchableHighlight>
                </View>
            );
        }

    }
}

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
