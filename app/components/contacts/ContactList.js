import React, { Component, View, Text, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../../styles/CommonStyles';
import {contactStyle} from './styles/ContactStyles';
import ContactItem from './ContactItem';
import ContactsDao from '../../dao/ContactsDao';

class ContactList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchParam: '',
            contacts: []
        };
    }

    componentDidMount(){
        let getAllContactsPromise = ContactsDao.getAllContacts();
        let that = this;
        getAllContactsPromise.then(function(contacts){
            that.setState({contacts: contacts});
        });
    }

    render() {
        //const { contacts } = this.props;
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        let allContacts = this.state.contacts;
        contactsDS = contactsDS.cloneWithRows(allContacts);
        return (
            <View style={commons.listContainer}>
                <ListView
                    dataSource={contactsDS}
                    renderRow={this.renderContactItem.bind(this)}/>
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
