import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/MessageComposer';
import MessageList from '../components/MessageList';
import * as MessageActions from '../actions/MessageActions';

class MessagePage extends Component {
    render() {
        const { messages, dispatch, isEditing } = this.props;
        const actions = bindActionCreators(MessageActions, dispatch);

        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <MessageList messages={messages} isEditing={isEditing} actions={actions}/>
                </View>
                <View style={{flex: 0}}>
                    <MessageComposer addMessage={actions.addMessage}/>
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
        marginTop: 40,
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    }
});
export default connect(mapStateToProps)(MessagePage);
