import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import ContactList from '../components/contacts/ContactList';
import * as ThreadActions from '../actions/ThreadActions';

class ContactsPage extends Component{

    render() {
        const { threadActions, router } = this.props;

        return (
            <View style={styles.container}>
                <ContactList router={router}
                             />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch)
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
export default connect(mapStateToProps, mapDispatchToProps)(ContactsPage);