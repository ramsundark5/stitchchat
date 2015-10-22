import React, { Component, View, Text, TextInput, ListView, TouchableHighlight, PropTypes } from 'react-native';
import {commons, defaultStyle} from '../styles/CommonStyles';
import {contactStyle} from './ContactStyles';
import ContactItem from './ContactItem';

class ContactList extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText: ''
        };
    }

    handleSearch(changedSearchText) {
        this.setState({searchText: changedSearchText});
        this.props.searchContacts(changedSearchText);
    }

    render() {
        const { filteredContacts } = this.props;
        let contactsDS = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2 });
        contactsDS = contactsDS.cloneWithRows(filteredContacts);
        return (
            <View style={commons.container}>
                <TextInput
                    value={this.state.searchText}
                    style={commons.searchInput}
                    placeholder="  search here"
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
                         router={this.props.router}
                         setCurrentThread={this.props.setCurrentThread}/>
        );
    }
}

ContactList.propTypes = {
    filteredContacts: PropTypes.array.isRequired,
    searchContacts: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired
};

export default ContactList;
