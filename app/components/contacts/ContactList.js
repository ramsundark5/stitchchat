import React, { Component, View, Text, TextInput, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {contactStyle} from './styles/ContactStyles';
import ContactItem from './ContactItem';
import ContactsDao from '../../dao/ContactsDao';
import ThreadDao from '../../dao/ThreadDao';

class ContactList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: '',
            filteredContacts: []
        };
        this.contacts = [];
    }

    componentDidMount(){
        let getAllContactsPromise = ContactsDao.getAllContacts();
        let that = this;
        getAllContactsPromise.then(function(contacts){
            that.contacts = contacts;
            that.setState({filteredContacts: contacts});
        });
    }

    handleSearch(changedSearchText) {
        this.setState({searchText: changedSearchText});
        this.filterContactsList(changedSearchText);
    }

    filterContactsList(searchText){
        if(searchText){
            searchText = searchText.toLowerCase();
        }
        let currentDisplayedContacts = this.contacts;
        let filteredContacts = currentDisplayedContacts.filter(contact =>
            contact.displayName? contact.displayName.toLowerCase().includes(searchText) : false
        );
        this.setState({filteredContacts: filteredContacts});
    }

    gotoThreadViewForSelectedThread(){
        //ThreadDao.
    }

    render() {
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        let allContacts = this.state.filteredContacts;
        contactsDS = contactsDS.cloneWithRows(allContacts);
        return (
            <View style={commons.container}>
                <TextInput
                    value={this.state.searchText}
                    style={commons.searchInput}
                    onChange={(event) => this.handleSearch(event.nativeEvent.text)}/>
                <View style={commons.listContainer}>
                    <ListView
                        dataSource={contactsDS}
                        renderRow={this.renderContactItem.bind(this)}/>
                </View>
             </View>
        );
    }

    renderContactItem(rowData, sectionID, rowID) {
        return (
            <ContactItem  key={rowData.id}
                         contact={rowData}
                         router={this.props.router}/>
        );
    }
}

ContactList.propTypes = {
    contacts: PropTypes.array.isRequired,
    router: PropTypes.object.isRequired
};

export default ContactList;
