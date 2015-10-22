import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import {commons} from '../components/styles/CommonStyles';
import ContactList from '../components/contacts/ContactList';
import * as ThreadActions from '../actions/ThreadActions';
import * as ContactActions from '../actions/ContactActions';
import ContactsDao from '../dao/ContactsDao';

class ContactsPage extends Component{

    constructor(props, context) {
        super(props, context);
        this.loadAllContacts();
    }

    async loadAllContacts(){
        let contacts = await ContactsDao.getAllContacts();
        this.props.contactActions.loadContacts(contacts);
    }

    render() {
        const { threadActions, contactActions, filteredContacts, router } = this.props;

        return (
            <View style={commons.container}>
                <ContactList router={router}
                             filteredContacts={filteredContacts}
                             selectContact={contactActions.selectContact}
                             searchContacts={contactActions.searchContacts}
                             setCurrentThread={threadActions.setCurrentThread} />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        filteredContacts: state.contactState.filteredContacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        contactActions: bindActionCreators(ContactActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsPage);