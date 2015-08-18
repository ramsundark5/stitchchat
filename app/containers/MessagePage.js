import React, { Component, View, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import MessageComposer from '../components/MessageComposer';
import MessageList from '../components/MessageList';
import * as MessageActions from '../actions/MessageActions';

class MessagePage extends Component {
    render() {
        const { messages, dispatch } = this.props;
        const actions = bindActionCreators(MessageActions, dispatch);

        return (
            <View style={styles.container}>
                <MessageComposer addMessage={actions.addMessage}/>
                <MessageList messages={messages} actions={actions}/>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        messages: state.messages
    };
}

var styles = StyleSheet.create({
    container: {
        marginTop: 40,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    }
});
export default connect(mapStateToProps)(MessagePage);
