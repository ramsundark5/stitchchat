import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/messages/MessageComposer';
import MessageList from '../components/messages/MessageList';
import * as MessageActions from '../actions/MessageActions';
import {commons} from '../styles/Styles';
import MediaOptions from '../components/media/MediaOptions';

class MessagePage extends Component {
    render() {
        const { messages, dispatch, isEditing, router } = this.props;
        const actions = bindActionCreators(MessageActions, dispatch);

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <MessageList messages={messages} isEditing={isEditing} actions={actions} router={router}/>
                </View>
                <View style={[{flex: 0}, commons.horizontalNoWrap]}>
                    <MediaOptions router={router}/>
                    <View style={{flex: 1}}>
                        <MessageComposer addMessage={actions.addMessage} isEditing={isEditing} actions={actions}/>
                    </View>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        messages: state.messages,
        isEditing: state.isEditing
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    }
});
export default connect(mapStateToProps)(MessagePage);
