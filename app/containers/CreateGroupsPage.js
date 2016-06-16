import React, {Component} from 'react';
import {View, StyleSheet, InteractionManager} from 'react-native';
import NewContactGroup from '../components/contacts/NewContactGroup';
import ContactsDao from '../dao/ContactsDao';
import JsSearch from 'js-search';

class CreateGroupsPage extends Component{

    constructor(props, context) {
        super(props, context);
        this.state = {contacts: {}, isSearching: false};
        this.searchIndex = new JsSearch.Search('phoneNumber');
        this.searchIndex.searchIndex = new JsSearch.UnorderedSearchIndex();
        this.searchIndex.addIndex('displayName');
        this.searchIndex.addIndex('phoneNumber');
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.loadRegisteredContacts();
        });
    }

    loadRegisteredContacts(){
        let showRegistered = false;
        let contacts = ContactsDao.getContacts(showRegistered);
        this.contacts = contacts;
        this.searchIndex.addDocuments(this.contacts);
        this.setState({contacts: contacts});
    }

    handleSearch(changedSearchText) {
        let matchingContacts = this.searchIndex.search(changedSearchText);
        return matchingContacts;
    }

    render() {
        const { router } = this.props;
        const { contacts } = this.state;

        return (
            <View style={styles.container}>
                <NewContactGroup router={router}
                                 handleSearch={(changedSearchText) => this.handleSearch(changedSearchText)}
                                 contacts={contacts}/>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor: '#FAFAFA',
    },
});
export default CreateGroupsPage;