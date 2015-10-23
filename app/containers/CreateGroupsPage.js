import React, { Component, View, StyleSheet, ScrollView, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import {commons} from '../components/styles/CommonStyles';
import ContactList from '../components/contacts/ContactList';
import CreateGroup from '../components/contacts/NewContactGroup';
import * as ThreadActions from '../actions/ThreadActions';
import * as ContactActions from '../actions/ContactActions';
import ContactsDao from '../dao/ContactsDao';

class CreateGroupsPage extends Component{

    constructor(props, context) {
        super(props, context);
        this.loadAllContacts();
    }

    async loadAllContacts(){
        let contacts = await ContactsDao.getAllContacts();
        this.props.contactActions.loadContacts(contacts);
    }

    componentWillUnmount(){
        this.props.contactActions.resetContactState();
    }

    render() {
        const { threadActions, contactActions, filteredContacts, selectedContacts, router } = this.props;

        return (
            <View style={commons.container}>
                <CreateGroup router={router}
                             filteredContacts={filteredContacts}
                             selectedContacts={selectedContacts}
                             selectContact={contactActions.selectContact}
                             searchContacts={contactActions.searchContacts}
                             setCurrentThread={threadActions.setCurrentThread} />
            </View>
        );

    }
}

function mapStateToProps(state) {
    return {
        filteredContacts: state.contactState.filteredContacts,
        selectedContacts: state.contactState.selectedContacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        threadActions: bindActionCreators(ThreadActions, dispatch),
        contactActions: bindActionCreators(ContactActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupsPage);